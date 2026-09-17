import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EventList from '@/components/admin/EventList'

export const metadata: Metadata = {
  title: 'Kelola Event — Portal Admin',
}

export default async function AdminEventsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: events } = await supabase
    .from('events')
    .select('id, title, date_start, location_area, status, rejection_reason, created_at, eo_profiles(org_name)')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  const formattedEvents = (events || []).map((ev) => ({
    id: ev.id,
    title: ev.title,
    date_start: ev.date_start,
    location_area: ev.location_area,
    status: ev.status as 'draft' | 'pending' | 'approved' | 'rejected',
    rejection_reason: ev.rejection_reason,
    created_at: ev.created_at,
    eo_profiles: Array.isArray(ev.eo_profiles) ? ev.eo_profiles[0] : ev.eo_profiles,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-semibold text-text"
          style={{ fontFamily: 'var(--font-manrope)' }}
        >
          Kelola Event
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Review pengajuan event baru, kelola status publikasi, dan generate QR Code otomatis
        </p>
      </div>

      <EventList initialEvents={formattedEvents} />
    </div>
  )
}
