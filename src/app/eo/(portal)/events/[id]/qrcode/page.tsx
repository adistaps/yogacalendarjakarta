import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import QrCodeDisplay from '@/components/eo/QrCodeDisplay'

export const metadata: Metadata = {
  title: 'QR Code Event — Portal EO',
}

export default async function QrCodePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: eoProfile } = await supabase
    .from('eo_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!eoProfile) redirect('/login')

  const { data: event } = await supabase
    .from('events')
    .select('id, title, slug, status, qr_code_url')
    .eq('id', id)
    .eq('eo_id', eoProfile.id)
    .filter('deleted_at', 'is', null)
    .single()

  if (!event) notFound()

  const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://yogacalendar.id'}/events/${event.slug}`

  return (
    <div className="max-w-lg mx-auto">
      <h1
        className="text-2xl font-semibold text-text mb-2"
        style={{ fontFamily: 'var(--font-manrope)' }}
      >
        QR Code Event
      </h1>
      <p className="text-text-muted text-sm mb-8">{event.title}</p>

      <QrCodeDisplay
        eventId={event.id}
        eventTitle={event.title}
        publicUrl={publicUrl}
        savedQrUrl={event.qr_code_url}
        isApproved={event.status === 'approved'}
      />
    </div>
  )
}
