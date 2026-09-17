'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Calendar,
  MapPin,
  Ticket,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Trash2,
  QrCode,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { softDeleteEvent } from '@/app/eo/(portal)/events/actions'

interface TicketType {
  id: string
  name: string
  price: number
  quota: number
  quota_sold: number
}

interface Event {
  id: string
  title: string
  slug: string
  status: 'draft' | 'pending' | 'approved' | 'rejected'
  date_start: string
  date_end: string
  location_area: string
  created_at: string
  rejection_reason: string | null
  ticket_types: TicketType[]
}

const statusConfig = {
  draft: { label: 'Draft', bg: 'bg-gray-100', text: 'text-gray-600', icon: FileText },
  pending: { label: 'Menunggu Review', bg: 'bg-amber-100', text: 'text-amber-700', icon: Clock },
  approved: { label: 'Disetujui', bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
  rejected: { label: 'Ditolak', bg: 'bg-red-100', text: 'text-red-600', icon: XCircle },
} as const

export default function EoEventsList({ events }: { events: Event[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus event "${title}"? Event akan disembunyikan dari publik.`)) return
    setDeletingId(id)
    try {
      const result = await softDeleteEvent(id)
      if (!result.success) alert(result.error)
    } finally {
      setDeletingId(null)
    }
  }

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center">
        <Calendar size={40} className="mx-auto text-gray-300 mb-4" />
        <p className="text-text font-medium mb-1">Belum ada event</p>
        <p className="text-text-muted text-sm">Mulai buat event yoga pertama Anda</p>
        <Link
          href="/events/new"
          className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-lg text-sm font-medium text-white"
          style={{ backgroundColor: 'var(--color-primary-val)' }}
        >
          Buat Event Pertama
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {events.map((event) => {
        const config = statusConfig[event.status]
        const Icon = config.icon
        const isExpanded = expandedId === event.id
        const totalQuota = event.ticket_types.reduce((s, t) => s + t.quota, 0)
        const totalSold = event.ticket_types.reduce((s, t) => s + t.quota_sold, 0)

        return (
          <div
            key={event.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            {/* Card Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-5">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                    <Icon size={12} />
                    {config.label}
                  </span>
                </div>
                <h3 className="font-semibold text-text text-sm sm:text-base leading-snug truncate">
                  {event.title}
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                  <span className="flex items-center gap-1 text-xs text-text-muted">
                    <Calendar size={12} />
                    {new Date(event.date_start).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-text-muted">
                    <MapPin size={12} />
                    {event.location_area}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-text-muted">
                    <Ticket size={12} />
                    {totalSold}/{totalQuota} terjual
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {event.status === 'approved' && (
                  <Link
                    href={`/events/${event.id}/qrcode`}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-text hover:bg-gray-50 transition-colors"
                  >
                    <QrCode size={14} />
                    QR Code
                  </Link>
                )}
                <Link
                  href={`/attendees?event=${event.id}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-text hover:bg-gray-50 transition-colors"
                >
                  Peserta
                </Link>
                <button
                  onClick={() => handleDelete(event.id, event.title)}
                  disabled={deletingId === event.id}
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                  title="Hapus event"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={() => setExpandedId(isExpanded ? null : event.id)}
                  className="p-1.5 text-gray-400 hover:text-text transition-colors"
                >
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
            </div>

            {/* Rejection Reason */}
            {event.status === 'rejected' && event.rejection_reason && (
              <div className="mx-5 mb-4 p-3 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-xs font-medium text-red-600 mb-1">Alasan penolakan:</p>
                <p className="text-xs text-red-500">{event.rejection_reason}</p>
              </div>
            )}

            {/* Expanded: Ticket Types */}
            {isExpanded && (
              <div className="border-t border-gray-100 px-5 py-4">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Tipe Tiket</p>
                <div className="space-y-2">
                  {event.ticket_types.length === 0 ? (
                    <p className="text-xs text-text-muted">Belum ada tipe tiket</p>
                  ) : (
                    event.ticket_types.map((t) => (
                      <div key={t.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <span className="text-sm text-text">{t.name}</span>
                        <div className="flex items-center gap-4 text-xs text-text-muted">
                          <span>{t.price === 0 ? 'Gratis' : `Rp ${t.price.toLocaleString('id-ID')}`}</span>
                          <span className="text-text font-medium">{t.quota_sold}/{t.quota}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
