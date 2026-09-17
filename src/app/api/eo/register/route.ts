import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import { z } from 'zod'

const registerSchema = z.object({
  orgName: z.string().min(2),
  nama: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Data tidak valid', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { orgName, nama, email, password } = parsed.data

    // 1. Sign up user via regular client
    const supabase = await createClient()
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name: nama, role: 'eo' },
      },
    })

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        return NextResponse.json({ error: 'Email sudah terdaftar. Silakan login.' }, { status: 409 })
      }
      return NextResponse.json({ error: signUpError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Pendaftaran gagal' }, { status: 500 })
    }

    const userId = authData.user.id

    // 2. Use admin client (service role) to bypass RLS for inserting user role & eo_profiles
    const adminDb = createAdminClient()

    // Update user role to 'eo' (trigger might have set it to 'user')
    const { error: roleError } = await adminDb
      .from('users')
      .upsert({
        id: userId,
        email,
        name: nama,
        role: 'eo',
      }, { onConflict: 'id' })

    if (roleError) {
      console.error('Error updating user role:', roleError)
      // Non-fatal, continue
    }

    // 3. Insert eo_profiles using service role (bypasses RLS)
    const slug = generateSlug(orgName) + '-' + Date.now().toString(36)
    const { error: eoError } = await adminDb.from('eo_profiles').insert({
      user_id: userId,
      org_name: orgName,
      slug,
      contact_email: email,
      status: 'pending',
    })

    if (eoError) {
      console.error('Error inserting eo_profiles:', eoError)
      return NextResponse.json(
        { error: 'Gagal membuat profil EO: ' + eoError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error('EO register error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Terjadi kesalahan' },
      { status: 500 }
    )
  }
}
