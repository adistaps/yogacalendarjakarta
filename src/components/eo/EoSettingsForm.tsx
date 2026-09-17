'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Camera, Loader2, CheckCircle, ExternalLink } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

const settingsSchema = z.object({
  org_name: z.string().min(2, 'Nama organisasi minimal 2 karakter'),
  bio: z.string().max(500, 'Bio maksimal 500 karakter').optional().or(z.literal('')),
  whatsapp: z.string().optional().or(z.literal('')),
  contact_email: z.string().email('Email tidak valid').optional().or(z.literal('')),
})

type SettingsForm = z.infer<typeof settingsSchema>

interface Profile {
  id: string
  org_name: string
  slug: string
  bio: string | null
  logo_url: string | null
  whatsapp: string | null
  contact_email: string | null
}

interface Props {
  profile: Profile
  userId: string
}

export default function EoSettingsForm({ profile, userId }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(profile.logo_url)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      org_name: profile.org_name,
      bio: profile.bio ?? '',
      whatsapp: profile.whatsapp ?? '',
      contact_email: profile.contact_email ?? '',
    },
  })

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setError('Tipe file tidak valid. Hanya JPG, PNG, atau WebP.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5MB.')
      return
    }

    setUploadingLogo(true)
    setError(null)

    try {
      const ext = file.name.split('.').pop()
      const filename = `${crypto.randomUUID()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('eo-logos')
        .upload(`logos/${profile.id}/${filename}`, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('eo-logos')
        .getPublicUrl(`logos/${profile.id}/${filename}`)

      const newUrl = urlData.publicUrl

      const { error: updateError } = await supabase
        .from('eo_profiles')
        .update({ logo_url: newUrl })
        .eq('id', profile.id)

      if (updateError) throw updateError

      setLogoPreview(newUrl)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal upload logo')
    } finally {
      setUploadingLogo(false)
    }
  }

  const onSubmit = async (data: SettingsForm) => {
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const { error: updateError } = await supabase
        .from('eo_profiles')
        .update({
          org_name: data.org_name,
          bio: data.bio || null,
          whatsapp: data.whatsapp || null,
          contact_email: data.contact_email || null,
        })
        .eq('id', profile.id)

      if (updateError) throw updateError

      setSuccess(true)
      router.refresh()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan pengaturan')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-center gap-2">
          <CheckCircle size={16} />
          Profil berhasil diperbarui!
        </div>
      )}

      {/* Logo Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-text mb-5" style={{ fontFamily: 'var(--font-manrope)' }}>
          Logo Organisasi
        </h2>
        <div className="flex items-center gap-6">
          <div className="relative">
            {logoPreview ? (
              <img src={logoPreview} alt="Logo" className="w-20 h-20 rounded-2xl object-cover" />
            ) : (
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold"
                style={{ background: 'linear-gradient(135deg, var(--color-primary-val), var(--color-accent))' }}
              >
                {profile.org_name.charAt(0).toUpperCase()}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingLogo}
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
            >
              {uploadingLogo ? (
                <Loader2 size={14} className="animate-spin text-gray-400" />
              ) : (
                <Camera size={14} className="text-gray-500" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleLogoChange}
            />
          </div>
          <div>
            <p className="text-sm text-text font-medium">Ganti logo</p>
            <p className="text-xs text-text-muted mt-0.5">JPG, PNG, atau WebP. Maks 5MB.</p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="text-base font-semibold text-text mb-2" style={{ fontFamily: 'var(--font-manrope)' }}>
            Informasi Profil
          </h2>

          <div>
            <Label htmlFor="org_name" className="text-sm text-text mb-1 block">
              Nama Organisasi <span className="text-red-500">*</span>
            </Label>
            <Input
              id="org_name"
              {...register('org_name')}
              className="border-gray-200"
            />
            {errors.org_name && <p className="text-red-500 text-xs mt-1">{errors.org_name.message}</p>}
          </div>

          <div>
            <Label className="text-sm text-text mb-1 block">
              Slug (URL Profil)
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-muted">yogacalendar.id/eo/</span>
              <span className="text-sm font-medium text-text">{profile.slug}</span>
              <a
                href={`/eo/${profile.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-text transition-colors"
              >
                <ExternalLink size={14} />
              </a>
            </div>
            <p className="text-xs text-text-muted mt-1">Slug tidak bisa diubah</p>
          </div>

          <div>
            <Label htmlFor="bio" className="text-sm text-text mb-1 block">Bio</Label>
            <textarea
              id="bio"
              rows={4}
              {...register('bio')}
              placeholder="Ceritakan tentang organisasi Anda..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-200 resize-none"
            />
            {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="whatsapp" className="text-sm text-text mb-1 block">WhatsApp</Label>
              <Input
                id="whatsapp"
                type="tel"
                placeholder="08xx-xxxx-xxxx"
                {...register('whatsapp')}
                className="border-gray-200"
              />
            </div>
            <div>
              <Label htmlFor="contact_email" className="text-sm text-text mb-1 block">Email Kontak</Label>
              <Input
                id="contact_email"
                type="email"
                placeholder="info@organisasi.com"
                {...register('contact_email')}
                className="border-gray-200"
              />
              {errors.contact_email && <p className="text-red-500 text-xs mt-1">{errors.contact_email.message}</p>}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, var(--color-primary-val), var(--color-accent))' }}
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              Simpan Perubahan
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
