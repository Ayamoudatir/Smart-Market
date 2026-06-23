'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'

interface Props {
  search?: string
  onSearch?: (v: string) => void
  placeholder?: string
}

export default function PublicNavbar({ search = '', onSearch, placeholder = 'Rechercher un produit…' }: Props) {
  const { totalItems } = useCart()
  const { user } = useAuth()

  const displayName = user?.displayName || user?.email?.split('@')[0] || ''
  const initials = displayName
    ? displayName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
    : null

  return (
    <>
      {/* Barre annonce */}
      <div className="bg-[#1a5c2a] text-white text-center text-xs font-semibold py-2 tracking-wide">
        Livraison gratuite dès <span className="text-[#f5c842]">150 dh</span> — Produits frais livrés en <span className="text-[#f5c842]">30 minutes</span>
      </div>

      <header className="relative z-50">

        {/* ── Ligne 1 : Logo + Compte + Panier ── */}
        <div className="flex items-center px-3 md:px-10 py-3 gap-2">

          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/assets/kenzi_logo.png"
              alt="Kenzi Market"
              width={100} height={100}
              className="object-contain drop-shadow-lg w-12 h-12 md:w-[88px] md:h-[88px]"
            />
          </Link>

          {/* Barre de recherche desktop uniquement */}
          <div className="hidden md:flex flex-1 max-w-xl mx-2">
            <div className="flex items-center bg-white/70 backdrop-blur-md rounded-xl overflow-hidden border border-gray-200 focus-within:border-[#1a5c2a] transition w-full">
              <div className="flex items-center gap-2 flex-1 px-4 py-2.5">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 shrink-0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input
                  value={search}
                  onChange={e => onSearch?.(e.target.value)}
                  placeholder={placeholder}
                  className="flex-1 bg-transparent text-sm text-gray-600 placeholder:text-gray-400 outline-none"
                />
              </div>
              <button className="bg-[#1a5c2a] text-white px-5 py-2.5 text-sm font-bold hover:bg-green-800 transition shrink-0">
                Rechercher
              </button>
            </div>
          </div>

          {/* Spacer mobile */}
          <div className="flex-1 md:hidden" />

          {/* Compte + Panier — toujours visibles */}
          <div className="flex items-center gap-0 shrink-0">
            <Link href={user ? '/compte' : '/login'}
              className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl hover:bg-black/5 transition">
              {initials ? (
                <div className="w-7 h-7 rounded-full bg-[#1a5c2a] flex items-center justify-center text-white text-[10px] font-black">
                  {initials}
                </div>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-700">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              )}
              <span className="text-[10px] text-gray-600">
                {user ? (displayName.split(' ')[0] || 'Compte') : 'Compte'}
              </span>
            </Link>

            <Link href="/panier"
              className="relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl hover:bg-black/5 transition">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-700">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <span className="text-[10px] text-gray-600">Panier</span>
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-[#f5c842] text-gray-900 text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* ── Ligne 2 : Recherche mobile pleine largeur ── */}
        <div className="md:hidden px-3 pb-3">
          <div className="flex items-center bg-white/80 backdrop-blur-md rounded-xl overflow-hidden border border-gray-200 focus-within:border-[#1a5c2a] transition">
            <div className="flex items-center gap-2 flex-1 px-3 py-2.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 shrink-0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                value={search}
                onChange={e => onSearch?.(e.target.value)}
                placeholder={placeholder}
                className="flex-1 bg-transparent text-sm text-gray-600 placeholder:text-gray-400 outline-none"
              />
            </div>
            <button className="bg-[#1a5c2a] text-white px-4 py-2.5 text-sm font-bold hover:bg-green-800 transition shrink-0">
              Rechercher
            </button>
          </div>
        </div>

      </header>
    </>
  )
}
