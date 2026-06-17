'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { logoutUser } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

type NavItem = { label: string; href: string; icon: React.ReactNode }

type Props = {
  role: string
  roleLabel: string
  items: NavItem[]
}

export default function Sidebar({ role, roleLabel, items }: Props) {
  const pathname = usePathname()
  const { user } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => { setOpen(false) }, [pathname])

  async function handleLogout() {
    document.cookie = 'userRole=; max-age=0; path=/'
    await logoutUser()
    router.push('/login')
  }

  const navContent = (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-green-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center overflow-hidden p-1">
            <Image src="/assets/kenzi_logo.png" alt="Kenzi Market" width={1536} height={1024} className="w-full h-full object-contain" />
          </div>
          <div>
            <p className="text-white font-bold text-base leading-none">Kenzi Market</p>
            <p className="text-green-400 text-xs font-medium uppercase tracking-wide mt-0.5">{roleLabel}</p>
          </div>
        </div>
        <button onClick={() => setOpen(false)} className="md:hidden text-green-300 hover:text-white p-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {items.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                active ? 'bg-green-600 text-white' : 'text-green-100 hover:bg-green-800 hover:text-white'
              }`}>
              <span className="w-5 h-5 shrink-0">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-4 border-t border-green-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
            {user?.displayName?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.displayName ?? user?.email}</p>
            <p className="text-green-400 text-xs capitalize">{role}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full text-left text-green-300 hover:text-white text-xs flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-green-800 transition">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Déconnexion
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Hamburger — mobile only */}
      <button onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-green-800 rounded-xl flex items-center justify-center text-white shadow-lg">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      {/* Overlay mobile */}
      {open && <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setOpen(false)} />}

      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-green-900 h-screen sticky top-0">
        {navContent}
      </aside>

      {/* Sidebar mobile drawer */}
      <aside className={`md:hidden fixed top-0 left-0 h-full w-72 bg-green-900 z-50 flex flex-col transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        {navContent}
      </aside>
    </>
  )
}
