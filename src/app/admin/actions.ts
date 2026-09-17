'use server'

import { revalidatePath } from 'next/cache'
import QRCode from 'qrcode'
import { createAdminClient, createClient } from '@/lib/supabase/server'

export type ActionState = {
  success: boolean
  error?: string
}

/**
 * Checks if the current session belongs to an authorized admin.
 */
async function verifyAdminAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Tidak terautentikasi')

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    throw new Error('Tidak memiliki otorisasi admin')
  }

  return user.id
}

/**
 * Approve an EO profile.
 */
export async function approveEoAction(eoId: string): Promise<ActionState> {
  try {
    await verifyAdminAuth()
    const supabase = await createClient()

    const { error } = await supabase
      .from('eo_profiles')
      .update({ status: 'approved', rejection_reason: null })
      .eq('id', eoId)

    if (error) throw error

    revalidatePath('/dashboard')
    revalidatePath('/eo')
    return { success: true }
  } catch (err: unknown) {
    console.error('approveEoAction error:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Gagal menyetujui EO' }
  }
}

/**
 * Reject an EO profile with a reason.
 */
export async function rejectEoAction(eoId: string, reason: string): Promise<ActionState> {
  try {
    if (!reason.trim()) return { success: false, error: 'Alasan penolakan harus diisi.' }
    await verifyAdminAuth()
    const supabase = await createClient()

    const { error } = await supabase
      .from('eo_profiles')
      .update({ status: 'rejected', rejection_reason: reason })
      .eq('id', eoId)

    if (error) throw error

    revalidatePath('/dashboard')
    revalidatePath('/eo')
    return { success: true }
  } catch (err: unknown) {
    console.error('rejectEoAction error:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Gagal menolak EO' }
  }
}

/**
 * Approve an event, generate its QR Code, upload it to storage, and save the URL.
 */
export async function approveEventAction(
  eventId: string,
  adminNote?: string
): Promise<ActionState> {
  try {
    await verifyAdminAuth()
    
    // We use the admin client (service role) to bypass RLS policies and handle storage upload safely.
    const adminDb = createAdminClient()

    // 1. Fetch event slug and title
    const { data: event, error: fetchError } = await adminDb
      .from('events')
      .select('title, slug')
      .eq('id', eventId)
      .single()

    if (fetchError || !event) {
      return { success: false, error: 'Event tidak ditemukan.' }
    }

    // 2. Generate QR Code PNG buffer
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yogacalendar.id'
    const publicEventUrl = `${appUrl}/events/${event.slug}`
    
    const qrBuffer = await QRCode.toBuffer(publicEventUrl, {
      width: 512,
      margin: 2,
    })

    // 3. Upload QR Code to Supabase Storage event-images bucket
    const fileName = `events/${eventId}/qrcode.png`
    const { error: uploadError } = await adminDb.storage
      .from('event-images')
      .upload(fileName, qrBuffer, {
        contentType: 'image/png',
        upsert: true,
      })

    if (uploadError) {
      console.error('QR code upload error:', uploadError)
      return { success: false, error: 'Gagal mengupload QR Code event.' }
    }

    // 4. Get public URL of the uploaded QR Code
    const { data: { publicUrl } } = adminDb.storage
      .from('event-images')
      .getPublicUrl(fileName)

    // 5. Update event status, note, and QR Code URL
    const { error: updateError } = await adminDb
      .from('events')
      .update({
        status: 'approved',
        qr_code_url: publicUrl,
        admin_note: adminNote || null,
        rejection_reason: null,
      })
      .eq('id', eventId)

    if (updateError) throw updateError

    revalidatePath('/dashboard')
    revalidatePath('/events')
    return { success: true }
  } catch (err: unknown) {
    console.error('approveEventAction error:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Gagal menyetujui event' }
  }
}

/**
 * Reject an event with a reason.
 */
export async function rejectEventAction(eventId: string, reason: string): Promise<ActionState> {
  try {
    if (!reason.trim()) return { success: false, error: 'Alasan penolakan harus diisi.' }
    await verifyAdminAuth()
    const supabase = await createClient()

    const { error } = await supabase
      .from('events')
      .update({
        status: 'rejected',
        rejection_reason: reason,
      })
      .eq('id', eventId)

    if (error) throw error

    revalidatePath('/dashboard')
    revalidatePath('/events')
    return { success: true }
  } catch (err: unknown) {
    console.error('rejectEventAction error:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Gagal menolak event' }
  }
}

/**
 * Verify paid ad payment, scheduling the ad.
 */
