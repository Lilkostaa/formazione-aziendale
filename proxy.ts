import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Route pubbliche (accessibili a tutti, anche non loggati)
const publicRoutes = ['/login', '/reset-password', '/set-password']

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 1. Ignora file statici, API e file con estensione
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/uploads') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }
  
  // 2. Ottieni token JWT
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })
  
  // 3. Gestione redirect per utenti NON autenticati
  // Se non sei loggato e cerchi di andare su una pagina privata -> Login
  if (!token && !publicRoutes.some(route => pathname.startsWith(route))) {
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }
  
  // 4. Gestione redirect per utenti GIÀ autenticati
  // Se sei già loggato e provi ad andare su /login o /set-password -> Dashboard
  if (token && publicRoutes.some(route => pathname.startsWith(route))) {
    const dashboardUrl = token.ruolo === 'admin' 
      ? '/admin/dashboard' 
      : '/corsi-disponibili'
    return NextResponse.redirect(new URL(dashboardUrl, request.url))
  }
  
  // 5. Protezione Rotte ADMIN (RBAC)
  // Invece di una lista, proteggiamo tutto quello che inizia con "/admin"
  if (pathname.startsWith('/admin')) {
    if (token?.ruolo !== 'admin') {
      // Se sei un dipendente e provi ad andare su /admin -> Home Dipendente
      return NextResponse.redirect(new URL('/corsi-disponibili', request.url))
    }
  }
  
  // 6. Redirect Root (/) alla dashboard corretta
  if (pathname === '/') {
    const dashboardUrl = token?.ruolo === 'admin' 
      ? '/admin/dashboard' 
      : '/corsi-disponibili'
    return NextResponse.redirect(new URL(dashboardUrl, request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Matcher ottimizzato per escludere tutto ciò che è statico
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}