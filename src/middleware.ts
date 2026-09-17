import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl.clone()
  const { pathname } = url

  // Abaikan static files, Next.js internals, API routes, dan OAuth callback
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/auth/callback') ||
    pathname.match(/\.(.*)$/) // mencakup favicon, png, jpg, pdf, dll
  ) {
    return NextResponse.next()
  }


  // Block direct access to /admin routes on main domain (prevent bypassing subdomain routing)
  if (!hostname.startsWith('admin.') && !hostname.startsWith('admin.localhost') && hostname !== 'localhost' && pathname.startsWith('/admin')) {
    return new NextResponse('Not Found', { status: 404 })
  }

  // Routing untuk Subdomain Admin (admin.yogacalendar.id atau admin.localhost)
  if ((hostname.startsWith('admin.') || hostname.startsWith('admin.localhost')) && !pathname.startsWith('/admin')) {
    url.pathname = `/admin${pathname}`
    return NextResponse.rewrite(url)
  }

  // Routing untuk Subdomain EO (eo.yogacalendar.id atau eo.localhost)
  if ((hostname.startsWith('eo.') || hostname.startsWith('eo.localhost')) && !pathname.startsWith('/eo')) {
    url.pathname = `/eo${pathname}`
    return NextResponse.rewrite(url)
  }

  // Web publik (yogacalendar.id) menggunakan route group (public) 
  // yang secara default dipetakan ke root path oleh Next.js, 
  // sehingga tidak memerlukan rewrite tambahan.
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
