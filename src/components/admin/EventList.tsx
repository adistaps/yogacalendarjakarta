'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Calendar,
  Search,
  Check,
  X,
  Eye,
  Loader2,
} from 'lucide-react'
import { approveEventAction, rejectEventAction } from '@/app/admin/actions'

interface EventItem {
  id: string
  title: string
  date_start: string
  location_area: string
  status: 'draft' | 'pending' | 'approved' | 'rejected'
  rejection_reason: string | null
  created_at: string
  eo_profiles: {
    org_name: string
  } | null
}

interface EventListProps {
  initialEvents: EventItem[]
}

const statusConfig = {
  draft: { label: 'Draft', bg: 'bg-gray-100 text-gray-700' },
  pending: { label: 'Pending', bg: 'bg-amber-100 text-amber-700' },
  approved: { label: 'Approved', bg: 'bg-green-100 text-green-700' },
  rejected: { label: 'Rejected', bg: 'bg-red-100 text-red-600' },
} as const

export default function EventList({ initialEvents }: EventListProps) {
  const [events, setEvents] = useState<EventItem[]>(initialEvents)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Moderation state
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [rejectId, setRejectId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleApprove = async (id: string) => {
    setProcessingId(id)
    setError(null)
    const res = await approveEventAction(id)
    if (res.success) {
      setEvents((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: 'approved', rejection_reason: null } : item))
      )
    } else {
      setError(res.error || 'Gagal menyetujui event.')
    }
    setProcessingId(null)
  }

  const handleOpenReject = (id: string) => {
    setRejectId(id)
    setRejectReason('')
    setError(null)
  }

  const handleConfirmReject = async () => {
    if (!rejectId) return
    if (!rejectReason.trim()) {
      setError('Alasan penolakan harus diisi.')
      return
    }

    setProcessingId(rejectId)
    setError(null)
    const res = await rejectEventAction(rejectId, rejectReason)
    if (res.success) {
      setEvents((prev) =>
        prev.map((item) =>
          item.id === rejectId ? { ...item, status: 'rejected', rejection_reason: rejectReason } : item
        )
      )
      setRejectId(null)
    } else {
      setError(res.error || 'Gagal menolak event.')
    }
    setProcessingId(null)
  }

  // Filter logic
  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      ev.title.toLowerCase().includes(search.toLowerCase()) ||
      (ev.eo_profiles?.org_name && ev.eo_profiles.org_name.toLowerCase().includes(search.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || ev.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Cari judul event atau EO..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
          />
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          {['all', 'draft', 'pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${
                statusFilter === status
                  ? 'bg-text text-white border-text'
                  : 'bg-white text-text-muted border-gray-200 hover:bg-gray-50'
              }`}
            >
              {status === 'all' ? 'Semua' : status}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Grid List */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm py-20 text-center">
          <Calendar size={40} className="mx-auto text-gray-300 mb-4" />
          <p className="text-text font-medium mb-1">Tidak ada Event</p>
          <p className="text-text-muted text-sm">Hasil pencarian atau filter kosong</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((ev) => {
            const config = statusConfig[ev.status]
            return (
              <div
                key={ev.id}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.bg}`}>
                      {config.label}
                    </span>
                    <span className="text-[10px] text-text-muted">
                      {new Date(ev.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <h3 className="font-bold text-text text-base mb-1 truncate">
                    {ev.title}
                  </h3>
                  <p className="text-xs text-pink-600 font-semibold mb-3">
                    {ev.eo_profiles?.org_name || 'EO tidak dikenal'}
                  </p>
                  <div className="space-y-1 text-xs text-text-muted">
                    <p>Wilayah: {ev.location_area}</p>
                    <p>
                      Mulai:{' '}
                      {new Date(ev.date_start).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  {ev.status === 'rejected' && ev.rejection_reason && (
                    <div className="mt-3 p-3 bg-red-50/50 rounded-xl border border-red-100/50">
                      <p className="text-[10px] font-semibold text-red-600 uppercase tracking-wider mb-0.5">Alasan Penolakan:</p>
                      <p className="text-xs text-red-500">{ev.rejection_reason}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 mt-6 pt-4 border-t border-gray-50">
                  <Link
                    href={`/events/${ev.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-lg text-xs font-semibold text-text transition-colors"
                  >
                    <Eye size={12} />
                    Detail / Review
                  </Link>

                  {ev.status === 'pending' && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleApprove(ev.id)}
                        disabled={processingId !== null}
                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                      >
                        {processingId === ev.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Check size={12} />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => handleOpenReject(ev.id)}
                        disabled={processingId !== null}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                      >
                        <X size={12} />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Reject Modal Dialog */}
      {rejectId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-gray-100 shadow-2xl animate-in zoom-in-95 duration-150">
            <h3 className="font-semibold text-text text-base mb-2">
              Alasan Penolakan Event
            </h3>
            <p className="text-xs text-text-muted mb-4 leading-relaxed">
              Berikan alasan yang jelas mengapa pengajuan event ini ditolak.
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="cth. Deskripsi kurang detail / Kategori event tidak sesuai dengan Jakarta Yoga Calendar."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs text-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-200 resize-none mb-4"
              required
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setRejectId(null)}
                disabled={processingId !== null}
                className="px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-xs font-semibold text-text transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={processingId !== null || !rejectReason.trim()}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {processingId === rejectId && <Loader2 size={12} className="animate-spin" />}
                Kirim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
