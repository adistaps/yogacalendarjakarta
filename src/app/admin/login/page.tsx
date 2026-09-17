'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // 1. Login dengan email + password
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          throw new Error('Email atau password salah.')
        }
        throw authError
      }

      // 2. Cek role admin di tabel users
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Autentikasi gagal.')

      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || profile.role !== 'admin') {
        await supabase.auth.signOut()
        throw new Error('Akun ini tidak memiliki akses admin.')
      }

      // 3. Berhasil — arahkan ke halaman 2FA
      router.push('/admin/login/2fa')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login gagal. Coba lagi.')
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--color-dark)' }}
    >
      {/* Back Button */}
      <Link
        href="/"
        className="fixed top-6 left-6 flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
      >
        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-colors">
          <ArrowLeft size={18} />
        </div>
        <span className="text-sm font-medium">Web Publik</span>
      </Link>

      <div className="max-w-md w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-emerald-500/20 rounded-full blur-3xl" />

        <div className="relative z-10">
          {/* Logo/Icon */}
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6 shadow-inner">
            <ShieldCheck size={32} className="text-pink-400" />
          </div>

          <h1
            className="text-2xl font-semibold text-white tracking-tight text-center"
            style={{ fontFamily: 'var(--font-manrope)' }}
          >
            Sistem Administrasi
          </h1>
          <p className="text-white/60 text-xs mt-1 text-center mb-8">
            Jakarta Yoga Calendar — Portal Admin
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs text-white/60 mb-1.5 font-medium">
                Email Admin
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@yogacalendar.id"
                autoComplete="email"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs text-white/60 mb-1.5 font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl text-sm font-semibold hover:opacity-95 transition-opacity disabled:opacity-60 mt-2"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <ShieldCheck size={18} />
              )}
              {isLoading ? 'Memverifikasi...' : 'Masuk ke Panel Admin'}
            </button>
          </form>

          <p className="text-white/30 text-xs text-center mt-6 leading-relaxed">
            Akun admin dibuat secara manual oleh developer.<br />
            Hubungi developer jika Anda belum memiliki akses.
          </p>
        </div>
      </div>
    </div>
  )
}
