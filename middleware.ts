import { NextRequest, NextResponse } from 'next/server'

const ROLE_HOME: Record<string, string> = {
  admin: '/admin/dashboard',
  manager: '/manager/dashboard',
  preparateur: '/preparateur/dashboard',
  livreur: '/livreur/dashboard',
  client: '/catalogue',
}

const PROTECTED_PREFIXES = ['/admin', '/manager', '/preparateur', '/livreur', '/catalogue', '/panier', '/commandes']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const role = req.cookies.get('userRole')?.value

  const isProtected = PROTECTED_PREFIXES.some(p => pathname.startsWith(p))

  if (isProtected && !role) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (pathname === '/') {
    if (role && ROLE_HOME[role]) {
      return NextResponse.redirect(new URL(ROLE_HOME[role], req.url))
    }
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets).*)'],
}
