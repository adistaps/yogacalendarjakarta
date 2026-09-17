'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Users,
  Calendar,
  Megaphone,
  Check,
  X,
  Clock,
  ExternalLink,
  Loader2,
} from 'lucide-react'
import {
  approveEoAction,
  rejectEoAction,
  verifyAdPaymentAction,
  rejectAdPaymentAction,
} from '@/app/admin/actions'

interface PendingEo {
  id: string
  org_name: string
  contact_email: string | null
  whatsapp: string | null
  created_at: string
}

interface PendingEvent {
  id: string
  title: string
  date_start: string
  location_area: string
  created_at: string
  eo_profiles: { org_name: string } | null
}

interface PendingAd {
  id: string
  slot_type: string
  date_start: string
  date_end: string
  amount_paid: number
  payment_proof_url: string | null
  eo_profiles: { org_name: string } | null
  events: { title: string } | null
}

interface DashboardQueueProps {
  pendingEos: PendingEo[]
  pendingEvents: PendingEvent[]
  pendingAds: PendingAd[]
}

export default function DashboardQueue({
  pendingEos: initialEos,
  pendingEvents: initialEvents,
  pendingAds: initialAds,
}: DashboardQueueProps) {
  const [activeTab, setActiveTab] = useState<'eo' | 'events' | 'ads'>('eo')
  const [eos, setEos] = useState<PendingEo[]>(initialEos)
  const [events, setEvents] = useState<PendingEvent[]>(initialEvents)
  const [ads, setAds] = useState<PendingAd[]>(initialAds)

  // Moderation state
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [rejectId, setRejectId] = useState<string | null>(null)
  const [rejectType, setRejectType] = useState<'eo' | 'ad' | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleApproveEo = async (id: string) => {
    setProcessingId(id)
    setError(null)
    const res = await approveEoAction(id)
    if (res.success) {
      setEos((prev) => prev.filter((item) => item.id !== id))
    } else {
      setError(res.error || 'Gagal menyetujui EO.')
    }
    setProcessingId(null)
  }

  const handleOpenRejectDialog = (id: string, type: 'eo' | 'ad') => {
    setRejectId(id)
    setRejectType(type)
    setRejectReason('')
    setError(null)
  }

  const handleConfirmReject = async () => {
    if (!rejectId || !rejectType) return
    if (!rejectReason.trim()) {
      setError('Alasan penolakan harus diisi.')
      return
    }

    setProcessingId(rejectId)
    setError(null)
    
    let res
    if (rejectType === 'eo') {
      res = await rejectEoAction(rejectId, rejectReason)
      if (res.success) {
        setEos((prev) => prev.filter((item) => item.id !== rejectId))
        setRejectId(null)
        setRejectType(null)
      } else {
        setError(res.error || 'Gagal menolak EO.')
      }
    } else {
      res = await rejectAdPaymentAction(rejectId, rejectReason)
      if (res.success) {
        setAds((prev) => prev.filter((item) => item.id !== rejectId))
        setRejectId(null)
        setRejectType(null)
      } else {
        setError(res.error || 'Gagal menolak iklan.')
      }
    }
    setProcessingId(null)
  }

  const handleVerifyAd = async (id: string) => {
    setProcessingId(id)
    setError(null)
    const res = await verifyAdPaymentAction(id)
    if (res.success) {
      setAds((prev) => prev.filter((item) => item.id !== id))
    } else {
      setError(res.error || 'Gagal memverifikasi iklan.')
    }
    setProcessingId(null)
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mt-8">
      {/* Tabs */}
      <div className="flex border-b border-gray-100 bg-gray-50/50">
        {[
          { key: 'eo', label: 'Antrian EO', count: eos.length, icon: Users },
          { key: 'events', label: 'Antrian Event', count: events.length, icon: Calendar },
          { key: 'ads', label: 'Verifikasi Iklan', count: ads.length, icon: Megaphone },
        ].map(({ key, label, count, icon: Icon }) => (
          <button
            key={key}
            onClick={() => {
              setActiveTab(key as 'eo' | 'events' | 'ads')
              setError(null)
            }}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all border-b-2 ${
              activeTab === key
                ? 'text-pink-600 border-pink-600 bg-white'
                : 'text-text-muted border-transparent hover:text-text hover:bg-gray-100/50'
            }`}
          >
            <Icon size={16} />
            {label}
            {count > 0 && (
              <span className="px-2 py-0.5 bg-pink-100 text-pink-600 rounded-full text-xs font-bold">
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Tab EO Pending */}
        {activeTab === 'eo' && (
          <div className="space-y-4">
            {eos.length === 0 ? (
              <EmptyQueue message="Tidak ada pengajuan akun EO baru." />
            ) : (
              <div className="divide-y divide-gray-100">
                {eos.map((eo) => (
                  <div key={eo.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 first:pt-0 last:pb-0 gap-4">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-text text-sm sm:text-base truncate">
                        {eo.org_name}
                      </h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-text-muted">
                        <span>WhatsApp: {eo.whatsapp || '-'}</span>
                        <span>Email: {eo.contact_email || '-'}</span>
                        <span>
                          Daftar:{' '}
                          {new Date(eo.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleApproveEo(eo.id)}
                        disabled={processingId !== null}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                      >
                        {processingId === eo.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Check size={14} />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => handleOpenRejectDialog(eo.id, 'eo')}
                        disabled={processingId !== null}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                      >
                        <X size={14} />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Events Pending */}
        {activeTab === 'events' && (
          <div className="space-y-4">
            {events.length === 0 ? (
              <EmptyQueue message="Tidak ada event baru yang menunggu review." />
            ) : (
              <div className="divide-y divide-gray-100">
                {events.map((event) => (
                  <div key={event.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 gap-4">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-text text-sm sm:text-base truncate">
                        {event.title}
                      </h3>
                      <p className="text-xs text-text-muted mt-1">
                        Penyelenggara: {event.eo_profiles?.org_name || 'EO tidak dikenal'}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[11px] text-text-muted">
                        <span>Wilayah: {event.location_area}</span>
                        <span>
                          Tanggal Mulai:{' '}
                          {new Date(event.date_start).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/events/${event.id}`}
                      className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-xs font-semibold text-text transition-colors flex-shrink-0"
                    >
                      Review
                      <ExternalLink size={12} />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Ads Pending */}
        {activeTab === 'ads' && (
          <div className="space-y-4">
            {ads.length === 0 ? (
              <EmptyQueue message="Tidak ada pembayaran iklan yang harus diverifikasi." />
            ) : (
              <div className="divide-y divide-gray-100">
                {ads.map((ad) => (
                  <div key={ad.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 first:pt-0 last:pb-0 gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-violet-100 text-violet-700 rounded-md text-[10px] font-bold uppercase">
                          Slot: {ad.slot_type}
                        </span>
                        <span className="text-sm font-semibold text-text">
                          Rp {ad.amount_paid.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <p className="text-xs text-text font-medium truncate">
                        Event: {ad.events?.title || 'Iklan non-event'}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">
                        Penyelenggara: {ad.eo_profiles?.org_name || 'EO'}
                      </p>
                      <p className="text-[11px] text-text-muted mt-1">
                        Jadwal: {new Date(ad.date_start).toLocaleDateString('id-ID')} s.d{' '}
                        {new Date(ad.date_end).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                      {ad.payment_proof_url && (
                        <a
                          href={ad.payment_proof_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-lg text-xs font-semibold text-text flex items-center gap-1 transition-colors"
                        >
                          Bukti TF
                        </a>
                      )}
                      <button
                        onClick={() => handleVerifyAd(ad.id)}
                        disabled={processingId !== null}
                        className="flex items-center gap-1 px-3.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                      >
                        {processingId === ad.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Check size={14} />
                        )}
                        Verify
                      </button>
                      <button
                        onClick={() => handleOpenRejectDialog(ad.id, 'ad')}
                        disabled={processingId !== null}
                        className="flex items-center gap-1 px-3.5 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                      >
                        <X size={14} />
                        Tolak
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rejection Modal Dialog */}
      {rejectId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-gray-100 shadow-2xl animate-in zoom-in-95 duration-150">
            <h3 className="font-semibold text-text text-base mb-2">
              Konfirmasi Penolakan
            </h3>
            <p className="text-xs text-text-muted mb-4 leading-relaxed">
              Berikan alasan penolakan. Informasi ini akan ditampilkan kepada Event Organizer di portal mereka.
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="cth. Dokumen logo tidak valid / Bukti transfer tidak sesuai jumlah tagihan."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs text-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-200 resize-none mb-4"
              required
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setRejectId(null)
                  setRejectType(null)
                }}
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
                Kirim Penolakan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function EmptyQueue({ message }: { message: string }) {
  return (
    <div className="text-center py-10">
      <Clock size={36} className="mx-auto text-gray-300 mb-3" />
      <p className="text-text-muted text-xs font-medium">{message}</p>
    </div>
  )
}
