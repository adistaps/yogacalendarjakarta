import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import TransactionList from '@/components/admin/TransactionList'

export const metadata: Metadata = {
  title: 'Transaksi Tiket — Portal Admin',
}

export default async function AdminTransactionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch ticket orders joined with events and their EO profiles
  const { data: transactions } = await supabase
    .from('ticket_orders')
    .select(`
      id,
      buyer_name,
      buyer_email,
      buyer_phone,
      total_price,
      status,
      xendit_invoice_id,
      xendit_payment_url,
      paid_at,
      created_at,
      events (
        title,
        eo_profiles (org_name)
      )
    `)
    .order('created_at', { ascending: false })

  const formattedTransactions = (transactions || []).map((t) => ({
    id: t.id,
    buyer_name: t.buyer_name,
    buyer_email: t.buyer_email,
    buyer_phone: t.buyer_phone,
    total_price: Number(t.total_price),
    status: t.status as 'pending_payment' | 'paid' | 'expired' | 'cancelled',
    xendit_invoice_id: t.xendit_invoice_id,
    xendit_payment_url: t.xendit_payment_url,
    paid_at: t.paid_at,
    created_at: t.created_at,
    events: Array.isArray(t.events) ? t.events[0] : t.events,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-semibold text-text"
          style={{ fontFamily: 'var(--font-manrope)' }}
        >
          Transaksi Tiket
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Monitor status transaksi tiket masuk via payment gateway Xendit beserta detail pembeli
        </p>
      </div>

      <TransactionList initialTransactions={formattedTransactions} />
    </div>
  )
}
