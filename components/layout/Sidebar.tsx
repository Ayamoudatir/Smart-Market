'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useNotifications } from '@/contexts/NotificationContext'
import { logoutUser } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

type NavItem = { label: string; href: string; icon: React.ReactNode; badge?: boolean }
type Props = { role: string; roleLabel: string; items: NavItem[] }

export default function Sidebar({ role, roleLabel, items }: Props) {
  const pathname = usePathname()
  const { user } = useAuth()
  const { unreadOrders, unreadDeliveries, markOrdersRead, markDeliveriesRead } = useNotifications()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => { setMobileOpen(false) }, [pathname])

  async function handleLogout() {
    document.cookie = 'userRole=; max-age=0; path=/'
    await logoutUser()
    router.push('/')
  }

  const mini = collapsed

  const navItems = (
    <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
      {items.map(item => {
        const active = pathname === item.href || pathname.startsWith(item.href + '/')
        const badgeCount = item.badge ? (role === 'livreur' ? unreadDeliveries : unreadOrders) : 0
        return (
          <Link key={item.href} href={item.href}
            onClick={() => item.badge && (role === 'livreur' ? markDeliveriesRead() : markOrdersRead())}
            title={mini ? item.label : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative
              ${active ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}
              ${mini ? 'justify-center' : ''}`}>
            <span className="w-5 h-5 shrink-0 relative">
              {item.icon}
              {badgeCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#f5c842] rounded-full text-gray-900 text-[9px] font-bold flex items-center justify-center">
                  {badgeCount > 9 ? '9+' : badgeCount}
                </span>
              )}
            </span>
            {!mini && <span className="flex-1">{item.label}</span>}
            {!mini && badgeCount > 0 && (
              <span className="bg-[#f5c842] text-gray-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {badgeCount > 9 ? '9+' : badgeCount}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )

  const header = (
    <div className={`py-5 border-b border-white/10 flex items-center ${mini ? 'justify-center px-2' : 'px-5 gap-3'}`}>
      <Image src="/assets/kenzi_logo.png" alt="Kenzi" width={mini ? 38 : 52} height={mini ? 38 : 52} className="object-contain drop-shadow-lg shrink-0" />
      {!mini && (
        <div>
          <p className="text-white font-black text-base leading-none">Kenzi Market</p>
          <p className="text-white/40 text-[11px] uppercase tracking-widest mt-0.5">{roleLabel}</p>
        </div>
      )}
    </div>
  )

  const footer = (
    <div className="px-3 py-4 border-t border-white/10">
      {!mini && (
        <div className="flex items-center gap-2.5 px-1 mb-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold shrink-0">
            {user?.displayName?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.displayName ?? user?.email}</p>
            <p className="text-white/40 text-[10px] capitalize">{role}</p>
          </div>
        </div>
      )}
      <button onClick={handleLogout} title={mini ? 'Déconnexion' : undefined}
        className={`flex items-center gap-2 text-white/50 hover:text-white text-xs px-2 py-1.5 rounded-lg hover:bg-white/10 transition w-full ${mini ? 'justify-center' : ''}`}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        {!mini && 'Déconnexion'}
      </button>
    </div>
  )

  return (
    <>
      {/* Hamburger mobile */}
      <button onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-[#1a5c2a] rounded-xl flex items-center justify-center text-white shadow-lg">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      {/* Overlay mobile */}
      {mobileOpen && <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />}

      {/* ── SIDEBAR DESKTOP ── */}
      <aside
        style={{ width: collapsed ? 72 : 256, minWidth: collapsed ? 72 : 256 }}
        className="hidden md:flex flex-col relative h-screen overflow-hidden transition-all duration-300"
      >
        {/* Bg image */}
        <div className="absolute inset-0">
          <img src="/assets/bg_sidebar.png" alt="" className="w-full h-full object-cover object-center" style={{ filter: 'blur(4px)', transform: 'scale(1.08)' }} />
          <div className="absolute inset-0 bg-[#0d3318]/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {header}
          {navItems}
          {footer}
        </div>

        {/* Bouton toggle */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="absolute top-1/2 -right-3 -translate-y-1/2 z-20 w-6 h-6 bg-[#1a5c2a] hover:bg-green-700 border border-white/20 rounded-full flex items-center justify-center text-white shadow-lg transition"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            {collapsed ? <polyline points="9 18 15 12 9 6"/> : <polyline points="15 18 9 12 15 6"/>}
          </svg>
        </button>
      </aside>

      {/* ── SIDEBAR MOBILE ── */}
      <aside className={`md:hidden fixed top-0 left-0 h-full w-72 z-50 flex flex-col overflow-hidden transform transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Bg image */}
        <div className="absolute inset-0">
          <img src="/assets/bg_sidebar.png" alt="" className="w-full h-full object-cover object-center" style={{ filter: 'blur(4px)', transform: 'scale(1.08)' }} />
          <div className="absolute inset-0 bg-[#0d3318]/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Image src="/assets/kenzi_logo.png" alt="Kenzi" width={52} height={52} className="object-contain drop-shadow-lg" />
              <div>
                <p className="text-white font-black text-base leading-none">Kenzi Market</p>
                <p className="text-white/40 text-[11px] uppercase tracking-widest mt-0.5">{roleLabel}</p>
              </div>
            </div>
            <button onClick={() => setMobileOpen(false)} className="text-white/50 hover:text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          {navItems}
          {footer}
        </div>
      </aside>
    </>
  )
}
