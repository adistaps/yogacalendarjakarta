import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  ShieldAlert,
} from 'lucide-react'
import DashboardQueue from '@/components/admin/DashboardQueue'

export const metadata: Metadata = {
  title: 'Dashboard Admin — Portal Admin',
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const adminDb = createAdminClient()

  // 1. Fetch Stats Count (with error resilience)
  const [
    eoCountResult,
    eventCountResult,
    ticketOrdersResult,
    adSlotsResult,
  ] = await Promise.all([
    supabase
      .from('eo_profiles')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'approved'),
    supabase
      .from('events')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'approved')
      .is('deleted_at', null),
    supabase
      .from('ticket_orders')
      .select('total_price')
      .eq('status', 'paid'),
    supabase
      .from('ad_slots')
      .select('amount_paid')
      .eq('status', 'paid'),
  ])

  const totalEos = eoCountResult.count || 0
  const totalEvents = eventCountResult.count || 0
  
  const totalTicketRevenue = (ticketOrdersResult.data || []).reduce(
    (sum, order) => sum + order.total_price,
    0
  )
  const totalAdRevenue = (adSlotsResult.data || []).reduce(
    (sum, slot) => sum + slot.amount_paid,
    0
  )

  // 2. Fetch Pending queues
  const [
    pendingEosResult,
    pendingEventsResult,
    pendingAdsResult,
  ] = await Promise.all([
    // EOs waiting approval
    supabase
      .from('eo_profiles')
      .select('id, org_name, contact_email, whatsapp, created_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: true }),
    // Events waiting approval
    supabase
      .from('events')
      .select('id, title, date_start, location_area, created_at, eo_profiles(org_name)')
      .eq('status', 'pending')
      .is('deleted_at', null)
      .order('created_at', { ascending: true }),
    // Ads waiting payment verification
    supabase
      .from('ad_slots')
      .select('id, slot_type, date_start, date_end, amount_paid, payment_proof_url, eo_profiles(org_name), events(title)')
      .eq('status', 'pending_payment')
      .not('payment_proof_url', 'is', null)
      .order('created_at', { ascending: true }),
  ])

  const pendingEos = (pendingEosResult.data || []).map((e) => ({
    id: e.id,
    org_name: e.org_name,
    contact_email: e.contact_email,
    whatsapp: e.whatsapp,
    created_at: e.created_at,
  }))

  const pendingEvents = (pendingEventsResult.data || []).map((ev) => ({
    id: ev.id,
    title: ev.title,
    date_start: ev.date_start,
    location_area: ev.location_area,
    created_at: ev.created_at,
    eo_profiles: ev.eo_profiles ? { org_name: ev.eo_profiles.org_name } : null,
  }))

  const pendingAds = (pendingAdsResult.data || []).map((ad) => ({
    id: ad.id,
    slot_type: ad.slot_type,
    date_start: ad.date_start,
    date_end: ad.date_end,
    amount_paid: ad.amount_paid,
    payment_proof_url: ad.payment_proof_url,
    eo_profiles: ad.eo_profiles ? { org_name: ad.eo_profiles.org_name } : null,
    events: ad.events ? { title: ad.events.title } : null,
  }))

  const stats = [
    { label: 'Event Organizer Aktif', value: totalEos, icon: Users, color: 'bg-violet-50 text-violet-600' },
    { label: 'Event Yoga Aktif', value: totalEvents, icon: Calendar, color: 'bg-emerald-50 text-emerald-600' },
    {
      label: 'Volume Penjualan Tiket',
      value: `Rp ${(totalTicketRevenue / 1000000).toFixed(1)}jt`,
      icon: DollarSign,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Pendapatan Iklan Platform',
      value: `Rp ${(totalAdRevenue / 1000000).toFixed(1)}jt`,
      icon: TrendingUp,
      color: 'bg-pink-50 text-pink-600',
    },
  ]

  const totalQueueCount = pendingEos.length + pendingEvents.length + pendingAds.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-semibold text-text"
          style={{ fontFamily: 'var(--font-manrope)' }}
        >
          Ringkasan Statistik & Antrian Moderasi
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Monitor performa platform dan kelola pengajuan sistem
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${color}`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-text">{value}</p>
              <p className="text-xs text-text-muted mt-1 leading-normal">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Alert Banner for Pending queues */}
      {totalQueueCount > 0 && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-3xl text-amber-800 text-sm">
          <ShieldAlert size={20} className="text-amber-600 flex-shrink-0" />
          <div>
            <span className="font-semibold">Perhatian:</span> Ada{' '}
            <span className="font-bold text-pink-600">{totalQueueCount}</span> pengajuan baru yang
            memerlukan moderasi atau verifikasi Anda hari ini.
          </div>
        </div>
      )}

      {/* Queue Component */}
      <DashboardQueue
        pendingEos={pendingEos}
        pendingEvents={pendingEvents}
        pendingAds={pendingAds}
      />
    </div>
  )
}
