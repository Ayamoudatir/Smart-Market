'use client'
import { useEffect, useState } from 'react'
import { subscribeOrders, updateOrderStatus } from '@/lib/firestore'
import type { Order } from '@/types'
import PageHeader from '@/components/layout/PageHeader'
import StatCard from '@/components/layout/StatCard'
import StatusBadge from '@/components/layout/StatusBadge'
import { useAuth } from '@/contexts/AuthContext'

export default function LivreurDashboard() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    const unsub = subscribeOrders(o => {
      setOrders(o.filter(x => x.status === 'prete' || x.status === 'en_livraison' || (x.status === 'livree' && x.deliveredBy === user?.uid)))
      setLoading(false)
    })
    return unsub
  }, [user])

  async function takeDelivery(id: string) {
    setSaving(id)
    await updateOrderStatus(id, 'en_livraison', { deliveredBy: user?.displayName ?? user?.email })
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'en_livraison' } : o))
    setSaving(null)
  }

  async function markDelivered(id: string) {
    setSaving(id)
    await updateOrderStatus(id, 'livree')
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'livree' } : o))
    setSaving(null)
  }

  const ready = orders.filter(o => o.status === 'prete')
  const inProgress = orders.filter(o => o.status === 'en_livraison')
  const done = orders.filter(o => o.status === 'livree')

  if (loading) return <div className="flex items-center justify-center h-full text-gray-400">Chargement…</div>

  return (
    <div>
      <PageHeader title="Mes livraisons" sub="Commandes prêtes à livrer" />
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Prêtes à livrer" value={ready.length} color="green" />
        <StatCard label="En cours" value={inProgress.length} color="blue" />
        <StatCard label="Livrées" value={done.length} color="gray" />
      </div>

      <div className="space-y-4">
        {[...ready, ...inProgress].map(o => (
          <div key={o.id} className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-900">#{o.id.slice(-6).toUpperCase()}</p>
                  <StatusBadge status={o.status} />
                </div>
                <p className="text-sm text-gray-600">{o.clientName}</p>
                <p className="text-sm text-gray-400">{o.clientAddress}</p>
              </div>
              <p className="text-lg font-bold text-gray-900">{o.total} dh</p>
            </div>
            <div className="flex gap-2 mt-3">
              {o.status === 'prete' && (
                <button onClick={() => takeDelivery(o.id)} disabled={saving === o.id}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-xl transition">
                  {saving === o.id ? '…' : 'Prendre en charge'}
                </button>
              )}
              {o.status === 'en_livraison' && (
                <button onClick={() => markDelivered(o.id)} disabled={saving === o.id}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-xl transition">
                  {saving === o.id ? '…' : 'Confirmer la livraison'}
                </button>
              )}
            </div>
          </div>
        ))}
        {[...ready, ...inProgress].length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-sm text-gray-400">Aucune livraison assignée</div>
        )}
      </div>
    </div>
  )
}
