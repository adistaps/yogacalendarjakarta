import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Calendar, Clock, MapPin, Users, HelpCircle, Phone } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import EventDetailActions from '@/components/admin/EventDetailActions'

export const metadata: Metadata = {
  title: 'Review Detail Event — Portal Admin',
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AdminEventDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch event details along with EO profile and images
  const { data: event } = await supabase
    .from('events')
    .select(`
      *,
      eo_profiles (
        id,
        org_name,
        contact_email,
        whatsapp
      )
    `)
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (!event) {
    notFound()
  }

  // Fetch event images
  const { data: images } = await supabase
    .from('event_images')
    .select('url, order_index')
    .eq('event_id', id)
    .order('order_index', { ascending: true })

  // Fetch ticket types
  const { data: ticketTypes } = await supabase
    .from('ticket_types')
    .select('name, price, quota, quota_sold')
    .eq('event_id', id)

  const statusConfig = {
    draft: { label: 'Draft', bg: 'bg-gray-100 text-gray-700 border-gray-200' },
    pending: { label: 'Pending Review', bg: 'bg-amber-100 text-amber-700 border-amber-200' },
    approved: { label: 'Approved / Aktif', bg: 'bg-green-100 text-green-700 border-green-200' },
    rejected: { label: 'Rejected', bg: 'bg-red-100 text-red-600 border-red-200' },
  } as const

  const currentStatus = event.status as 'draft' | 'pending' | 'approved' | 'rejected'
  const config = statusConfig[currentStatus] || statusConfig.pending

  const eo = Array.isArray(event.eo_profiles) ? event.eo_profiles[0] : event.eo_profiles

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Back button */}
      <div>
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-text transition-colors"
        >
          <ArrowLeft size={14} />
          Kembali ke Daftar Event
        </Link>
      </div>

      {/* Hero Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.bg}`}>
              {config.label}
            </span>
            <span className="text-xs text-text-muted">
              Diajukan pada: {new Date(event.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
          <h1
            className="text-xl md:text-2xl font-bold text-text"
            style={{ fontFamily: 'var(--font-manrope)' }}
          >
            {event.title}
          </h1>
          <p className="text-sm text-pink-600 font-semibold mt-1">
            Penyelenggara: {eo?.org_name || 'EO tidak dikenal'}
          </p>
        </div>

        <div className="w-full md:w-auto">
          <EventDetailActions eventId={event.id} status={currentStatus} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Event details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photos Gallery */}
          {images && images.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Foto Event ({images.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                    <Image
                      src={img.url}
                      alt={`${event.title} - ${idx}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description & Details */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                Deskripsi Event
              </h3>
              <p className="text-sm text-text leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {event.facilities && (
              <div>
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                  Fasilitas
                </h3>
                <p className="text-sm text-text leading-relaxed whitespace-pre-line">
                  {event.facilities}
                </p>
              </div>
            )}

            {event.collaboration_info && (
              <div>
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                  Info Kolaborasi / Partnership
                </h3>
                <p className="text-sm text-text leading-relaxed whitespace-pre-line">
                  {event.collaboration_info}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Meta Info & Status */}
        <div className="space-y-6">
          {/* Event Metadata (Date, Time, Location) */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Detail Pelaksanaan
            </h3>

            <div className="space-y-3.5">
              <div className="flex gap-3">
                <Calendar size={18} className="text-pink-500 mt-0.5 flex-shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold text-text">Tanggal</p>
                  <p className="text-text-muted">
                    {new Date(event.date_start).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                    {event.date_start !== event.date_end && (
                      <>
                        {' '}s.d.{' '}
                        {new Date(event.date_end).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Clock size={18} className="text-pink-500 mt-0.5 flex-shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold text-text">Waktu</p>
                  <p className="text-text-muted">
                    {event.time_start.slice(0, 5)} - {event.time_end.slice(0, 5)} WIB
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <MapPin size={18} className="text-pink-500 mt-0.5 flex-shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold text-text">Lokasi</p>
                  <p className="text-text-muted font-medium">{event.location_area}</p>
                  <p className="text-text-muted mt-0.5">{event.location_address}</p>
                </div>
              </div>

              {event.whatsapp_group_link && (
                <div className="flex gap-3 pt-3 border-t border-gray-100">
                  <Phone size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-text">Link WA Group Peserta</p>
                    <a
                      href={event.whatsapp_group_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:underline break-all font-medium"
                    >
                      {event.whatsapp_group_link}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ticket Quota */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Jenis & Kuota Tiket
            </h3>

            {ticketTypes && ticketTypes.length > 0 ? (
              <div className="space-y-3">
                {ticketTypes.map((ticket, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-text">{ticket.name}</p>
                      <p className="text-pink-600 font-semibold mt-0.5">
                        {ticket.price === 0 ? 'Gratis' : `Rp ${ticket.price.toLocaleString('id-ID')}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-text font-medium">Terjual: {ticket.quota_sold}</p>
                      <p className="text-text-muted mt-0.5">Kuota: {ticket.quota}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-text-muted">Tidak ada tipe tiket yang dibuat.</p>
            )}
          </div>

          {/* QR Code and Admin Notes */}
          {(event.qr_code_url || event.admin_note || event.rejection_reason) && (
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Informasi Admin
              </h3>

              {event.qr_code_url && (
                <div className="space-y-2 text-center p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-semibold text-text uppercase tracking-wider">QR Code Publik</p>
                  <div className="relative w-32 h-32 mx-auto bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <Image
                      src={event.qr_code_url}
                      alt="QR Code Event"
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <a
                    href={event.qr_code_url}
                    download={`qrcode-${event.slug}.png`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs font-semibold text-pink-600 hover:underline"
                  >
                    Buka Gambar QR Code
                  </a>
                </div>
              )}

              {event.admin_note && (
                <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">Catatan Admin:</p>
                  <p className="text-xs text-text">{event.admin_note}</p>
                </div>
              )}

              {event.status === 'rejected' && event.rejection_reason && (
                <div className="p-3.5 bg-red-50 border border-red-100 rounded-2xl">
                  <p className="text-[10px] font-semibold text-red-800 uppercase tracking-wider mb-1">Alasan Penolakan:</p>
                  <p className="text-xs text-red-700">{event.rejection_reason}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
