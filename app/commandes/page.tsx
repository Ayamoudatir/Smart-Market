'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { subscribeClientOrders } from '@/lib/firestore'
import type { Order } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import StatusBadge from '@/components/layout/StatusBadge'
import PublicNavbar from '@/components/layout/PublicNavbar'
import PublicFooter from '@/components/layout/PublicFooter'

const STATUS_STEPS = ['en_attente', 'en_preparation', 'prete', 'en_livraison', 'livree']
const STATUS_LABELS: Record<string, string> = {
  en_attente: 'En attente',
  en_preparation: 'Préparation',
  prete: 'Prête',
  en_livraison: 'En livraison',
  livree: 'Livrée',
}

function OrderTimeline({ status }: { status: string }) {
  const current = STATUS_STEPS.indexOf(status)
  if (current === -1) return null
  return (
    <div className="flex items-center gap-0 mt-4">
      {STATUS_STEPS.map((s, i) => {
        const done = i <= current
        const active = i === current
        return (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                ${active ? 'bg-[#1a5c2a] text-white ring-4 ring-[#1a5c2a]/20' : done ? 'bg-[#1a5c2a] text-white' : 'bg-gray-100 text-gray-400'}`}>
                {done && !active
                  ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  : <span>{i + 1}</span>}
              </div>
              <span className={`text-[10px] font-medium whitespace-nowrap ${active ? 'text-[#1a5c2a]' : done ? 'text-gray-500' : 'text-gray-300'}`}>
                {STATUS_LABELS[s]}
              </span>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 mb-4 rounded ${i < current ? 'bg-[#1a5c2a]' : 'bg-gray-100'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function MesCommandes() {
  const { user } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { router.push('/login?redirect=/commandes'); return }
    const unsub = subscribeClientOrders(user.uid, o => { setOrders(o); setLoading(false) })
    return unsub
  }, [user, router])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white shadow-sm">
        <PublicNavbar />
      </div>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 md:px-8 py-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#1a5c2a] rounded-xl flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Mes commandes</h1>
            <p className="text-sm text-gray-400">{orders.length} commande{orders.length > 1 ? 's' : ''} au total</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                <div className="flex justify-between mb-3">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32" />
                    <div className="h-3 bg-gray-200 rounded w-20" />
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-16" />
                </div>
                <div className="h-8 bg-gray-100 rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" className="mx-auto mb-4">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            <p className="text-gray-500 font-semibold mb-1">Aucune commande pour le moment</p>
            <p className="text-gray-400 text-sm mb-5">Passez votre première commande depuis le catalogue</p>
            <button onClick={() => router.push('/')}
              className="bg-[#1a5c2a] text-white font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-green-800 transition">
              Voir les produits
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(o => (
              <div key={o.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition">

                {/* Header commande */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-gray-900 text-sm">#{o.id.slice(-6).toUpperCase()}</p>
                      <StatusBadge status={o.status} />
                    </div>
                    <p className="text-xs text-gray-400">{o.items.length} article{o.items.length > 1 ? 's' : ''}</p>
                  </div>
                  <p className="text-xl font-black text-gray-900">{o.total} dh</p>
                </div>

                {/* Timeline */}
                {!['annulee'].includes(o.status) && <OrderTimeline status={o.status} />}

                {/* Articles */}
                <div className="mt-4 border-t border-gray-50 pt-4 space-y-2">
                  {o.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-gray-100 rounded-md flex items-center justify-center text-[10px] font-bold text-gray-500">{item.quantity}</span>
                        <span className="text-gray-700">{item.name}</span>
                      </div>
                      <span className="font-semibold text-gray-800">{(item.price * item.quantity).toFixed(0)} dh</span>
                    </div>
                  ))}
                </div>

                {/* Adresse si dispo */}
                {o.clientAddress && (
                  <div className="mt-3 pt-3 border-t border-gray-50 flex items-start gap-2 text-xs text-gray-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span>{o.clientAddress}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  )
}
