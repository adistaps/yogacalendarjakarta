'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, Loader2 } from 'lucide-react'
import { approveEoAction, rejectEoAction } from '@/app/admin/actions'

interface EoDetailActionsProps {
  eoId: string
  status: 'pending' | 'approved' | 'rejected'
}

export default function EoDetailActions({ eoId, status }: EoDetailActionsProps) {
  const router = useRouter()
  const [processing, setProcessing] = useState(false)
  const [rejectMode, setRejectMode] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (status !== 'pending') return null

  const handleApprove = async () => {
    setProcessing(true)
    setError(null)
    const res = await approveEoAction(eoId)
    if (res.success) {
      router.refresh()
    } else {
      setError(res.error || 'Gagal menyetujui EO.')
      setProcessing(false)
    }
  }

  const handleConfirmReject = async () => {
    if (!rejectReason.trim()) {
      setError('Alasan penolakan harus diisi.')
      return
    }

    setProcessing(true)
    setError(null)
    const res = await rejectEoAction(eoId, rejectReason)
    if (res.success) {
      setRejectMode(false)
      router.refresh()
    } else {
      setError(res.error || 'Gagal menolak EO.')
      setProcessing(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm">
          {error}
        </div>
      )}

      {!rejectMode ? (
        <div className="flex items-center gap-3">
          <button
            onClick={handleApprove}
            disabled={processing}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 flex-1"
          >
            {processing ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Check size={16} />
            )}
            Setujui Pendaftaran EO
          </button>
          <button
            onClick={() => setRejectMode(true)}
            disabled={processing}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
          >
            <X size={16} />
            Tolak
          </button>
        </div>
      ) : (
        <div className="bg-red-50/50 border border-red-100 rounded-2xl p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-red-800 block mb-1">
              Alasan Penolakan EO
            </label>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Berikan alasan yang jelas kepada EO..."
              className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2 text-xs text-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-200 resize-none"
              required
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setRejectMode(false)}
              disabled={processing}
              className="px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg text-xs font-semibold text-text transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleConfirmReject}
              disabled={processing || !rejectReason.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {processing && <Loader2 size={12} className="animate-spin" />}
              Kirim Penolakan
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
