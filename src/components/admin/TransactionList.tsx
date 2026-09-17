'use client'

import { useState } from 'react'
import {
  Search,
  ArrowUpRight,
  TrendingUp,
  Ticket,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react'

interface TransactionItem {
  id: string
  buyer_name: string
  buyer_email: string
  buyer_phone: string
  total_price: number
  status: 'pending_payment' | 'paid' | 'expired' | 'cancelled'
  xendit_invoice_id: string | null
  xendit_payment_url: string | null
  paid_at: string | null
  created_at: string
  events: {
    title: string
    eo_profiles: {
      org_name: string
    } | null
  } | null
}

interface TransactionListProps {
  initialTransactions: TransactionItem[]
}

const statusConfig = {
  pending_payment: { label: 'Pending Payment', bg: 'bg-amber-100 text-amber-700' },
  paid: { label: 'Paid', bg: 'bg-green-100 text-green-700' },
  expired: { label: 'Expired', bg: 'bg-gray-100 text-gray-500' },
  cancelled: { label: 'Cancelled', bg: 'bg-red-100 text-red-600' },
} as const

export default function TransactionList({ initialTransactions }: TransactionListProps) {
  const [transactions, setTransactions] = useState<TransactionItem[]>(initialTransactions)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.buyer_name.toLowerCase().includes(search.toLowerCase()) ||
      t.buyer_email.toLowerCase().includes(search.toLowerCase()) ||
      (t.events?.title && t.events.title.toLowerCase().includes(search.toLowerCase())) ||
      (t.xendit_invoice_id && t.xendit_invoice_id.toLowerCase().includes(search.toLowerCase()))

    const matchesStatus = statusFilter === 'all' || t.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Statistics calculations
  const totalPaidCount = transactions.filter((t) => t.status === 'paid').length
  const totalPaidRevenue = transactions
    .filter((t) => t.status === 'paid')
    .reduce((sum, t) => sum + t.total_price, 0)
  const totalPendingRevenue = transactions
    .filter((t) => t.status === 'pending_payment')
    .reduce((sum, t) => sum + t.total_price, 0)

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-green-50 text-green-600 rounded-2xl">
            <TrendingUp size={22} />
          </div>
          <div>
            <p className="text-xs text-text-muted">Total Pendapatan Tiket (Paid)</p>
            <h4 className="text-lg font-bold text-text mt-0.5" style={{ fontFamily: 'var(--font-manrope)' }}>
              Rp {totalPaidRevenue.toLocaleString('id-ID')}
            </h4>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-xs text-text-muted">Pending Tickets Volume</p>
            <h4 className="text-lg font-bold text-text mt-0.5" style={{ fontFamily: 'var(--font-manrope)' }}>
              Rp {totalPendingRevenue.toLocaleString('id-ID')}
            </h4>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-pink-50 text-pink-600 rounded-2xl">
            <Ticket size={22} />
          </div>
          <div>
            <p className="text-xs text-text-muted">Tiket Sukses Terjual</p>
            <h4 className="text-lg font-bold text-text mt-0.5" style={{ fontFamily: 'var(--font-manrope)' }}>
              {totalPaidCount} Tiket
            </h4>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Cari pembeli, email, judul event, atau ID Invoice..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
          />
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          {['all', 'pending_payment', 'paid', 'expired', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${
                statusFilter === status
                  ? 'bg-text text-white border-text'
                  : 'bg-white text-text-muted border-gray-200 hover:bg-gray-50'
              }`}
            >
              {status === 'all' ? 'Semua' : status === 'pending_payment' ? 'Pending' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Ticket size={40} className="mx-auto text-gray-300 mb-4" />
            <p className="text-text font-medium mb-1">Tidak ada transaksi ditemukan</p>
            <p className="text-text-muted text-sm font-light">Coba ganti filter atau cari kata kunci lain.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-text-muted font-semibold uppercase tracking-wider">
                  <th className="p-4">Tanggal</th>
                  <th className="p-4">Pembeli</th>
                  <th className="p-4">Event & EO</th>
                  <th className="p-4 text-right">Total Tagihan</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Invoice Xendit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-text">
                {filtered.map((t) => {
                  const config = statusConfig[t.status]
                  return (
                    <tr key={t.id} className="hover:bg-gray-50/20">
                      <td className="p-4 whitespace-nowrap">
                        {new Date(t.created_at).toLocaleString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-text">{t.buyer_name}</p>
                        <p className="text-[10px] text-text-muted mt-0.5">{t.buyer_email}</p>
                        <p className="text-[10px] text-text-muted">{t.buyer_phone}</p>
                      </td>
                      <td className="p-4 max-w-xs">
                        <p className="font-semibold text-text truncate">{t.events?.title || 'Event tidak dikenal'}</p>
                        <p className="text-[10px] text-pink-600 font-semibold mt-0.5 truncate">
                          EO: {t.events?.eo_profiles?.org_name || 'Event Organizer'}
                        </p>
                      </td>
                      <td className="p-4 text-right font-bold text-text whitespace-nowrap">
                        Rp {t.total_price.toLocaleString('id-ID')}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${config.bg}`}>
                          {config.label}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {t.xendit_invoice_id ? (
                          <div className="flex flex-col items-end gap-1">
                            <span className="font-mono text-[10px] text-text-muted select-all">
                              {t.xendit_invoice_id}
                            </span>
                            {t.xendit_payment_url && (
                              <a
                                href={t.xendit_payment_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-pink-600 hover:underline"
                              >
                                Invoice Page
                                <ArrowUpRight size={10} />
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