export async function verifyAdPaymentAction(adId: string): Promise<ActionState> {
  try {
    await verifyAdminAuth()
    const supabase = await createClient()

    const { error } = await supabase
      .from('ad_slots')
      .update({
        status: 'paid',
        is_active: true,
        rejection_reason: null,
      })
      .eq('id', adId)

    if (error) throw error

    revalidatePath('/dashboard')
    revalidatePath('/ads')
    return { success: true }
  } catch (err: unknown) {
    console.error('verifyAdPaymentAction error:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Gagal memverifikasi iklan' }
  }
}

/**
 * Reject ad payment.
 */
export async function rejectAdPaymentAction(adId: string, reason: string): Promise<ActionState> {
  try {
    if (!reason.trim()) return { success: false, error: 'Alasan penolakan harus diisi.' }
    await verifyAdminAuth()
    const supabase = await createClient()

    const { error } = await supabase
      .from('ad_slots')
      .update({
        status: 'rejected',
        rejection_reason: reason,
        is_active: false,
      })
      .eq('id', adId)

    if (error) throw error

    revalidatePath('/dashboard')
    revalidatePath('/ads')
    return { success: true }
  } catch (err: unknown) {
    console.error('rejectAdPaymentAction error:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Gagal menolak pembayaran iklan' }
  }
}

/**
 * Update ad pricing rate and write audit log.
 */
export async function updateAdPricingAction(
  slotType: 'hero' | 'featured',
  pricePerDay: number
): Promise<ActionState> {
  try {
    const adminId = await verifyAdminAuth()
    const supabase = await createClient()

    // 1. Get old price
    const { data: pricing } = await supabase
      .from('ad_pricing')
      .select('price_per_day')
      .eq('slot_type', slotType)
      .single()

    const oldPrice = pricing?.price_per_day || 0

    // 2. Upsert the ad pricing
    const { error: upsertError } = await supabase
      .from('ad_pricing')
      .upsert(
        {
          slot_type: slotType,
          price_per_day: pricePerDay,
          updated_by_admin: adminId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'slot_type' }
      )

    if (upsertError) throw upsertError

    // 3. Write audit log
    const { error: logError } = await supabase
      .from('ad_pricing_log')
      .insert({
        slot_type: slotType,
        old_price: oldPrice,
        new_price: pricePerDay,
        changed_by: adminId,
        changed_at: new Date().toISOString(),
      })

    if (logError) throw logError

    revalidatePath('/ads/pricing')
    return { success: true }
  } catch (err: unknown) {
    console.error('updateAdPricingAction error:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Gagal mengubah harga iklan' }
  }
}

/**
 * Add an event to the curated calendar.
 */
export async function addCalendarEventAction(
  eventId: string,
  displayDate: string
): Promise<ActionState> {
  try {
    const adminId = await verifyAdminAuth()
    const supabase = await createClient()

    const { error } = await supabase
      .from('calendar_events')
      .insert({
        event_id: eventId,
        display_date: displayDate,
        created_by_admin: adminId,
      })

    if (error) throw error

    revalidatePath('/homepage')
    revalidatePath('/')
    return { success: true }
  } catch (err: unknown) {
    console.error('addCalendarEventAction error:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Gagal menambah event kalender' }
  }
}

/**
 * Remove an event from the curated calendar.
 */
export async function deleteCalendarEventAction(calendarEventId: string): Promise<ActionState> {
  try {
    await verifyAdminAuth()
    const supabase = await createClient()

    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', calendarEventId)

    if (error) throw error

    revalidatePath('/homepage')
    revalidatePath('/')
    return { success: true }
  } catch (err: unknown) {
    console.error('deleteCalendarEventAction error:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Gagal menghapus event kalender' }
  }
}

/**
 * Toggle ad slot active status.
 */
export async function toggleAdActiveAction(adId: string, isActive: boolean): Promise<ActionState> {
  try {
    await verifyAdminAuth()
    const supabase = await createClient()

    const { error } = await supabase
      .from('ad_slots')
      .update({ is_active: isActive })
      .eq('id', adId)

    if (error) throw error

    revalidatePath('/homepage')
    revalidatePath('/ads')
    revalidatePath('/')
    return { success: true }
  } catch (err: unknown) {
    console.error('toggleAdActiveAction error:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Gagal mengubah status aktif iklan' }
  }
}

/**
 * Record a disbursement to an EO.
 */
export async function recordDisbursementAction(
  eoId: string,
  amount: number,
  referenceNumber: string,
  note?: string
): Promise<ActionState> {
  try {
    const adminId = await verifyAdminAuth()
    const supabase = await createClient()

    const { error } = await supabase
      .from('disbursements')
      .insert({
        eo_id: eoId,
        amount,
        reference_number: referenceNumber,
        note: note || null,
        disbursed_by: adminId,
        status: 'completed',
      })

    if (error) throw error

    revalidatePath('/finance/disbursements')
    return { success: true }
  } catch (err: unknown) {
    console.error('recordDisbursementAction error:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Gagal mencatat disbursement' }
  }
}

