'use server'

import { cookies } from 'next/headers'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { verifyTOTP, signSession, verifyPendingSecret } from '@/lib/totp'

export type ActionState = {
  success: boolean
  error?: string
}

export async function verifyTotpAction(
  code: string,
  secretToken?: string
): Promise<ActionState> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, error: 'Sesi login tidak valid. Silakan masuk kembali.' }
    }

    const adminDb = createAdminClient()

    let secretToVerify: string

    if (secretToken) {
      // First-time 2FA Setup
      const pendingSecret = verifyPendingSecret(secretToken, user.id)
      if (!pendingSecret) {
        return { success: false, error: 'Sesi setup kedaluwarsa. Silakan muat ulang halaman.' }
      }
      secretToVerify = pendingSecret

      // Verify the code
      const isValid = verifyTOTP(secretToVerify, code)
      if (!isValid) {
        return { success: false, error: 'Kode OTP tidak valid.' }
      }

      // Save secret permanently
      const { error: insertError } = await adminDb
        .from('admin_totp_secrets' as any)
        .insert({ user_id: user.id, secret: secretToVerify })

      if (insertError) {
        console.error('Failed to save TOTP secret:', insertError)
        return { success: false, error: 'Gagal mengaktifkan 2FA di database.' }
      }
    } else {
      // Regular 2FA Verification
      const { data: secretData, error: fetchError } = await adminDb
        .from('admin_totp_secrets' as any)
        .select('secret')
        .eq('user_id', user.id)
        .single() as any

      if (fetchError || !secretData) {
        return { success: false, error: 'Setup 2FA tidak ditemukan. Silakan hubungi developer.' }
      }
      secretToVerify = secretData.secret

      // Verify the code
      const isValid = verifyTOTP(secretToVerify, code)
      if (!isValid) {
        return { success: false, error: 'Kode OTP salah.' }
      }
    }

    // Success! Generate signed 2FA session token
    const token = signSession(user.id)

    // Set secure HTTP-Only cookie
    const cookieStore = await cookies()
    cookieStore.set({
      name: 'admin_2fa_verified',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })

    return { success: true }
  } catch (err: unknown) {
    console.error('2FA action error:', err)
    return { success: false, error: 'Terjadi kesalahan sistem.' }
  }
}
