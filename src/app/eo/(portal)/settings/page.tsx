import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EoSettingsForm from '@/components/eo/EoSettingsForm'

export const metadata: Metadata = {
  title: 'Pengaturan Profil — Portal EO',
}

export default async function EoSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: eoProfile } = await supabase
    .from('eo_profiles')
    .select('id, org_name, slug, bio, logo_url, whatsapp, contact_email')
    .eq('user_id', user.id)
    .single()

  if (!eoProfile) redirect('/login')

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1
          className="text-2xl font-semibold text-text"
          style={{ fontFamily: 'var(--font-manrope)' }}
        >
          Pengaturan Profil
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Informasi ini ditampilkan di halaman publik EO Anda
        </p>
      </div>

      <EoSettingsForm profile={eoProfile} userId={user.id} />
    </div>
  )
}
