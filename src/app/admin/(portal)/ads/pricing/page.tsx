import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import AdPricingEditor from '@/components/admin/AdPricingEditor'

export const metadata: Metadata = {
  title: 'Kelola Tarif Iklan — Portal Admin',
}

export default async function AdminAdPricingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch current ad pricing
  const { data: pricingData } = await supabase
    .from('ad_pricing')
    .select('slot_type, price_per_day')

  const heroPriceObj = pricingData?.find((p) => p.slot_type === 'hero')
  const featuredPriceObj = pricingData?.find((p) => p.slot_type === 'featured')

  const heroPrice = heroPriceObj ? Number(heroPriceObj.price_per_day) : 50000 // default fallback
  const featuredPrice = featuredPriceObj ? Number(featuredPriceObj.price_per_day) : 25000 // default fallback

  // Fetch pricing change logs
  const { data: logs } = await supabase
    .from('ad_pricing_log')
    .select('id, slot_type, old_price, new_price, changed_at, users(name)')
    .order('changed_at', { ascending: false })

  const formattedLogs = (logs || []).map((log) => ({
    id: log.id,
    slot_type: log.slot_type,
    old_price: log.old_price !== null ? Number(log.old_price) : null,
    new_price: Number(log.new_price),
    changed_at: log.changed_at,
    users: Array.isArray(log.users) ? log.users[0] : log.users,
  }))

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/ads"
          className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-text transition-colors mb-4"
        >
          <ArrowLeft size={14} />
          Kembali ke Daftar Iklan
        </Link>

        <h1
          className="text-2xl font-semibold text-text"
          style={{ fontFamily: 'var(--font-manrope)' }}
        >
          Kelola Tarif Iklan
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Sesuaikan tarif sewa slot iklan harian dan audit riwayat perubahan tarif.
        </p>
      </div>

      <AdPricingEditor
        heroPrice={heroPrice}
        featuredPrice={featuredPrice}
        logs={formattedLogs}
      />
    </div>
  )
}
