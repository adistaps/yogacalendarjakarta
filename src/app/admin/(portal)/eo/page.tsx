import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EoList from '@/components/admin/EoList'

export const metadata: Metadata = {
  title: 'Kelola Event Organizer — Portal Admin',
}

export default async function AdminEoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: eos } = await supabase
    .from('eo_profiles')
    .select('id, org_name, slug, bio, logo_url, whatsapp, contact_email, status, rejection_reason, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-semibold text-text"
          style={{ fontFamily: 'var(--font-manrope)' }}
        >
          Kelola Event Organizer
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Review pendaftaran EO baru dan kelola status kerja sama
        </p>
      </div>

      <EoList initialEos={eos || []} />
    </div>
  )
}
