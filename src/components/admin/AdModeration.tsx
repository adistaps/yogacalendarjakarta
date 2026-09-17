'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Megaphone,
  Check,
  X,
  ExternalLink,
  Loader2,
  Clock,
} from 'lucide-react'
import { verifyAdPaymentAction, rejectAdPaymentAction } from '@/app/admin/actions'

interface AdSlotItem {
  id: string
  slot_type: 'hero' | 'featured'
  date_start: string
  date_end: string
  amount_paid: number
  payment_proof_url: string | null
  status: 'pending_payment' | 'paid' | 'rejected'
  rejection_reason: string | null
  created_at: string
  eo_profiles: { org_name: string } | null
  events: { title: string } | null
}

interface AdModerationProps {
  initialAds: AdSlotItem[]
}

const statusConfig = {
  pending_payment: { label: 'Pending Verifikasi', bg: 'bg-amber-100 text-amber-700' },
  paid: { label: 'Paid / Aktif', bg: 'bg-green-100 text-green-700' },
  rejected: { label: 'Ditolak', bg: 'bg-red-100 text-red-600' },
} as const

export default function AdModeration({ initialAds }: AdModerationProps) {
  const [ads, setAds] = useState<AdSlotItem[]>(initialAds)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Moderation state
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [rejectId, setRejectId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleVerify = async (id: string) => {
    setProcessingId(id)
    setError(null)
    const res = await verifyAdPaymentAction(id)
    if (res.success) {
      setAds((prev) =>
        prev.map((ad) => (ad.id === id ? { ...ad, status: 'paid', rejection_reason: null, is_active: true } : ad))
      )
    } else {
      setError(res.error || 'Gagal memverifikasi pembayaran iklan.')
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
    const res = await rejectAdPaymentAction(rejectId, rejectReason)
    if (res.success) {
      setAds((prev) =>
        prev.map((ad) =>
          ad.id === rejectId ? { ...ad, status: 'rejected', rejection_reason: rejectReason } : ad
        )
      )
      setRejectId(null)
    } else {
      setError(res.error || 'Gagal menolak pembayaran iklan.')
    }
    setProcessingId(null)
  }

  const filteredAds = ads.filter((ad) => statusFilter === 'all' || ad.status === statusFilter)

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-2 items-center flex-wrap">
        {['all', 'pending_payment', 'paid', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${
              statusFilter === status
                ? 'bg-text text-white border-text'
                : 'bg-white text-text-muted border-gray-200 hover:bg-gray-50'
            }`}
          >
            {status === 'all' ? 'Semua' : status === 'pending_payment' ? 'Pending Verifikasi' : status}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm">
          {error}
        </div>
      )}

      {filteredAds.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm py-20 text-center">
          <Megaphone size={40} className="mx-auto text-gray-300 mb-4" />
          <p className="text-text font-medium mb-1">Tidak ada Pengajuan Iklan</p>
          <p className="text-text-muted text-sm font-light">Belum ada pengajuan dengan filter ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAds.map((ad) => {
            const config = statusConfig[ad.status]
            return (
              <div
                key={ad.id}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                      ad.slot_type === 'hero' ? 'bg-indigo-100 text-indigo-700' : 'bg-pink-100 text-pink-700'
                    }`}>
                      Slot: {ad.slot_type}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.bg}`}>
                      {config.label}
                    </span>
                  </div>

                  <h3 className="font-bold text-text text-base truncate mb-1">
                    Rp {ad.amount_paid.toLocaleString('id-ID')}
                  </h3>
                  <p className="text-xs font-semibold text-pink-600 mb-2 truncate">
                    Event: {ad.events?.title || 'Iklan Non-Event'}
                  </p>
                  <p className="text-xs text-text mb-4">
                    EO: {ad.eo_profiles?.org_name || 'Event Organizer'}
                  </p>

                  <div className="space-y-1 text-xs text-text-muted bg-gray-50 p-3 rounded-xl border border-gray-100/60 mb-4">
                    <p>Mulai: {new Date(ad.date_start).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p>Selesai: {new Date(ad.date_end).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p className="text-[10px] text-text-muted mt-1.5 flex items-center gap-1">
                      <Clock size={10} />
                      Diajukan: {new Date(ad.created_at).toLocaleDateString('id-ID')}
                    </p>
                  </div>

                  {ad.status === 'rejected' && ad.rejection_reason && (
                    <div className="mb-4 p-3 bg-red-50/50 rounded-xl border border-red-100/50">
                      <p className="text-[10px] font-semibold text-red-600 uppercase tracking-wider mb-0.5">Alasan Penolakan:</p>
                      <p className="text-xs text-red-500">{ad.rejection_reason}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 pt-4 border-t border-gray-50">
                  {ad.payment_proof_url && (
                    <a
                      href={ad.payment_proof_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 w-full py-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-semibold text-text transition-colors"
                    >
                      <ExternalLink size={12} />
                      Lihat Bukti Transfer
                    </a>
                  )}

                  {ad.status === 'pending_payment' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVerify(ad.id)}
                        disabled={processingId !== null}
                        className="flex items-center justify-center gap-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 flex-1"
                      >
                        {processingId === ad.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Check size={12} />
                        )}
                        Verify Paid
                      </button>
                      <button
                        onClick={() => handleOpenReject(ad.id)}
                        disabled={processingId !== null}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                      >
                        <X size={12} />
                        Tolak
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
              Alasan Penolakan Bukti Transfer
            </h3>
            <p className="text-xs text-text-muted mb-4 leading-relaxed">
              Berikan alasan mengapa pembayaran slot iklan ini tidak valid.
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="cth. Bukti transfer tidak terbaca / Jumlah transfer tidak sesuai tarif / Rekening pengirim salah."
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
