'use client'
import { useEffect, useState } from 'react'
import { getOrders, getProducts, getAllUsers } from '@/lib/firestore'
import type { Order, Product, User } from '@/types'
import PageHeader from '@/components/layout/PageHeader'
import StatCard from '@/components/layout/StatCard'
import StatusBadge from '@/components/layout/StatusBadge'

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getOrders(), getProducts(), getAllUsers()]).then(([o, p, u]) => {
      setOrders(o); setProducts(p); setUsers(u); setLoading(false)
    })
  }, [])

  if (loading) return <div className="flex items-center justify-center h-full text-gray-400">Chargement…</div>

  return (
    <div>
      <PageHeader title="Dashboard" sub="Vue globale de la plateforme" />
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard label="Commandes totales" value={orders.length} color="blue" />
        <StatCard label="Produits" value={products.length} color="green" />
        <StatCard label="Utilisateurs" value={users.length} color="gray" />
        <StatCard label="Ruptures" value={products.filter(p => p.status === 'rupture').length} color="red" />
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard label="En attente" value={orders.filter(o => o.status === 'en_attente').length} color="yellow" />
        <StatCard label="En préparation" value={orders.filter(o => o.status === 'en_preparation').length} color="blue" />
        <StatCard label="En livraison" value={orders.filter(o => o.status === 'en_livraison').length} color="yellow" />
        <StatCard label="Livrées" value={orders.filter(o => o.status === 'livree').length} color="green" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Commandes récentes</h2>
        <div className="space-y-3">
          {orders.slice(0, 8).map(o => (
            <div key={o.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-semibold text-gray-900">#{o.id.slice(-6).toUpperCase()}</p>
                <p className="text-xs text-gray-400">{o.clientName}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">{o.total} dh</span>
                <StatusBadge status={o.status} />
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="text-sm text-gray-400">Aucune commande</p>}
        </div>
      </div>
    </div>
  )
}
