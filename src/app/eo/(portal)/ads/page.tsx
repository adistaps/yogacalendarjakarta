import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdsClient from '@/components/eo/AdsClient'

export const metadata: Metadata = {
  title: 'Iklan — Portal EO',
}

export default async function EoAdsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: eoProfile } = await supabase
    .from('eo_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!eoProfile) redirect('/login')

  // Fetch pricing
  const { data: pricing } = await supabase
    .from('ad_pricing')
    .select('slot_type, price_per_day')

  // Fetch existing ads
  const { data: myAds } = await supabase
    .from('ad_slots')
    .select('id, slot_type, date_start, date_end, amount_paid, status, rejection_reason, is_active, events(title, slug)')
    .eq('eo_id', eoProfile.id)
    .order('created_at', { ascending: false })

  // Fetch approved events for selection
  const { data: events } = await supabase
    .from('events')
    .select('id, title')
    .eq('eo_id', eoProfile.id)
    .eq('status', 'approved')
    .filter('deleted_at', 'is', null)

  const heroPricePerDay = pricing?.find((p) => p.slot_type === 'hero')?.price_per_day ?? 500000
  const featuredPricePerDay = pricing?.find((p) => p.slot_type === 'featured')?.price_per_day ?? 200000

  return (
    <div>
      <div className="mb-8">
        <h1
          className="text-2xl font-semibold text-text"
          style={{ fontFamily: 'var(--font-manrope)' }}
        >
          Pasang Iklan
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Promosikan event Anda di posisi premium homepage
        </p>
      </div>

      <AdsClient
        events={events ?? []}
        myAds={myAds ?? []}
        heroPricePerDay={heroPricePerDay}
        featuredPricePerDay={featuredPricePerDay}
        eoId={eoProfile.id}
      />
    </div>
  )
}
