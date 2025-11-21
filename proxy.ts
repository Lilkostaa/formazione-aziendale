import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Route pubbliche (accessibili senza login)
const publicRoutes = ['/login', '/reset-password', '/set-password']

// Route solo admin
const adminRoutes = [
  '/admin/docenti',
  '/admin/corsi',
  '/admin/dipendenti',
  '/admin/iscrizioni',
  '/admin/docenti',
  '/admin/categorie',
  '/admin/report',
]

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Ignora file statici e API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/uploads') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }
  
  // Ottieni token JWT
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })
  
  // Se non autenticato e route non pubblica → redirect a login
  if (!token && !publicRoutes.some(route => pathname.startsWith(route))) {
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }
  
  // Se autenticato e su route pubblica → redirect a dashboard appropriata
  if (token && publicRoutes.some(route => pathname === route)) {
    const dashboardUrl = token.ruolo === 'admin' 
      ? '/admin/docenti' 
      : '/corsi-disponibili'
    return NextResponse.redirect(new URL(dashboardUrl, request.url))
  }
  
  // Protezione route admin
  if (token && adminRoutes.some(route => pathname.startsWith(route))) {
    if (token.ruolo !== 'admin') {
      return NextResponse.redirect(new URL('/corsi-disponibili', request.url))
    }
  }
  
  // Redirect root a dashboard appropriata
  if (token && pathname === '/') {
    const dashboardUrl = token.ruolo === 'admin' 
      ? '/admin/dashboard' 
      : '/corsi-disponibili'
    return NextResponse.redirect(new URL(dashboardUrl, request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
