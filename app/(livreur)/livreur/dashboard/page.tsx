'use client'
import { useEffect, useState } from 'react'
import { subscribeOrders, updateOrderStatus } from '@/lib/firestore'
import type { Order } from '@/types'
import PageHeader from '@/components/layout/PageHeader'
import StatusBadge from '@/components/layout/StatusBadge'
import { useAuth } from '@/contexts/AuthContext'
import { Timestamp } from 'firebase/firestore'

function formatTime(d: unknown) {
  if (!d) return ''
  const date = d instanceof Timestamp ? d.toDate() : d instanceof Date ? d : null
  if (!date) return ''
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

const TABS: { label: string; value: 'active' | 'done' }[] = [
  { label: 'À livrer', value: 'active' },
  { label: 'Livrées', value: 'done' },
]

export default function LivreurDashboard() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [tab, setTab] = useState<'active' | 'done'>('active')
  const [expanded, setExpanded] = useState<string | null>(null)

  const { loading: authLoading } = useAuth()

  useEffect(() => {
    if (authLoading) return
    const unsub = subscribeOrders(o => {
      setOrders(o.filter(x =>
        x.status === 'prete' ||
        x.status === 'en_livraison' ||
        x.status === 'livree'
      ))
      setLoading(false)
    })
    return unsub
  }, [authLoading, user])

  async function takeDelivery(id: string) {
    setSaving(id)
    await updateOrderStatus(id, 'en_livraison', { deliveredBy: user?.displayName ?? user?.email })
    setSaving(null)
  }

  async function markDelivered(id: string) {
    setSaving(id)
    await updateOrderStatus(id, 'livree')
    setSaving(null)
  }

  const active = orders.filter(o => o.status === 'prete' || o.status === 'en_livraison')
  const done = orders.filter(o => o.status === 'livree')
  const displayed = tab === 'active' ? active : done

  if (loading) return <div className="flex items-center justify-center py-20 text-gray-400">Chargement…</div>

  return (
    <div className="max-w-xl">
      <PageHeader title="Mes livraisons" sub="Commandes prêtes à livrer" />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-orange-500">{orders.filter(o => o.status === 'prete').length}</p>
          <p className="text-xs text-gray-400 mt-1">Prêtes</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-blue-500">{orders.filter(o => o.status === 'en_livraison').length}</p>
          <p className="text-xs text-gray-400 mt-1">En cours</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{done.length}</p>
          <p className="text-xs text-gray-400 mt-1">Livrées</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {TABS.map(t => (
          <button key={t.value} onClick={() => setTab(t.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${tab === t.value ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {t.label}
            {t.value === 'active' && active.length > 0 && (
              <span className="ml-2 bg-orange-100 text-orange-600 text-xs font-bold px-1.5 py-0.5 rounded-full">{active.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Liste */}
      <div className="space-y-3">
        {displayed.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-sm text-gray-400">
            {tab === 'active' ? 'Aucune livraison en cours' : 'Aucune livraison effectuée'}
          </div>
        )}

        {displayed.map(o => {
          const isOpen = expanded === o.id
          return (
            <div key={o.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {/* Header carte */}
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : o.id)}
                className="w-full px-5 py-4 flex items-start justify-between text-left hover:bg-gray-50/50 transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-gray-900">#{o.id.slice(-6).toUpperCase()}</span>
                    <StatusBadge status={o.status} />
                    <span className="text-xs text-gray-400">{formatTime(o.createdAt)}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700 truncate">{o.clientName}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <p className="text-xs text-gray-400 truncate">{o.clientAddress}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <span className="text-lg font-bold text-gray-900">{o.total} dh</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </button>

              {/* Détail (accordéon) */}
              {isOpen && (
                <div className="border-t border-gray-100">
                  <div className="px-5 py-3 space-y-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Articles</p>
                    {o.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{item.name} × {item.quantity} {item.unit}</span>
                        <span className="font-medium text-gray-800">{(item.price * item.quantity).toFixed(0)} dh</span>
                      </div>
                    ))}
                  </div>

                  {o.clientAddress && (
                    <div className="px-5 pb-3">
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(o.clientAddress)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        Ouvrir dans Maps
                      </a>
                    </div>
                  )}

                  <div className="px-5 pb-4 pt-1">
                    {o.status === 'prete' && (
                      <button onClick={() => takeDelivery(o.id)} disabled={saving === o.id}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold py-3 rounded-xl transition">
                        {saving === o.id ? '…' : 'Prendre en charge'}
                      </button>
                    )}
                    {o.status === 'en_livraison' && (
                      <button onClick={() => markDelivered(o.id)} disabled={saving === o.id}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2">
                        {saving === o.id ? '…' : (
                          <>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                            Confirmer la livraison
                          </>
                        )}
                      </button>
                    )}
                    {o.status === 'livree' && (
                      <div className="bg-green-50 border border-green-200 text-green-700 text-sm font-medium py-2.5 rounded-xl text-center flex items-center justify-center gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        Livrée
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
