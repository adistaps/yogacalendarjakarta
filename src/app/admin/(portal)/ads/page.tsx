import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Settings } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import AdModeration from '@/components/admin/AdModeration'

export const metadata: Metadata = {
  title: 'Kelola Iklan — Portal Admin',
}

export default async function AdminAdsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: ads } = await supabase
    .from('ad_slots')
    .select('id, slot_type, date_start, date_end, amount_paid, payment_proof_url, status, rejection_reason, created_at, eo_profiles(org_name), events(title)')
    .order('created_at', { ascending: false })

  const formattedAds = (ads || []).map((ad) => ({
    id: ad.id,
    slot_type: ad.slot_type as 'hero' | 'featured',
    date_start: ad.date_start,
    date_end: ad.date_end,
    amount_paid: Number(ad.amount_paid),
    payment_proof_url: ad.payment_proof_url,
    status: ad.status as 'pending_payment' | 'paid' | 'rejected',
    rejection_reason: ad.rejection_reason,
    created_at: ad.created_at,
    eo_profiles: Array.isArray(ad.eo_profiles) ? ad.eo_profiles[0] : ad.eo_profiles,
    events: Array.isArray(ad.events) ? ad.events[0] : ad.events,
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1
            className="text-2xl font-semibold text-text"
            style={{ fontFamily: 'var(--font-manrope)' }}
          >
            Kelola Iklan
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Review dan verifikasi bukti pembayaran manual untuk slot iklan Hero Banner & Featured
          </p>
        </div>

        <Link
          href="/ads/pricing"
          className="flex items-center gap-1.5 px-4 py-2.5 bg-text hover:bg-text/90 text-white rounded-xl text-xs font-semibold transition-colors"
        >
          <Settings size={14} />
          Kelola Tarif Iklan
        </Link>
      </div>

      <AdModeration initialAds={formattedAds} />
    </div>
  )
}
