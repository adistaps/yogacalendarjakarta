'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Coins, Loader2, Plus, Wallet, FileText, CheckCircle } from 'lucide-react'
import { recordDisbursementAction } from '@/app/admin/actions'

interface EoDisbursementSummary {
  id: string
  org_name: string
  contact_email: string | null
  whatsapp: string | null
  total_sales: number
  total_disbursed: number
  balance: number
}

interface DisbursementHistoryItem {
  id: string
  amount: number
  reference_number: string | null
  note: string | null
  disbursed_at: string
  eo_profiles: { org_name: string } | null
  users: { name: string } | null
}

interface DisbursementManagerProps {
  eos: EoDisbursementSummary[]
  history: DisbursementHistoryItem[]
}

export default function DisbursementManager({ eos, history }: DisbursementManagerProps) {
  const router = useRouter()
  const [selectedEoId, setSelectedEoId] = useState('')
  const [amount, setAmount] = useState('')
  const [referenceNumber, setReferenceNumber] = useState('')
  const [note, setNote] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const selectedEo = eos.find((e) => e.id === selectedEoId)

  const handleRecord = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEoId || !amount || !referenceNumber) {
      setError('Harap isi semua field wajib.')
      return
    }

    const numericAmount = Number(amount)
    if (numericAmount <= 0) {
      setError('Nominal transfer harus lebih besar dari 0.')
      return
    }

    if (selectedEo && numericAmount > selectedEo.balance) {
      if (!confirm('Peringatan: Nominal disbursement melebihi saldo outstanding EO. Lanjutkan?')) {
        return
      }
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    const res = await recordDisbursementAction(selectedEoId, numericAmount, referenceNumber, note)
    if (res.success) {
      setSuccess('Disbursement dana berhasil dicatat.')
      setSelectedEoId('')
      setAmount('')
      setReferenceNumber('')
      setNote('')
      router.refresh()
    } else {
      setError(res.error || 'Gagal mencatat disbursement.')
    }
    setLoading(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Recording Form & EO Balances */}
      <div className="lg:col-span-1 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="p-4 bg-green-50 border border-green-100 rounded-2xl text-green-700 text-sm">
            {success}
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Coins className="text-pink-500" size={18} />
            <h3 className="font-bold text-text text-sm uppercase tracking-wider">Input Disbursement Dana</h3>
          </div>
          <p className="text-xs text-text-muted">
            Catat pengiriman uang tiket manual ke rekening EO setelah melakukan transfer bank.
          </p>

          <form onSubmit={handleRecord} className="space-y-4">
            <div>
              <label className="text-[10px] font-semibold text-text-muted block mb-1">
                Pilih Event Organizer
              </label>
              <select
                value={selectedEoId}
                onChange={(e) => {
                  setSelectedEoId(e.target.value)
                  setError(null)
                  setSuccess(null)
                }}
                className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2 text-xs text-text focus:outline-none focus:ring-2 focus:ring-pink-200"
                required
              >
                <option value="">-- Pilih EO --</option>
                {eos.map((eo) => (
                  <option key={eo.id} value={eo.id}>
                    {eo.org_name} (Saldo: Rp {eo.balance.toLocaleString('id-ID')})
                  </option>
                ))}
              </select>
            </div>

            {selectedEo && (
              <div className="p-3.5 bg-pink-50/50 rounded-2xl border border-pink-100/50 text-xs space-y-1.5 text-text">
                <div className="flex justify-between">
                  <span className="text-text-muted">Total Penjualan:</span>
                  <span className="font-semibold">Rp {selectedEo.total_sales.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Sudah Ditransfer:</span>
                  <span className="font-semibold text-emerald-700">Rp {selectedEo.total_disbursed.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-pink-200/50">
                  <span className="text-text font-bold">Outstanding Balance:</span>
                  <span className="font-bold text-pink-600">Rp {selectedEo.balance.toLocaleString('id-ID')}</span>
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] font-semibold text-text-muted block mb-1">
                Nominal Transfer (Rp)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Nominal transfer"
                className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2 text-xs text-text focus:outline-none focus:ring-2 focus:ring-pink-200"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-text-muted block mb-1">
                Nomor Referensi Bank / Bukti Transfer
              </label>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="Cth. Ref BCA-9102381"
                className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2 text-xs text-text focus:outline-none focus:ring-2 focus:ring-pink-200"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-text-muted block mb-1">
                Catatan Internal (Opsional)
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Cth. Pembayaran tiket reguler Mei 2026"
                className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2 text-xs text-text focus:outline-none focus:ring-2 focus:ring-pink-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !selectedEoId || !amount || !referenceNumber}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Plus size={12} />
              )}
              Catat Transfer Dana
            </button>
          </form>
        </div>
      </div>

      {/* History columns */}
      <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <Wallet className="text-pink-500" size={20} />
          <h2 className="text-lg font-bold text-text" style={{ fontFamily: 'var(--font-manrope)' }}>
            Riwayat Disbursement
          </h2>
        </div>
        <p className="text-xs text-text-muted">
          Daftar lengkap dana yang telah dikirim ke Event Organizer.
        </p>

        {history.length === 0 ? (
          <p className="text-xs text-text-muted italic py-4">Belum ada riwayat disbursement dana.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-text-muted font-semibold uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Tanggal</th>
                  <th className="pb-3 font-semibold">EO / Mitra</th>
                  <th className="pb-3 font-semibold text-right">Nominal</th>
                  <th className="pb-3 font-semibold text-right">No. Referensi</th>
                  <th className="pb-3 font-semibold text-right">Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-text">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/40">
                    <td className="py-3">
                      {new Date(item.disbursed_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 font-semibold">{item.eo_profiles?.org_name || 'Mitra EO'}</td>
                    <td className="py-3 text-right font-bold text-emerald-600">
                      Rp {item.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 text-right text-text-muted select-all">
                      {item.reference_number || '-'}
                      {item.note && (
                        <span className="block text-[10px] text-gray-400 font-normal italic">
                          {item.note}
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right text-text-muted font-medium">{item.users?.name || 'Admin'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
