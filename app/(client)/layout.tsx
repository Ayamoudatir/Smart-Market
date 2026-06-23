'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { logoutUser } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const { totalItems } = useCart()
  const router = useRouter()
  const pathname = usePathname()

  async function handleLogout() {
    document.cookie = 'userRole=; max-age=0; path=/'
    await logoutUser()
    router.push('/')
  }

  const navLinks = [
    { href: '/catalogue', label: 'Catalogue' },
    { href: '/commandes', label: 'Mes commandes' },
  ]

  const displayName = user?.displayName || user?.email?.split('@')[0] || ''
  const initials = displayName
    ? displayName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
    : null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1a5c2a] sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/catalogue" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center p-1.5 shadow">
              <Image src="/assets/kenzi_logo.png" alt="Kenzi Market" width={1536} height={1024} className="w-full h-full object-contain" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Kenzi Market</span>
          </Link>

          {/* Nav links desktop */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href}
                className={`text-sm font-medium transition ${pathname.startsWith(l.href) ? 'text-white' : 'text-white/70 hover:text-white'}`}>
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Panier */}
            <Link href="/panier"
              className="relative w-10 h-10 rounded-xl border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#f5c842] text-gray-900 text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center leading-none">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Profil mobile */}
            <Link href="/compte"
              className="md:hidden w-10 h-10 rounded-xl border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition">
              {initials ? (
                <span className="text-xs font-black">{initials}</span>
              ) : (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              )}
            </Link>

            {user && (
              <button onClick={handleLogout}
                className="hidden md:flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-medium transition px-3 py-2 rounded-xl hover:bg-white/10">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Déconnexion
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 pb-24 md:pb-8">{children}</main>

      {/* Bottom nav mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex items-center">
        <Link href="/catalogue"
          className={`flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-medium transition ${pathname.startsWith('/catalogue') ? 'text-[#1a5c2a]' : 'text-gray-500'}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
          Catalogue
        </Link>

        <Link href="/commandes"
          className={`flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-medium transition ${pathname.startsWith('/commandes') ? 'text-[#1a5c2a]' : 'text-gray-500'}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
          Commandes
        </Link>

        <Link href="/panier"
          className={`flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-medium transition relative ${pathname === '/panier' ? 'text-[#1a5c2a]' : 'text-gray-500'}`}>
          <span className="relative">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#f5c842] text-gray-900 text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </span>
          Panier
        </Link>

        <Link href="/compte"
          className={`flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-medium transition ${pathname.startsWith('/compte') ? 'text-[#1a5c2a]' : 'text-gray-500'}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          Profil
        </Link>
      </nav>
    </div>
  )
}
