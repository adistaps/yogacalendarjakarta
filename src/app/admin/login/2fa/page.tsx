import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import QRCode from 'qrcode'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { generateSecret, signPendingSecret } from '@/lib/totp'
import TotpVerifyForm from '@/components/admin/TotpVerifyForm'

export const metadata: Metadata = {
  title: 'Verifikasi Dua Faktor (2FA) — Portal Admin',
}

export default async function Admin2faPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Redirect to login if user session does not exist
  if (!user) redirect('/admin/login')

  // Check if role is admin
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    // Force sign out if not admin
    await supabase.auth.signOut()
    redirect('/admin/login?error=unauthorized_role')
  }

  // Check if user already has a configured TOTP secret
  const adminDb = createAdminClient()
  const { data: secretData } = await adminDb
    .from('admin_totp_secrets' as any)
    .select('secret')
    .eq('user_id', user.id)
    .single() as any

  let qrCodeDataUrl: string | undefined
  let secretText: string | undefined
  let secretToken: string | undefined

  if (!secretData) {
    // First-time 2FA Setup
    const newSecret = generateSecret()
    secretText = newSecret
    secretToken = signPendingSecret(newSecret, user.id)

    const label = encodeURIComponent(`Admin:${user.email}`)
    const issuer = encodeURIComponent('Jakarta Yoga Calendar')
    const otpauth = `otpauth://totp/${label}?secret=${newSecret}&issuer=${issuer}`
    
    // Generate QR Code data URL on the server
    qrCodeDataUrl = await QRCode.toDataURL(otpauth)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--color-dark)' }}
    >
      <div className="max-w-md w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-rose-500/20 rounded-full blur-3xl" />

        <div className="relative z-10 text-center">
          <h1
            className="text-2xl font-semibold text-white tracking-tight"
            style={{ fontFamily: 'var(--font-manrope)' }}
          >
            Verifikasi Keamanan
          </h1>
          <p className="text-white/60 text-xs mt-1 mb-6">
            Langkah keamanan tambahan untuk masuk ke panel admin
          </p>

          <TotpVerifyForm
            userId={user.id}
            email={user.email ?? ''}
            qrCodeDataUrl={qrCodeDataUrl}
            secretText={secretText}
            secretToken={secretToken}
          />
        </div>
      </div>
    </div>
  )
}
