import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EoSidebar from '@/components/eo/EoSidebar'

export default async function EoPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/eo/login')
  }

  const { data: eoProfile } = await supabase
    .from('eo_profiles')
    .select('org_name, logo_url, status')
    .eq('user_id', user.id)
    .single()

  if (!eoProfile) {
    redirect('/eo/login')
  }

  if (eoProfile.status === 'pending') {
    redirect('/eo/pending')
  }

  if (eoProfile.status === 'rejected') {
    redirect('/eo/rejected')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <EoSidebar orgName={eoProfile.org_name} logoUrl={eoProfile.logo_url} />
      <main className="flex-1 min-w-0 lg:pl-0">
        <div className="p-6 lg:p-8 pt-16 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  )
}
