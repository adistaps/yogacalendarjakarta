import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EoEventsList from '@/components/eo/EoEventsList'
import { Plus } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Event Saya — Portal EO',
}

export default async function EoEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: eoProfile } = await supabase
    .from('eo_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!eoProfile) redirect('/login')

  const { data: events } = await supabase
    .from('events')
    .select(`
      id,
      title,
      slug,
      status,
      date_start,
      date_end,
      location_area,
      created_at,
      rejection_reason,
      ticket_types (id, name, price, quota, quota_sold)
    `)
    .eq('eo_id', eoProfile.id)
    .filter('deleted_at', 'is', null)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-semibold text-text"
            style={{ fontFamily: 'var(--font-manrope)' }}
          >
            Event Saya
          </h1>
          <p className="text-text-muted text-sm mt-1">
            {events?.length ?? 0} event ditemukan
          </p>
        </div>
        <Link
          href="/events/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white"
          style={{ background: 'linear-gradient(135deg, var(--color-primary-val), var(--color-accent))' }}
        >
          <Plus size={16} />
          Buat Event
        </Link>
      </div>

      {params.submitted && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
          ✅ Event berhasil disubmit dan sedang menunggu review admin.
        </div>
      )}

      <EoEventsList events={events ?? []} />
    </div>
  )
}
