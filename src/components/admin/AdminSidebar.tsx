'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  Calendar,
  Megaphone,
  Layers,
  DollarSign,
  Send,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/eo', icon: Users, label: 'Kelola EO' },
  { href: '/events', icon: Calendar, label: 'Kelola Event' },
  { href: '/ads', icon: Megaphone, label: 'Pengajuan Iklan' },
  { href: '/homepage', icon: Layers, label: 'Kurasi Konten' },
  { href: '/finance/transactions', icon: DollarSign, label: 'Transaksi' },
  { href: '/finance/disbursements', icon: Send, label: 'Disbursement' },
]

interface AdminSidebarProps {
  adminName: string
  adminEmail: string
}

export default function AdminSidebar({ adminName, adminEmail }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    // Clear cookies & signout
    await supabase.auth.signOut()
    // Trigger delete action for the 2fa session cookie
    document.cookie = 'admin_2fa_verified=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;'
    router.push('/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-semibold"
            style={{ background: 'linear-gradient(135deg, var(--color-primary-val), var(--color-accent))' }}
          >
            A
          </div>
          <div className="min-w-0">
            <p className="text-xs text-text-muted truncate">Dashboard Admin</p>
            <p className="text-sm font-semibold text-text truncate">{adminName}</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                isActive
                  ? 'text-white shadow-sm'
                  : 'text-text-muted hover:text-text hover:bg-gray-100'
              }`}
              style={
                isActive
                  ? { background: 'linear-gradient(135deg, var(--color-primary-val), var(--color-accent))' }
                  : {}
              }
            >
              <Icon size={18} className={isActive ? 'text-white' : 'text-current'} />
              {label}
              {isActive && <ChevronRight size={14} className="ml-auto text-white/70" />}
            </Link>
          )
        })}
      </nav>

      {/* Admin Email Info & Logout */}
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="px-3 py-2 mb-2">
          <p className="text-xs text-text-muted truncate" title={adminEmail}>
            {adminEmail}
          </p>
        </div>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-text-muted hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut size={18} />
          {isLoggingOut ? 'Keluar...' : 'Keluar'}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-gray-100 h-screen sticky top-0 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white shadow-md border border-gray-100 rounded-lg flex items-center justify-center"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-64 bg-white h-full shadow-xl">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  )
}
