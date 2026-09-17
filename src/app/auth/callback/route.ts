import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const host = request.headers.get('host') || ''

  // Read `next` param — must be a path (starts with /), not a full URL
  const rawNext = searchParams.get('next') ?? ''
  const nextPath = rawNext.startsWith('/') ? rawNext : null

  // Determine default dashboard based on subdomain
  const defaultDashboard =
    host.startsWith('admin.') ? '/admin/dashboard' :
    host.startsWith('eo.') ? '/eo/dashboard' :
    '/dashboard'

  const redirectPath = nextPath || defaultDashboard

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${redirectPath}`)
    }
  }

  // If no code or exchange failed, redirect to appropriate login
  const loginPath =
    host.startsWith('admin.') ? '/admin/login?error=auth_failed' :
    host.startsWith('eo.') ? '/eo/login?error=auth_failed' :
    '/login?error=auth_failed'

  return NextResponse.redirect(`${origin}${loginPath}`)
}
