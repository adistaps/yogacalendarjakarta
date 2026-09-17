import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AttendeesClient from '@/components/eo/AttendeesClient'

export const metadata: Metadata = {
  title: 'Peserta Event — Portal EO',
}

export default async function EoAttendeesPage({
  searchParams,
}: {
  searchParams: Promise<{ event?: string }>
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

  // Fetch EO events for filter dropdown
  const { data: events } = await supabase
    .from('events')
    .select('id, title, date_start')
    .eq('eo_id', eoProfile.id)
    .filter('deleted_at', 'is', null)
    .order('date_start', { ascending: false })

  // Fetch attendees — from ticket_orders joined via events
  const query = supabase
    .from('ticket_orders')
    .select(`
      id,
      buyer_name,
      buyer_email,
      buyer_phone,
      total_price,
      status,
      paid_at,
      created_at,
      events!inner(id, title, eo_id),
      ticket_order_items(
        quantity,
        attendee_name,
        attendee_phone,
        ticket_types(name, price)
      )
    `)
    .eq('events.eo_id', eoProfile.id)
    .eq('status', 'paid')
    .order('paid_at', { ascending: false })

  if (params.event) {
    query.eq('event_id', params.event)
  }

  const { data: orders } = await query

  return (
    <div>
      <div className="mb-8">
        <h1
          className="text-2xl font-semibold text-text"
          style={{ fontFamily: 'var(--font-manrope)' }}
        >
          Peserta
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Data peserta yang sudah melakukan pembayaran
        </p>
      </div>

      <AttendeesClient
        events={events ?? []}
        orders={orders ?? []}
        selectedEventId={params.event}
      />
    </div>
  )
}
