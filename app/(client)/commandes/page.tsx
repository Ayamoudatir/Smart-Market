'use client'
import { useEffect, useState } from 'react'
import { subscribeClientOrders } from '@/lib/firestore'
import type { Order } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import PageHeader from '@/components/layout/PageHeader'
import StatusBadge from '@/components/layout/StatusBadge'

export default function MesCommandes() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const unsub = subscribeClientOrders(user.uid, o => { setOrders(o); setLoading(false) })
    return unsub
  }, [user])

  if (loading) return <div className="flex items-center justify-center py-20 text-gray-400">Chargement…</div>

  return (
    <div>
      <PageHeader title="Mes commandes" sub="Suivi de vos commandes" />
      <div className="space-y-4">
        {orders.length === 0 && <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-sm text-gray-400">Aucune commande pour le moment</div>}
        {orders.map(o => (
          <div key={o.id} className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-900">Commande #{o.id.slice(-6).toUpperCase()}</p>
                  <StatusBadge status={o.status} />
                </div>
                <p className="text-sm text-gray-500">{o.items.length} article{o.items.length > 1 ? 's' : ''}</p>
              </div>
              <p className="text-lg font-bold text-gray-900">{o.total} dh</p>
            </div>
            <div className="space-y-1.5 mt-3 border-t border-gray-100 pt-3">
              {o.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.name} × {item.quantity}</span>
                  <span className="font-medium text-gray-800">{(item.price * item.quantity).toFixed(0)} dh</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
