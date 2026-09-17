'use client'

import { ShieldCheck } from 'lucide-react'

export default function AdminHeader() {
  return (
    <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <span className="text-xs text-text-muted hidden sm:inline" style={{ fontFamily: 'var(--font-manrope)' }}>
          Jakarta Yoga Calendar · System Portal
        </span>
      </div>
      <div className="flex items-center gap-3 ml-auto lg:ml-0">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 border border-green-100 rounded-full text-xs font-medium">
          <ShieldCheck size={14} />
          2FA Terverifikasi
        </div>
      </div>
    </header>
  )
}
