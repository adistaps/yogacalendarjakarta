'use client'

import { useRouter } from 'next/navigation'
import { Download, Users, Search } from 'lucide-react'
import { useState } from 'react'

interface TicketType {
  name: string
  price: number
}
interface OrderItem {
  quantity: number
  attendee_name: string
  attendee_phone: string | null
  ticket_types: TicketType | null
}
interface Event {
  id: string
  title: string
  eo_id: string
}
interface Order {
  id: string
  buyer_name: string
  buyer_email: string
  buyer_phone: string
  total_price: number
  status: string
  paid_at: string | null
  created_at: string
  events: Event
  ticket_order_items: OrderItem[]
}

interface Props {
  events: { id: string; title: string; date_start: string }[]
  orders: Order[]
  selectedEventId?: string
}

function exportToCSV(orders: Order[], filename: string) {
  const rows = [
    ['Order ID', 'Nama Pembeli', 'Email', 'Telepon', 'Event', 'Tiket', 'Jumlah', 'Total', 'Tanggal Bayar'],
    ...orders.flatMap((order) =>
      order.ticket_order_items.map((item) => [
        order.id,
        order.buyer_name,
        order.buyer_email,
        order.buyer_phone,
        order.events.title,
        item.ticket_types?.name ?? '-',
        item.quantity,
        `Rp ${order.total_price.toLocaleString('id-ID')}`,
        order.paid_at
          ? new Date(order.paid_at).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
          : '-',
      ])
    ),
  ]

  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export default function AttendeesClient({ events, orders, selectedEventId }: Props) {
  const router = useRouter()
  const [search, setSearch] = useState('')

  const filtered = orders.filter((o) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      o.buyer_name.toLowerCase().includes(q) ||
      o.buyer_email.toLowerCase().includes(q) ||
      o.buyer_phone.includes(q)
    )
  })

  const selectedEvent = events.find((e) => e.id === selectedEventId)

  const handleExport = () => {
    const name = selectedEvent
      ? `peserta-${selectedEvent.title.replace(/\s+/g, '-').toLowerCase()}.csv`
      : 'peserta-semua-event.csv'
    exportToCSV(filtered, name)
  }

  return (
    <div>
      {/* Filter + Export */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select
          value={selectedEventId ?? ''}
          onChange={(e) => {
            const val = e.target.value
            router.push(val ? `/attendees?event=${val}` : '/attendees')
          }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-pink-200 bg-white"
        >
          <option value="">Semua Event</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>{e.title}</option>
          ))}
        </select>

        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama, email, telepon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-pink-200"
          />
        </div>

        <button
          onClick={handleExport}
          disabled={filtered.length === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, var(--color-primary-val), var(--color-accent))' }}
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Users size={16} />
          <span><strong className="text-text">{filtered.length}</strong> peserta ditemukan</span>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
          <Users size={36} className="mx-auto text-gray-300 mb-3" />
          <p className="text-text-muted text-sm">Belum ada peserta</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Nama', 'Email', 'Telepon', 'Event', 'Tiket', 'Total', 'Tanggal Bayar'].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-text whitespace-nowrap">{order.buyer_name}</td>
                    <td className="px-4 py-3 text-text-muted">{order.buyer_email}</td>
                    <td className="px-4 py-3 text-text-muted whitespace-nowrap">{order.buyer_phone}</td>
                    <td className="px-4 py-3 text-text-muted whitespace-nowrap">{order.events.title}</td>
                    <td className="px-4 py-3 text-text-muted">
                      {order.ticket_order_items.map((i) => (
                        <span key={i.ticket_types?.name} className="block whitespace-nowrap">
                          {i.ticket_types?.name ?? '-'} ×{i.quantity}
                        </span>
                      ))}
                    </td>
                    <td className="px-4 py-3 text-text whitespace-nowrap font-medium">
                      Rp {order.total_price.toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3 text-text-muted whitespace-nowrap">
                      {order.paid_at
                        ? new Date(order.paid_at).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
