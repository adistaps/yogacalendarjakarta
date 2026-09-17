'use client'

import { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

type LoginForm = z.infer<typeof loginSchema>

function EoLoginFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (searchParams.get('registered') === '1') {
      setSuccessMessage('Pendaftaran berhasil! Silakan login dengan akun Anda.')
    }
  }, [searchParams])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    setError(null)
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })
      if (authError) throw authError

      // Check EO profile status
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Autentikasi gagal')

      const { data: eoProfile } = await supabase
        .from('eo_profiles')
        .select('status')
        .eq('user_id', user.id)
        .single()

      if (!eoProfile) {
        setError('Akun EO tidak ditemukan. Silakan daftar terlebih dahulu.')
        await supabase.auth.signOut()
        return
      }

      if (eoProfile.status === 'pending') {
        router.push('/eo/pending')
      } else if (eoProfile.status === 'rejected') {
        router.push('/eo/rejected')
      } else {
        router.push('/eo/dashboard')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login gagal'
      if (message.includes('Invalid login credentials')) {
        setError('Email atau password salah.')
      } else {
        setError(message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="lg:hidden text-center mb-8">
        <span className="text-xs tracking-widest uppercase text-text-muted">Jakarta Yoga Calendar</span>
      </div>

      <h2 className="text-3xl font-light text-text mb-2" style={{ fontFamily: 'var(--font-manrope)' }}>
        Masuk ke Portal EO
      </h2>
      <p className="text-text-muted text-sm mb-8" style={{ fontFamily: 'var(--font-manrope)', fontWeight: 300 }}>
        Belum punya akun?{' '}
        <Link href="/eo/register" className="font-medium hover:underline" style={{ color: 'var(--color-primary-val)' }}>
          Daftar sebagai EO
        </Link>
      </p>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs text-text-muted bg-white px-4">
          atau masuk dengan email
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label htmlFor="email" className="text-sm text-text mb-1 block">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="nama@email.com"
            {...register('email')}
            className="border-gray-200"
            autoComplete="email"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="password" className="text-sm text-text mb-1 block">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password')}
              className="border-gray-200 pr-10"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 text-white transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
          style={{
            backgroundColor: 'var(--color-primary-val)',
            fontFamily: 'var(--font-manrope)',
            fontWeight: 500,
            fontSize: '0.8rem',
            letterSpacing: '0.05em',
            borderRadius: '4px',
          }}
        >
          {isLoading && <Loader2 size={16} className="animate-spin" />}
          MASUK
        </button>
      </form>
    </div>
  )
}

export default function EoLoginPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[4fr_6fr] relative">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
      >
        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-white/30 transition-colors">
          <ArrowLeft size={18} />
        </div>
      </button>

      {/* Left Panel */}
      <div
        className="hidden lg:flex relative overflow-hidden flex-col items-center justify-center"
        style={{ backgroundColor: 'var(--color-dark)' }}
      >
        <Image
          src="https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80"
          alt="Yoga studio"
          fill
          className="object-cover opacity-30"
        />
        <div className="relative z-10 text-center px-12">
          <svg width="48" height="48" viewBox="0 0 32 32" fill="none" className="mx-auto mb-6">
            <path d="M16 28C16 28 4 20 4 11C4 7 8 4 12 6C13.5 4 14.8 3 16 3C17.2 3 18.5 4 20 6C24 4 28 7 28 11C28 20 16 28 16 28Z" stroke="white" strokeWidth="1.2" fill="none" />
            <path d="M16 28C16 28 10 22 10 16C10 12 12.5 10 16 12C19.5 10 22 12 22 16C22 22 16 28 16 28Z" stroke="white" strokeWidth="1" fill="none" opacity="0.6" />
          </svg>
          <h1 className="text-white text-3xl font-light mb-3" style={{ fontFamily: 'var(--font-manrope)' }}>
            Portal EO
          </h1>
          <p className="text-white/70 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-manrope)', fontWeight: 300 }}>
            Kelola event yoga Anda, pantau peserta, dan kembangkan komunitas yoga Jakarta bersama kami.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4 text-center">
            {[['∞', 'Event Tak Terbatas'], ['24/7', 'Support'], ['100%', 'Aman']].map(([val, label]) => (
              <div key={label}>
                <p className="text-white text-xl font-light">{val}</p>
                <p className="text-white/50 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex items-center justify-center px-8 py-12 bg-white">
        <Suspense fallback={<div className="flex justify-center"><Loader2 className="animate-spin text-gray-400" /></div>}>
          <EoLoginFormContent />
        </Suspense>
      </div>
    </div>
  )
}

