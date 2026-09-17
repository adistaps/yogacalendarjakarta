'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Plus,
  Trash2,
  ImagePlus,
  X,
  Loader2,
  Upload,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createEventAction, uploadEventImages, submitEventForReview } from '@/app/eo/(portal)/events/actions'

const clientEventSchema = z.object({
  title: z.string().min(5, 'Judul minimal 5 karakter'),
  description: z.string().min(20, 'Deskripsi minimal 20 karakter'),
  facilities: z.string().optional(),
  collaboration_info: z.string().optional(),
  date_start: z.string().min(1, 'Wajib diisi'),
  date_end: z.string().min(1, 'Wajib diisi'),
  time_start: z.string().min(1, 'Wajib diisi'),
  time_end: z.string().min(1, 'Wajib diisi'),
  location_area: z.string().min(1, 'Area wajib diisi'),
  location_address: z.string().min(5, 'Alamat minimal 5 karakter'),
  whatsapp_group_link: z.string().optional(),
  ticket_types: z
    .array(
      z.object({
        name: z.string().min(1, 'Nama tiket wajib diisi'),
        price: z.number().min(0, 'Harga minimal 0'),
        quota: z.number().min(1, 'Kuota minimal 1'),
      })
    )
    .min(1, 'Minimal 1 tipe tiket'),
})

type EventFormData = z.infer<typeof clientEventSchema>

const JAKARTA_AREAS = [
  'Jakarta Pusat', 'Jakarta Selatan', 'Jakarta Timur', 'Jakarta Barat', 'Jakarta Utara',
  'Depok', 'Tangerang', 'Tangerang Selatan', 'Bekasi', 'Bogor',
]

