import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, CheckCircle, Mail } from 'lucide-react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export const metadata: Metadata = {
  title: 'Menunggu Persetujuan — Portal EO',
  description: 'Akun EO Anda sedang dalam proses review oleh admin.',
};

export default async function PendingPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: profile, error } = await supabase
      .from('eo_profiles')
      .select('status')
      .eq('user_id', user.id)
      .single();
    if (!error && profile?.status !== 'pending') {
      redirect('/eo/dashboard');
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        <div className="w-24 h-24 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-8">
          <Clock size={40} className="text-amber-500" />
        </div>
        <h1 className="text-3xl font-light text-text mb-4" style={{ fontFamily: 'var(--font-manrope)' }}>
          Akun Sedang Direview
        </h1>
        <p className="text-text-muted leading-relaxed mb-8" style={{ fontFamily: 'var(--font-manrope)', fontWeight: 300 }}>
          Terima kasih telah mendaftar sebagai Event Organizer di Jakarta Yoga Calendar.
          Tim kami sedang memverifikasi informasi Anda. Proses ini biasanya memakan waktu{' '}
          <strong className="text-text font-medium">1–2 hari kerja</strong>.
        </p>
        <div className="text-left bg-gray-50 rounded-2xl p-6 mb-8 space-y-4">
          {[{ icon: CheckCircle, label: 'Pendaftaran diterima', done: true },
            { icon: Clock, label: 'Review oleh tim admin', done: false, active: true },
            { icon: CheckCircle, label: 'Akun diaktifkan & siap digunakan', done: false }].map(({ icon: Icon, label, done, active }) => (
            <div key={label} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-green-100' : active ? 'bg-amber-100' : 'bg-gray-200'}`}> 
                <Icon size={16} className={done ? 'text-green-600' : active ? 'text-amber-600' : 'text-gray-400'} />
              </div>
              <span className={`text-sm ${done || active ? 'text-text font-medium' : 'text-text-muted'}`}>{label}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 justify-center text-sm text-text-muted mb-8">
          <Mail size={16} />
          <span>Kami akan mengirim email saat akun Anda disetujui</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/eo/login" className="px-6 py-3 border border-gray-200 rounded-lg text-sm font-medium text-text hover:bg-gray-50 transition-colors">
            Kembali ke Login
          </Link>
          <a href="mailto:support@yogacalendar.id" className="px-6 py-3 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90" style={{ backgroundColor: 'var(--color-primary-val)' }}>
            Hubungi Support
          </a>
        </div>
      </div>
    </div>
  );
}
