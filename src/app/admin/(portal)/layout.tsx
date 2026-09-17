import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { verifySession } from '@/lib/totp'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

export default async function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 1. Authenticate via Google OAuth
  if (!user) {
    redirect('/admin/login')
  }

  // 2. Validate role is 'admin'
  const { data: profile } = await supabase
    .from('users')
    .select('name, email, role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    await supabase.auth.signOut()
    redirect('/admin/login?error=unauthorized_role')
  }

  // 3. Verify session 2FA cookie
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_2fa_verified')?.value
  const verifiedUserId = verifySession(token)

  if (!verifiedUserId || verifiedUserId !== user.id) {
    redirect('/admin/login/2fa')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar adminName={profile.name} adminEmail={profile.email} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
