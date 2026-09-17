import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  Calendar,
  Users,
  TrendingUp,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard — Portal EO',
}

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-600', icon: AlertCircle },
  pending: { label: 'Menunggu', color: 'bg-amber-100 text-amber-700', icon: Clock },
  approved: { label: 'Disetujui', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  rejected: { label: 'Ditolak', color: 'bg-red-100 text-red-600', icon: XCircle },
} as const

export default async function EoDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: eoProfile } = await supabase
    .from('eo_profiles')
    .select('id, org_name')
    .eq('user_id', user.id)
    .single()

  if (!eoProfile) redirect('/login')

  // Fetch stats
  const [eventsResult, ordersResult] = await Promise.all([
    supabase
      .from('events')
      .select('id, title, slug, status, date_start, created_at')
      .eq('eo_id', eoProfile.id)
      .filter('deleted_at', 'is', null)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('ticket_orders')
      .select('id, total_price, status, created_at, events!inner(eo_id)')
      .eq('events.eo_id', eoProfile.id)
      .eq('status', 'paid'),
  ])

  const events = eventsResult.data ?? []
  const orders = ordersResult.data ?? []

  const totalRevenue = orders.reduce((sum, o) => sum + o.total_price, 0)
  const totalSold = orders.length

  // Count by status
  const allEventsResult = await supabase
    .from('events')
    .select('status')
    .eq('eo_id', eoProfile.id)
    .filter('deleted_at', 'is', null)

  const allEvents = allEventsResult.data ?? []
  const eventCounts = {
    total: allEvents.length,
    approved: allEvents.filter(e => e.status === 'approved').length,
    pending: allEvents.filter(e => e.status === 'pending').length,
    draft: allEvents.filter(e => e.status === 'draft').length,
  }

  const stats = [
    { label: 'Total Event', value: eventCounts.total, icon: Calendar, color: 'bg-violet-50 text-violet-600' },
    { label: 'Event Aktif', value: eventCounts.approved, icon: CheckCircle, color: 'bg-green-50 text-green-600' },
    { label: 'Tiket Terjual', value: totalSold, icon: Users, color: 'bg-blue-50 text-blue-600' },
    {
      label: 'Total Pendapatan',
      value: `Rp ${(totalRevenue / 1000).toFixed(0)}k`,
      icon: TrendingUp,
      color: 'bg-pink-50 text-pink-600',
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-semibold text-text"
            style={{ fontFamily: 'var(--font-manrope)' }}
          >
            Selamat datang, {eoProfile.org_name} 👋
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Kelola event yoga Anda dari sini
          </p>
        </div>
        <Link
          href="/events/new"
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white"
          style={{ background: 'linear-gradient(135deg, var(--color-primary-val), var(--color-accent))' }}
        >
          <Plus size={16} />
          Buat Event
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon size={20} />
            </div>
            <p className="text-2xl font-semibold text-text">{value}</p>
            <p className="text-xs text-text-muted mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-text" style={{ fontFamily: 'var(--font-manrope)' }}>
            Event Terbaru
          </h2>
          <Link href="/events" className="text-xs font-medium hover:underline" style={{ color: 'var(--color-primary-val)' }}>
            Lihat semua
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-16 px-6">
            <Calendar size={40} className="mx-auto text-gray-300 mb-4" />
            <p className="text-text-muted text-sm">Belum ada event. Mulai buat event pertama Anda!</p>
            <Link
              href="/events/new"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ backgroundColor: 'var(--color-primary-val)' }}
            >
              <Plus size={14} />
              Buat Event Pertama
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {events.map((event) => {
              const config = statusConfig[event.status]
              const Icon = config.icon
              return (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text truncate">{event.title}</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {new Date(event.date_start).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
                    <Icon size={12} />
                    {config.label}
                  </span>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: '/events/new', label: 'Upload Event Baru', icon: Plus, desc: 'Buat & submit event untuk direview' },
          { href: '/attendees', label: 'Lihat Peserta', icon: Users, desc: 'Pantau pendaftar event Anda' },
          { href: '/ads', label: 'Pasang Iklan', icon: Calendar, desc: 'Promosikan event di homepage' },
        ].map(({ href, label, icon: Icon, desc }) => (
          <Link
            key={href}
            href={href}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-white"
              style={{ background: 'linear-gradient(135deg, var(--color-primary-val), var(--color-accent))' }}
            >
              <Icon size={18} />
            </div>
            <p className="text-sm font-semibold text-text group-hover:underline">{label}</p>
            <p className="text-xs text-text-muted mt-1">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
