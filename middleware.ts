import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const pathname = req.nextUrl.pathname

  // ✅ Si l’utilisateur va sur la racine /
  if (pathname === '/') {
    // Rediriger directement vers /admin
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  // ✅ Si l’utilisateur va sur /auth/login ou /auth/signup
  if (pathname.startsWith('/auth')) {
    // Rediriger directement vers /admin
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  // ✅ Si l’utilisateur va sur /home ou autres pages protégées
  if (pathname.startsWith('/home') || pathname.startsWith('/about') || pathname.startsWith('/albums') || pathname.startsWith('/events') || pathname.startsWith('/contact') || pathname.startsWith('/support')) {
    // Rediriger directement vers /admin
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  // ✅ Si l’utilisateur va sur /admin
  if (pathname.startsWith('/admin')) {
    // Laisser passer sans auth
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}



/*import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const pathname = req.nextUrl.pathname

  // Routes publiques (pas d'authentification requise)
  const publicRoutes = ['/auth/login', '/auth/signup']
  
  // Routes protégées (authentification requise)
  const protectedRoutes = ['/home', '/about', '/albums', '/events', '/contact', '/support']
  
  // Routes admin (authentification + rôle admin requis)
  const adminRoutes = ['/admin']

  // Vérifier si utilisateur a un token de session
  const hasSession = req.cookies.get('sb-access-token')

  // ✅ CAS 1: Utilisateur sur page publique (login/signup)
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    // Si connecté → rediriger vers /home
    if (hasSession) {
      url.pathname = '/home'
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // ✅ CAS 2: Utilisateur sur page protégée (/home, /about, etc.)
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    // Si pas connecté → rediriger vers login
    if (!hasSession) {
      url.pathname = '/auth/login'
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // ✅ CAS 3: Utilisateur sur /admin
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    // Si pas connecté → rediriger vers login
    if (!hasSession) {
      url.pathname = '/auth/login'
      return NextResponse.redirect(url)
    }
    // La vérification du rôle = 'admin' se fait côté client (admin/layout.tsx)
    return NextResponse.next()
  }

  // ✅ CAS 4: Page racine /
  if (pathname === '/') {
    if (hasSession) {
      url.pathname = '/home'
      return NextResponse.redirect(url)
    }
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}*/