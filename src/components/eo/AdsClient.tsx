'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Megaphone, Star, Layout, Clock, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

const adSchema = z.object({
  event_id: z.string().min(1, 'Pilih event'),
  slot_type: z.enum(['hero', 'featured']),
  date_start: z.string().min(1, 'Tanggal mulai wajib diisi'),
  date_end: z.string().min(1, 'Tanggal selesai wajib diisi'),
})

type AdForm = z.infer<typeof adSchema>

interface AdEvent { id: string; title: string }
interface MyAd {
  id: string
  slot_type: string
  date_start: string
  date_end: string
  amount_paid: number
  status: string
  rejection_reason: string | null
  is_active: boolean
  events: { title: string; slug: string } | null
}

interface Props {
  events: AdEvent[]
  myAds: MyAd[]
  heroPricePerDay: number
  featuredPricePerDay: number
  eoId: string
}

const statusConfig = {
  pending_payment: { label: 'Menunggu Pembayaran', color: 'bg-amber-100 text-amber-700', icon: Clock },
  paid: { label: 'Aktif', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  rejected: { label: 'Ditolak', color: 'bg-red-100 text-red-600', icon: XCircle },
} as const

export default function AdsClient({ events, myAds, heroPricePerDay, featuredPricePerDay, eoId }: Props) {
  const supabase = createClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [estimatedCost, setEstimatedCost] = useState(0)

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<AdForm>({
    resolver: zodResolver(adSchema),
    defaultValues: { slot_type: 'featured' },
  })

  const watchSlotType = watch('slot_type')
  const watchStart = watch('date_start')
  const watchEnd = watch('date_end')

  // Calculate estimated cost
  const calcCost = () => {
    if (!watchStart || !watchEnd) return 0
    const days = Math.max(1, Math.ceil(
      (new Date(watchEnd).getTime() - new Date(watchStart).getTime()) / (1000 * 60 * 60 * 24) + 1
    ))
    return days * (watchSlotType === 'hero' ? heroPricePerDay : featuredPricePerDay)
  }

  const onSubmit = async (data: AdForm) => {
    setIsSubmitting(true)
    setError(null)
    try {
      const cost = calcCost()
      const { error: insertError } = await supabase.from('ad_slots').insert({
        eo_id: eoId,
        event_id: data.event_id,
        slot_type: data.slot_type,
        date_start: data.date_start,
        date_end: data.date_end,
        amount_paid: cost,
        status: 'pending_payment',
      })
      if (insertError) throw insertError
      setSuccess(true)
      reset()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal mengajukan iklan')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pricing Cards */}
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {[
            { type: 'hero', label: 'Slot Hero', icon: Star, desc: 'Banner besar di atas homepage', price: heroPricePerDay, color: 'from-violet-500 to-purple-600' },
            { type: 'featured', label: 'Slot Featured', icon: Layout, desc: 'Kartu event di bagian featured', price: featuredPricePerDay, color: 'from-pink-500 to-rose-500' },
          ].map(({ type, label, icon: Icon, desc, price, color }) => (
            <div key={type} className={`rounded-2xl p-5 text-white bg-gradient-to-br ${color}`}>
              <Icon size={24} className="mb-3 opacity-80" />
              <p className="font-semibold text-sm">{label}</p>
              <p className="text-white/70 text-xs mt-1 mb-3">{desc}</p>
              <p className="text-xl font-bold">Rp {(price / 1000).toFixed(0)}k</p>
              <p className="text-white/70 text-xs">per hari</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-text mb-5" style={{ fontFamily: 'var(--font-manrope)' }}>
            Ajukan Slot Iklan
          </h2>

          {events.length === 0 ? (
            <div className="text-center py-8 text-text-muted">
              <AlertCircle size={32} className="mx-auto text-amber-400 mb-3" />
              <p className="text-sm">Anda belum punya event yang disetujui.</p>
              <p className="text-xs mt-1">Buat dan submit event dulu untuk bisa memasang iklan.</p>
            </div>
          ) : (
            <>
              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  ✅ Pengajuan iklan berhasil! Silakan lakukan pembayaran sesuai instruksi yang akan dikirim via email.
                </div>
              )}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label className="text-sm text-text mb-1 block">Event</Label>
                  <select
                    {...register('event_id')}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-pink-200"
                  >
                    <option value="">Pilih event...</option>
                    {events.map((e) => (
                      <option key={e.id} value={e.id}>{e.title}</option>
                    ))}
                  </select>
                  {errors.event_id && <p className="text-red-500 text-xs mt-1">{errors.event_id.message}</p>}
                </div>

                <div>
                  <Label className="text-sm text-text mb-1 block">Tipe Slot</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['featured', 'hero'] as const).map((type) => (
                      <label key={type} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-pink-200 has-[:checked]:border-pink-400 has-[:checked]:bg-pink-50 transition-all">
                        <input
                          type="radio"
                          value={type}
                          {...register('slot_type')}
                          className="accent-pink-500"
                        />
                        <span className="text-sm capitalize">{type === 'hero' ? '⭐ Hero' : '📌 Featured'}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm text-text mb-1 block">Tanggal Mulai</Label>
                    <Input type="date" {...register('date_start')} className="border-gray-200" />
                    {errors.date_start && <p className="text-red-500 text-xs mt-1">{errors.date_start.message}</p>}
                  </div>
                  <div>
                    <Label className="text-sm text-text mb-1 block">Tanggal Selesai</Label>
                    <Input type="date" {...register('date_end')} className="border-gray-200" />
                    {errors.date_end && <p className="text-red-500 text-xs mt-1">{errors.date_end.message}</p>}
                  </div>
                </div>

                {watchStart && watchEnd && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-text-muted">Estimasi biaya:</p>
                    <p className="text-lg font-semibold text-text">
                      Rp {calcCost().toLocaleString('id-ID')}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, var(--color-primary-val), var(--color-accent))' }}
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  Ajukan Iklan
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* My Ads History */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-text mb-5" style={{ fontFamily: 'var(--font-manrope)' }}>
          Riwayat Iklan
        </h2>
        {myAds.length === 0 ? (
          <div className="text-center py-12 text-text-muted">
            <Megaphone size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm">Belum ada iklan yang diajukan</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myAds.map((ad) => {
              const cfg = statusConfig[ad.status as keyof typeof statusConfig] ?? statusConfig.pending_payment
              const Icon = cfg.icon
              return (
                <div key={ad.id} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-text">{ad.events?.title ?? '—'}</p>
                      <p className="text-xs text-text-muted mt-0.5 capitalize">
                        Slot {ad.slot_type} · {new Date(ad.date_start).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} — {new Date(ad.date_end).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${cfg.color}`}>
                      <Icon size={11} />
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-text mt-2">
                    Rp {ad.amount_paid.toLocaleString('id-ID')}
                  </p>
                  {ad.rejection_reason && (
                    <p className="text-xs text-red-500 mt-1">{ad.rejection_reason}</p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
