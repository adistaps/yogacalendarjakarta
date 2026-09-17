'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Loader2, Key } from 'lucide-react'
import { verifyTotpAction } from '@/app/admin/auth/actions'

interface TotpVerifyFormProps {
  userId: string
  email: string
  qrCodeDataUrl?: string // For setup
  secretText?: string // For setup
  secretToken?: string // For setup
}

export default function TotpVerifyForm({
  qrCodeDataUrl,
  secretText,
  secretToken,
}: TotpVerifyFormProps) {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isSetupMode = !!qrCodeDataUrl && !!secretToken

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length !== 6 || isNaN(Number(code))) {
      setError('Kode OTP harus terdiri dari 6 angka.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await verifyTotpAction(code, secretToken)
      if (!result.success) {
        setError(result.error || 'Gagal memverifikasi kode OTP.')
        setIsLoading(false)
      } else {
        router.push('/admin/dashboard')
      }
    } catch {
      setError('Terjadi kesalahan koneksi.')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isSetupMode && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4 text-center space-y-4">
          <p className="text-white font-medium text-sm">
            Setup Dua Faktor (2FA)
          </p>
          <p className="text-white/60 text-xs leading-relaxed font-light">
            Scan QR Code ini menggunakan aplikasi Google Authenticator Anda atau masukkan kunci teks secara manual.
          </p>
          
          <div className="bg-white p-3.5 rounded-xl inline-block shadow-lg mx-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrCodeDataUrl} alt="2FA Setup QR Code" className="w-40 h-40" />
          </div>

          <div className="text-left space-y-1">
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Kunci Teks Manual</p>
            <div className="flex items-center gap-2 bg-black/35 px-3 py-2 rounded-lg border border-white/5">
              <Key size={14} className="text-pink-400" />
              <code className="text-xs text-white select-all font-mono tracking-wider break-all">
                {secretText}
              </code>
            </div>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="code" className="text-xs text-white/60 font-medium mb-2 block text-left">
          Kode Verifikasi 6-Digit
        </label>
        <input
          id="code"
          type="text"
          maxLength={6}
          placeholder="000000"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center text-xl font-semibold text-white placeholder:text-white/20 tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50"
          disabled={isLoading}
          autoFocus
          autoComplete="one-time-code"
          required
        />
        {error && (
          <p className="text-red-300 text-xs mt-2 text-left bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading || code.length !== 6}
        className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl text-sm font-semibold hover:opacity-95 transition-opacity disabled:opacity-60"
      >
        {isLoading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <ShieldCheck size={18} />
        )}
        {isLoading ? 'Memverifikasi...' : 'Verifikasi & Lanjutkan'}
      </button>
    </form>
  )
}