export default function CreateEventForm() {
  const router = useRouter()
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(clientEventSchema),
    defaultValues: {
      ticket_types: [{ name: 'Tiket Reguler', price: 0, quota: 50 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ticket_types',
  })

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    const remaining = 10 - imageFiles.length
    const toAdd = files.slice(0, remaining)

    const newPreviews = toAdd.map((f) => URL.createObjectURL(f))
    setImageFiles((prev) => [...prev, ...toAdd])
    setImagePreviews((prev) => [...prev, ...newPreviews])
    e.target.value = ''
  }

  const removeImage = (idx: number) => {
    URL.revokeObjectURL(imagePreviews[idx])
    setImageFiles((prev) => prev.filter((_, i) => i !== idx))
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx))
  }

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'ticket_types') {
          formData.append(key, JSON.stringify(value))
        } else if (value !== undefined) {
          formData.append(key, String(value))
        }
      })

      const result = await createEventAction(formData)
      if (!result.success) {
        setError(result.error)
        return
      }

      const { eventId } = result

      // Upload images if any
      if (imageFiles.length > 0) {
        const imgResult = await uploadEventImages(eventId, imageFiles)
        if (!imgResult.success) {
          setError(imgResult.error)
          return
        }
      }

      // Submit for review
      const submitResult = await submitEventForReview(eventId)
      if (!submitResult.success) {
        setError(submitResult.error)
        return
      }

      router.push('/events?submitted=1')
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Section: Info Dasar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-base font-semibold text-text mb-5" style={{ fontFamily: 'var(--font-manrope)' }}>
          Informasi Dasar
        </h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm text-text mb-1 block">
              Judul Event <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="cth. Morning Flow Yoga — Sesi Weekend"
              {...register('title')}
              className="border-gray-200"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <Label htmlFor="description" className="text-sm text-text mb-1 block">
              Deskripsi <span className="text-red-500">*</span>
            </Label>
            <textarea
              id="description"
              rows={5}
              placeholder="Ceritakan tentang event yoga Anda — gaya yoga, level peserta, dll."
              {...register('description')}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-200 resize-none"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <Label htmlFor="facilities" className="text-sm text-text mb-1 block">
              Fasilitas <span className="text-gray-400 text-xs">(opsional)</span>
            </Label>
            <Input
              id="facilities"
              placeholder="cth. Mat yoga disediakan, Mandi, Loker"
              {...register('facilities')}
              className="border-gray-200"
            />
          </div>

          <div>
            <Label htmlFor="collaboration_info" className="text-sm text-text mb-1 block">
              Info Kolaborasi <span className="text-gray-400 text-xs">(opsional)</span>
            </Label>
            <Input
              id="collaboration_info"
              placeholder="cth. Berkolaborasi dengan Wellness Studio"
              {...register('collaboration_info')}
              className="border-gray-200"
            />
          </div>
        </div>
      </div>

      {/* Section: Waktu & Lokasi */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-base font-semibold text-text mb-5" style={{ fontFamily: 'var(--font-manrope)' }}>
          Waktu & Lokasi
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date_start" className="text-sm text-text mb-1 block">
              Tanggal Mulai <span className="text-red-500">*</span>
            </Label>
            <Input id="date_start" type="date" {...register('date_start')} className="border-gray-200" />
            {errors.date_start && <p className="text-red-500 text-xs mt-1">{errors.date_start.message}</p>}
          </div>
          <div>
            <Label htmlFor="date_end" className="text-sm text-text mb-1 block">
              Tanggal Selesai <span className="text-red-500">*</span>
            </Label>
            <Input id="date_end" type="date" {...register('date_end')} className="border-gray-200" />
            {errors.date_end && <p className="text-red-500 text-xs mt-1">{errors.date_end.message}</p>}
          </div>
          <div>
            <Label htmlFor="time_start" className="text-sm text-text mb-1 block">
              Jam Mulai <span className="text-red-500">*</span>
            </Label>
            <Input id="time_start" type="time" {...register('time_start')} className="border-gray-200" />
            {errors.time_start && <p className="text-red-500 text-xs mt-1">{errors.time_start.message}</p>}
          </div>
          <div>
            <Label htmlFor="time_end" className="text-sm text-text mb-1 block">
              Jam Selesai <span className="text-red-500">*</span>
            </Label>
            <Input id="time_end" type="time" {...register('time_end')} className="border-gray-200" />
            {errors.time_end && <p className="text-red-500 text-xs mt-1">{errors.time_end.message}</p>}
          </div>
          <div>
            <Label htmlFor="location_area" className="text-sm text-text mb-1 block">
              Area <span className="text-red-500">*</span>
            </Label>
            <select
              id="location_area"
              {...register('location_area')}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-pink-200"
            >
              <option value="">Pilih area...</option>
              {JAKARTA_AREAS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            {errors.location_area && <p className="text-red-500 text-xs mt-1">{errors.location_area.message}</p>}
          </div>
          <div>
            <Label htmlFor="whatsapp_group_link" className="text-sm text-text mb-1 block">
              Link WhatsApp Group <span className="text-gray-400 text-xs">(opsional)</span>
            </Label>
            <Input
              id="whatsapp_group_link"
              type="url"
              placeholder="https://chat.whatsapp.com/..."
              {...register('whatsapp_group_link')}
              className="border-gray-200"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="location_address" className="text-sm text-text mb-1 block">
              Alamat Lengkap <span className="text-red-500">*</span>
            </Label>
            <Input
              id="location_address"
              placeholder="cth. Jl. Kemang Raya No. 12, Jakarta Selatan"
              {...register('location_address')}
              className="border-gray-200"
            />
            {errors.location_address && <p className="text-red-500 text-xs mt-1">{errors.location_address.message}</p>}
          </div>
        </div>
      </div>

      {/* Section: Foto Event */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-text" style={{ fontFamily: 'var(--font-manrope)' }}>
              Foto Event
            </h2>
            <p className="text-xs text-text-muted mt-1">Maks. 10 foto · JPG, PNG, WebP · Maks. 5MB/foto</p>
          </div>
          {imageFiles.length < 10 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-text hover:bg-gray-50 transition-colors"
            >
              <ImagePlus size={16} />
              Tambah Foto
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleImageAdd}
        />

        {imagePreviews.length === 0 ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-200 rounded-xl p-10 flex flex-col items-center gap-3 text-text-muted hover:border-pink-200 hover:text-pink-400 transition-colors"
          >
            <Upload size={32} />
            <p className="text-sm">Klik untuk upload foto event</p>
          </button>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {imagePreviews.map((src, idx) => (
              <div key={idx} className="relative group aspect-square">
                <img
                  src={src}
                  alt={`Foto ${idx + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
                {idx === 0 && (
                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                    Cover
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section: Tipe Tiket */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-text" style={{ fontFamily: 'var(--font-manrope)' }}>
            Tipe Tiket
          </h2>
          <button
            type="button"
            onClick={() => append({ name: '', price: 0, quota: 10 })}
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-text hover:bg-gray-50 transition-colors"
          >
            <Plus size={16} />
            Tambah Tipe
          </button>
        </div>

        {errors.ticket_types?.root && (
          <p className="text-red-500 text-xs mb-3">{errors.ticket_types.root.message}</p>
        )}

        <div className="space-y-4">
          {fields.map((field, idx) => (
            <div
              key={field.id}
              className="flex flex-col sm:flex-row gap-3 p-4 bg-gray-50 rounded-xl"
            >
              <div className="flex-1">
                <Label className="text-xs text-text-muted mb-1 block">Nama Tiket</Label>
                <Input
                  placeholder="cth. Early Bird, VIP, Reguler"
                  {...register(`ticket_types.${idx}.name`)}
                  className="border-gray-200 bg-white"
                />
                {errors.ticket_types?.[idx]?.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.ticket_types[idx]?.name?.message}</p>
                )}
              </div>
              <div className="w-full sm:w-36">
                <Label className="text-xs text-text-muted mb-1 block">Harga (Rp)</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  {...register(`ticket_types.${idx}.price`, { valueAsNumber: true })}
                  className="border-gray-200 bg-white"
                />
                {errors.ticket_types?.[idx]?.price && (
                  <p className="text-red-500 text-xs mt-1">{errors.ticket_types[idx]?.price?.message}</p>
                )}
              </div>
              <div className="w-full sm:w-28">
                <Label className="text-xs text-text-muted mb-1 block">Kuota</Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="50"
                  {...register(`ticket_types.${idx}.quota`, { valueAsNumber: true })}
                  className="border-gray-200 bg-white"
                />
                {errors.ticket_types?.[idx]?.quota && (
                  <p className="text-red-500 text-xs mt-1">{errors.ticket_types[idx]?.quota?.message}</p>
                )}
              </div>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="self-end sm:self-center p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-200 rounded-lg text-sm font-medium text-text hover:bg-gray-50 transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, var(--color-primary-val), var(--color-accent))' }}
        >
          {isSubmitting && <Loader2 size={16} className="animate-spin" />}
          {isSubmitting ? 'Menyimpan...' : 'Submit untuk Review'}
        </button>
      </div>
    </form>
  )
}
