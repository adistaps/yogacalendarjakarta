'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Coins, Loader2, Save, History } from 'lucide-react'
import { updateAdPricingAction } from '@/app/admin/actions'

interface PricingLog {
  id: string
  slot_type: string
  old_price: number | null
  new_price: number
  changed_at: string
  users: { name: string } | null
}

interface AdPricingEditorProps {
  heroPrice: number
  featuredPrice: number
  logs: PricingLog[]
}

export default function AdPricingEditor({
  heroPrice: initialHeroPrice,
  featuredPrice: initialFeaturedPrice,
  logs,
}: AdPricingEditorProps) {
  const router = useRouter()
  const [heroPrice, setHeroPrice] = useState(initialHeroPrice)
  const [featuredPrice, setFeaturedPrice] = useState(initialFeaturedPrice)

  const [loadingType, setLoadingType] = useState<'hero' | 'featured' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleUpdatePrice = async (type: 'hero' | 'featured', price: number) => {
    setLoadingType(type)
    setError(null)
    setSuccess(null)
    const res = await updateAdPricingAction(type, price)
    if (res.success) {
      setSuccess(`Tarif slot ${type} berhasil diperbarui.`)
      router.refresh()
    } else {
      setError(res.error || `Gagal memperbarui tarif slot ${type}.`)
    }
    setLoadingType(null)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Forms column */}
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

        {/* Hero Banner Pricing Card */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Coins className="text-pink-500" size={18} />
            <h3 className="font-bold text-text text-sm uppercase tracking-wider">Tarif Hero Banner</h3>
          </div>
          <p className="text-xs text-text-muted">
            Tentukan harga sewa per hari untuk slider utama di homepage.
          </p>
          <div className="space-y-3">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-text-muted">
                Rp
              </span>
              <input
                type="number"
                value={heroPrice}
                onChange={(e) => setHeroPrice(Number(e.target.value))}
                placeholder="Tarif per hari"
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-text font-semibold focus:outline-none focus:ring-2 focus:ring-pink-200"
              />
            </div>
            <button
              onClick={() => handleUpdatePrice('hero', heroPrice)}
              disabled={loadingType !== null || heroPrice <= 0}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {loadingType === 'hero' ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Save size={12} />
              )}
              Simpan Tarif Hero
            </button>
          </div>
        </div>

        {/* Featured Section Pricing Card */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Coins className="text-pink-500" size={18} />
            <h3 className="font-bold text-text text-sm uppercase tracking-wider">Tarif Featured Event</h3>
          </div>
          <p className="text-xs text-text-muted">
            Tentukan harga sewa per hari untuk slot event pilihan di grid homepage.
          </p>
          <div className="space-y-3">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-text-muted">
                Rp
              </span>
              <input
                type="number"
                value={featuredPrice}
                onChange={(e) => setFeaturedPrice(Number(e.target.value))}
                placeholder="Tarif per hari"
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-text font-semibold focus:outline-none focus:ring-2 focus:ring-pink-200"
              />
            </div>
            <button
              onClick={() => handleUpdatePrice('featured', featuredPrice)}
              disabled={loadingType !== null || featuredPrice <= 0}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {loadingType === 'featured' ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Save size={12} />
              )}
              Simpan Tarif Featured
            </button>
          </div>
        </div>
      </div>

      {/* Audit Log column */}
      <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <History className="text-pink-500" size={20} />
          <h2 className="text-lg font-bold text-text" style={{ fontFamily: 'var(--font-manrope)' }}>
            Log Riwayat Perubahan Tarif
          </h2>
        </div>
        <p className="text-xs text-text-muted">
          Catatan riwayat audit lengkap ketika ada penyesuaian tarif iklan oleh admin.
        </p>

        {logs.length === 0 ? (
          <p className="text-xs text-text-muted italic py-4">Belum ada riwayat perubahan tarif.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-text-muted font-semibold uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Waktu</th>
                  <th className="pb-3 font-semibold">Slot Iklan</th>
                  <th className="pb-3 font-semibold text-right">Tarif Lama</th>
                  <th className="pb-3 font-semibold text-right">Tarif Baru</th>
                  <th className="pb-3 font-semibold text-right">Diubah Oleh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-text">
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="py-3">
                      {new Date(log.changed_at).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 capitalize font-semibold">{log.slot_type}</td>
                    <td className="py-3 text-right text-text-muted">
                      {log.old_price !== null ? `Rp ${log.old_price.toLocaleString('id-ID')}` : '-'}
                    </td>
                    <td className="py-3 text-right font-bold text-pink-600">
                      Rp {log.new_price.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 text-right font-medium">{log.users?.name || 'Admin'}</td>
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
