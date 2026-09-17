'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { randomUUID } from 'crypto'

const ticketTypeSchema = z.object({
  name: z.string().min(1, 'Nama tiket wajib diisi'),
  price: z.coerce.number().min(0, 'Harga minimal 0'),
  quota: z.coerce.number().min(1, 'Kuota minimal 1'),
})

const eventSchema = z.object({
  title: z.string().min(5, 'Judul minimal 5 karakter'),
  description: z.string().min(20, 'Deskripsi minimal 20 karakter'),
  facilities: z.string().optional(),
  collaboration_info: z.string().optional(),
  date_start: z.string().min(1, 'Tanggal mulai wajib diisi'),
  date_end: z.string().min(1, 'Tanggal selesai wajib diisi'),
  time_start: z.string().min(1, 'Jam mulai wajib diisi'),
  time_end: z.string().min(1, 'Jam selesai wajib diisi'),
  location_area: z.string().min(1, 'Area wajib diisi'),
  location_address: z.string().min(5, 'Alamat minimal 5 karakter'),
  whatsapp_group_link: z.string().url('URL WhatsApp tidak valid').optional().or(z.literal('')),
  ticket_types: z.string().min(1, 'Minimal 1 tipe tiket'),
})

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export type ActionResult = { success: false; error: string } | { success: true; eventId: string }

export async function createEventAction(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Tidak terautentikasi' }

  const { data: eoProfile } = await supabase
    .from('eo_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!eoProfile) return { success: false, error: 'Profil EO tidak ditemukan' }

  // Server-side validation
  const raw = {
    title: formData.get('title'),
    description: formData.get('description'),
    facilities: formData.get('facilities'),
    collaboration_info: formData.get('collaboration_info'),
    date_start: formData.get('date_start'),
    date_end: formData.get('date_end'),
    time_start: formData.get('time_start'),
    time_end: formData.get('time_end'),
    location_area: formData.get('location_area'),
    location_address: formData.get('location_address'),
    whatsapp_group_link: formData.get('whatsapp_group_link'),
    ticket_types: formData.get('ticket_types'),
  }

  const parsed = eventSchema.safeParse(raw)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]
    return { success: false, error: firstError.message }
  }

  const { ticket_types: ticketTypesJson, ...eventData } = parsed.data

  // Parse ticket types
  let ticketTypes: z.infer<typeof ticketTypeSchema>[]
  try {
    const rawTickets = JSON.parse(ticketTypesJson) as unknown[]
    const validated = rawTickets.map((t) => ticketTypeSchema.parse(t))
    ticketTypes = validated
  } catch {
    return { success: false, error: 'Format tipe tiket tidak valid' }
  }

  // Generate unique slug
  let slug = generateSlug(eventData.title)
  const { count } = await supabase
    .from('events')
    .select('id', { count: 'exact' })
    .like('slug', `${slug}%`)
  if (count && count > 0) {
    slug = `${slug}-${Date.now()}`
  }

  // Insert event
  const { data: newEvent, error: eventError } = await supabase
    .from('events')
    .insert({
      eo_id: eoProfile.id,
      title: eventData.title,
      slug,
      description: eventData.description,
      facilities: eventData.facilities || null,
      collaboration_info: eventData.collaboration_info || null,
      date_start: eventData.date_start,
      date_end: eventData.date_end,
      time_start: eventData.time_start,
      time_end: eventData.time_end,
      location_area: eventData.location_area,
      location_address: eventData.location_address,
      whatsapp_group_link: eventData.whatsapp_group_link || null,
      status: 'draft',
    })
    .select('id')
    .single()

  if (eventError || !newEvent) {
    console.error('Event insert error:', eventError)
    return { success: false, error: 'Gagal membuat event' }
  }

  // Insert ticket types
  if (ticketTypes.length > 0) {
    const { error: ticketError } = await supabase.from('ticket_types').insert(
      ticketTypes.map((t) => ({
        event_id: newEvent.id,
        name: t.name,
        price: t.price,
        quota: t.quota,
        quota_sold: 0,
      }))
    )
    if (ticketError) {
      console.error('Ticket types insert error:', ticketError)
      // Soft cleanup
      await supabase.from('events').delete().eq('id', newEvent.id)
      return { success: false, error: 'Gagal menyimpan tipe tiket' }
    }
  }

  revalidatePath('/events')
  revalidatePath('/dashboard')

  return { success: true, eventId: newEvent.id }
}

export async function uploadEventImages(
  eventId: string,
  files: File[]
): Promise<ActionResult> {
  const supabase = await createClient()

  const validTypes = ['image/jpeg', 'image/png', 'image/webp']
  const maxSize = 5 * 1024 * 1024 // 5MB

  const uploadResults: string[] = []

  for (const file of files) {
    if (!validTypes.includes(file.type)) {
      return { success: false, error: `Tipe file tidak valid: ${file.name}. Hanya JPG, PNG, WebP.` }
    }
    if (file.size > maxSize) {
      return { success: false, error: `File ${file.name} terlalu besar. Maksimal 5MB per foto.` }
    }

    const ext = file.name.split('.').pop()
    const filename = `${randomUUID()}.${ext}`
    const { error } = await supabase.storage
      .from('event-images')
      .upload(`events/${eventId}/${filename}`, file, { upsert: false })

    if (error) {
      console.error('Upload error:', error)
      return { success: false, error: `Gagal upload ${file.name}` }
    }

    const { data: urlData } = supabase.storage
      .from('event-images')
      .getPublicUrl(`events/${eventId}/${filename}`)

    uploadResults.push(urlData.publicUrl)
  }

  // Insert image records
  if (uploadResults.length > 0) {
    await supabase.from('event_images').insert(
      uploadResults.map((url, index) => ({
        event_id: eventId,
        url,
        order_index: index,
      }))
    )
  }

  return { success: true, eventId }
}

export async function submitEventForReview(eventId: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Tidak terautentikasi' }

  const { error } = await supabase
    .from('events')
    .update({ status: 'pending' })
    .eq('id', eventId)
    .eq('eo_id', (await supabase.from('eo_profiles').select('id').eq('user_id', user.id).single()).data?.id ?? '')

  if (error) return { success: false, error: 'Gagal submit event' }

  revalidatePath('/events')
  revalidatePath('/dashboard')

  return { success: true, eventId }
}

export async function softDeleteEvent(eventId: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Tidak terautentikasi' }

  const { data: eoProfile } = await supabase
    .from('eo_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!eoProfile) return { success: false, error: 'Profil EO tidak ditemukan' }

  const { error } = await supabase
    .from('events')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', eventId)
    .eq('eo_id', eoProfile.id)

  if (error) return { success: false, error: 'Gagal menghapus event' }

  revalidatePath('/events')
  revalidatePath('/dashboard')

  return { success: true, eventId }
}
