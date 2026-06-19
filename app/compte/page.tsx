'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { logoutUser } from '@/lib/auth'
import { subscribeClientOrders } from '@/lib/firestore'
import type { Order } from '@/types'
import StatusBadge from '@/components/layout/StatusBadge'
import PublicNavbar from '@/components/layout/PublicNavbar'
import PublicFooter from '@/components/layout/PublicFooter'

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export default function MonCompte() {
  const { user } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    if (!user) { router.push('/'); return }
    const unsub = subscribeClientOrders(user.uid, o => { setOrders(o); setLoading(false) })
    return unsub
  }, [user, router])

  async function handleLogout() {
    setLoggingOut(true)
    document.cookie = 'userRole=; max-age=0; path=/'
    await logoutUser()
    router.push('/')
  }

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Client'
  const email = user?.email ?? ''
  const totalSpent = orders.reduce((s, o) => s + o.total, 0)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white shadow-sm">
        <PublicNavbar />
      </div>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 md:px-8 py-10">

        {/* Carte profil */}
        <div className="bg-white rounded-3xl border border-gray-100 mb-6 shadow-sm overflow-hidden">

          {/* Banner + avatar inline */}
          <div className="bg-gradient-to-r from-[#1a5c2a] via-green-700 to-emerald-600 relative px-6 pt-6 pb-16">
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
            {/* Bouton déconnexion en haut à droite */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="absolute top-4 right-4 flex items-center gap-2 text-xs text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 font-medium px-3 py-1.5 rounded-xl transition-all disabled:opacity-50">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              {loggingOut ? 'Déconnexion…' : 'Se déconnecter'}
            </button>

            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center text-white font-black text-xl shadow-lg">
              {getInitials(displayName)}
            </div>
            <h1 className="text-lg font-black text-white mt-3">{displayName}</h1>
            <p className="text-sm text-white/60">{email}</p>
          </div>

          {/* Stats */}
          <div className="px-6 py-5">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
                <p className="text-2xl font-black text-[#1a5c2a]">{orders.length}</p>
                <p className="text-xs text-gray-500 mt-0.5">Commandes</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
                <p className="text-2xl font-black text-[#1a5c2a]">{totalSpent}</p>
                <p className="text-xs text-gray-500 mt-0.5">Dh dépensés</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
                <p className="text-2xl font-black text-[#1a5c2a]">
                  {orders.filter(o => o.status === 'livree').length}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Livrées</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link href="/" className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 hover:shadow-sm hover:border-[#1a5c2a]/20 transition group">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-[#1a5c2a] transition">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a5c2a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white transition"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Catalogue</p>
              <p className="text-xs text-gray-400">Commander des produits</p>
            </div>
          </Link>
          <Link href="/commandes" className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 hover:shadow-sm hover:border-[#1a5c2a]/20 transition group">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-[#1a5c2a] transition">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a5c2a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white transition"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Mes commandes</p>
              <p className="text-xs text-gray-400">Voir le suivi</p>
            </div>
          </Link>
        </div>

        {/* Dernières commandes */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 text-sm">Dernières commandes</h2>
            <Link href="/commandes" className="text-xs text-[#1a5c2a] font-semibold hover:underline">Voir tout</Link>
          </div>

          {loading ? (
            <div className="p-5 space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                  <div className="h-4 bg-gray-100 rounded w-12" />
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-gray-400">Vous n'avez pas encore commandé</p>
              <Link href="/" className="mt-3 inline-block text-xs text-[#1a5c2a] font-semibold hover:underline">Commander maintenant →</Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {orders.slice(0, 4).map(o => (
                <div key={o.id} className="px-5 py-3.5 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">#{o.id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-gray-400 truncate">{o.items.map(i => i.name).join(', ')}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-gray-900">{o.total} dh</p>
                    <StatusBadge status={o.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
