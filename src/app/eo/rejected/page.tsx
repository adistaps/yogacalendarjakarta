import type { Metadata } from 'next'
import Link from 'next/link'
import { XCircle, Mail, RefreshCw } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pendaftaran Ditolak — Portal EO',
  description: 'Pendaftaran EO Anda tidak dapat disetujui.',
}

export default function RejectedPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        {/* Icon */}
        <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-8">
          <XCircle size={40} className="text-red-400" />
        </div>

        <h1
          className="text-3xl font-light text-text mb-4"
          style={{ fontFamily: 'var(--font-manrope)' }}
        >
          Pendaftaran Tidak Disetujui
        </h1>

        <p
          className="text-text-muted leading-relaxed mb-8"
          style={{ fontFamily: 'var(--font-manrope)', fontWeight: 300 }}
        >
          Maaf, pendaftaran Anda sebagai Event Organizer tidak dapat kami setujui saat ini.
          Tim admin mungkin memiliki catatan khusus mengenai hal ini.
        </p>

        {/* Info box */}
        <div className="text-left bg-red-50 border border-red-100 rounded-2xl p-6 mb-8">
          <h3 className="text-sm font-semibold text-text mb-3">Kemungkinan alasan penolakan:</h3>
          <ul className="space-y-2 text-sm text-text-muted">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-red-400">•</span>
              Informasi yang diberikan tidak lengkap atau tidak valid
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-red-400">•</span>
              Organisasi tidak memenuhi kriteria Event Organizer kami
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-red-400">•</span>
              Duplikasi akun dengan organisasi yang sudah terdaftar
            </li>
          </ul>
        </div>

        <p className="text-sm text-text-muted mb-8">
          Jika Anda merasa ini adalah kesalahan atau ingin mengajukan banding,{' '}
          silakan hubungi tim kami dengan menyertakan email yang digunakan saat pendaftaran.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 border border-gray-200 rounded-lg text-sm font-medium text-text hover:bg-gray-50 transition-colors"
          >
            Kembali ke Beranda
          </Link>
          <a
            href="mailto:support@yogacalendar.id?subject=Banding Penolakan EO"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary-val)' }}
          >
            <Mail size={16} />
            Hubungi Admin
          </a>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors"
          >
            <RefreshCw size={14} />
            Daftar ulang dengan akun baru
          </Link>
        </div>
      </div>
    </div>
  )
}
