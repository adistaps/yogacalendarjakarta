import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Mail, Phone, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import EoDetailActions from '@/components/admin/EoDetailActions'

export const metadata: Metadata = {
  title: 'Detail Event Organizer — Portal Admin',
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AdminEoDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: eo } = await supabase
    .from('eo_profiles')
    .select('id, org_name, slug, bio, logo_url, whatsapp, contact_email, status, rejection_reason, created_at')
    .eq('id', id)
    .single()

  if (!eo) {
    notFound()
  }

  // Get associated events count
  const { count: eventsCount } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('eo_id', id)
    .is('deleted_at', null)

  const statusConfig = {
    pending: { label: 'Pending Review', bg: 'bg-amber-100 text-amber-700 border-amber-200' },
    approved: { label: 'Approved / Aktif', bg: 'bg-green-100 text-green-700 border-green-200' },
    rejected: { label: 'Rejected', bg: 'bg-red-100 text-red-600 border-red-200' },
  } as const

  const currentStatus = eo.status as 'pending' | 'approved' | 'rejected'
  const config = statusConfig[currentStatus] || statusConfig.pending

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back button */}
      <div>
        <Link
          href="/eo"
          className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-text transition-colors"
        >
          <ArrowLeft size={14} />
          Kembali ke Daftar EO
        </Link>
      </div>

      {/* Main Info Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between pb-6 border-b border-gray-50">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 flex items-center justify-center">
              {eo.logo_url ? (
                <Image
                  src={eo.logo_url}
                  alt={eo.org_name}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-gray-400">
                  {eo.org_name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h1
                className="text-xl md:text-2xl font-bold text-text"
                style={{ fontFamily: 'var(--font-manrope)' }}
              >
                {eo.org_name}
              </h1>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.bg}`}>
                  {config.label}
                </span>
                <span className="text-xs text-text-muted flex items-center gap-1">
                  <Calendar size={12} />
                  Terdaftar: {new Date(eo.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto">
            <EoDetailActions eoId={eo.id} status={currentStatus} />
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                Tentang Organisasi (Bio)
              </h3>
              <p className="text-sm text-text leading-relaxed whitespace-pre-line">
                {eo.bio || 'Tidak ada deskripsi/bio.'}
              </p>
            </div>

            {eo.status === 'rejected' && eo.rejection_reason && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                <h4 className="text-xs font-semibold text-red-800 uppercase tracking-wider mb-1">
                  Alasan Penolakan
                </h4>
                <p className="text-sm text-red-700">
                  {eo.rejection_reason}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4 bg-gray-50/50 rounded-2xl p-5 border border-gray-100/50">
            <h3 className="text-xs font-semibold text-text uppercase tracking-wider mb-3">
              Informasi Kontak
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2.5 text-text">
                <Mail size={14} className="text-gray-400" />
                <span className="truncate">{eo.contact_email || '-'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-text">
                <Phone size={14} className="text-gray-400" />
                <span>{eo.whatsapp || '-'}</span>
              </div>
              <div className="pt-3 border-t border-gray-200/60 mt-3 flex items-center justify-between">
                <span className="text-text-muted">Total Event:</span>
                <span className="font-semibold text-text">{eventsCount || 0} Event</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
