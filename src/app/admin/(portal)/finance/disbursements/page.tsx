import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DisbursementManager from '@/components/admin/DisbursementManager'

export const metadata: Metadata = {
  title: 'Disbursement Keuangan — Portal Admin',
}

export default async function AdminDisbursementsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch all EO profiles
  const { data: eoProfiles } = await supabase
    .from('eo_profiles')
    .select('id, org_name, contact_email, whatsapp')
    .eq('status', 'approved')
    .order('org_name', { ascending: true })

  // Fetch all paid ticket orders with the event's EO ID
  const { data: ticketOrders } = await supabase
    .from('ticket_orders')
    .select('total_price, events(eo_id)')
    .eq('status', 'paid')

  // Fetch all disbursements
  const { data: disbursements } = await supabase
    .from('disbursements')
    .select('eo_id, amount')

  // Calculate sales and disbursements per EO
  const eoSummaries = (eoProfiles || []).map((eo) => {
    // Total sales
    const totalSales = (ticketOrders || [])
      .filter((o) => {
        const ev = Array.isArray(o.events) ? o.events[0] : o.events
        return ev && ev.eo_id === eo.id
      })
      .reduce((sum, o) => sum + Number(o.total_price), 0)

    // Total disbursed
    const totalDisbursed = (disbursements || [])
      .filter((d) => d.eo_id === eo.id)
      .reduce((sum, d) => sum + Number(d.amount), 0)

    return {
      id: eo.id,
      org_name: eo.org_name,
      contact_email: eo.contact_email,
      whatsapp: eo.whatsapp,
      total_sales: totalSales,
      total_disbursed: totalDisbursed,
      balance: totalSales - totalDisbursed,
    }
  })

  // Fetch complete disbursement log history
  const { data: history } = await supabase
    .from('disbursements')
    .select('id, amount, reference_number, note, disbursed_at, eo_profiles(org_name), users(name)')
    .order('disbursed_at', { ascending: false })

  const formattedHistory = (history || []).map((item) => ({
    id: item.id,
    amount: Number(item.amount),
    reference_number: item.reference_number,
    note: item.note,
    disbursed_at: item.disbursed_at,
    eo_profiles: Array.isArray(item.eo_profiles) ? item.eo_profiles[0] : item.eo_profiles,
    users: Array.isArray(item.users) ? item.users[0] : item.users,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-semibold text-text"
          style={{ fontFamily: 'var(--font-manrope)' }}
        >
          Disbursement Keuangan
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Monitor saldo outstanding penjualan tiket EO, catat disbursement baru, dan kelola histori transfer dana
        </p>
      </div>

      <DisbursementManager eos={eoSummaries} history={formattedHistory} />
    </div>
  )
}
