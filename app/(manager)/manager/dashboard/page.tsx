'use client'
import { useEffect, useState } from 'react'
import { getProducts, getInventoryMovements } from '@/lib/firestore'
import type { Product, InventoryMovement } from '@/types'
import PageHeader from '@/components/layout/PageHeader'
import StatCard from '@/components/layout/StatCard'
import StatusBadge from '@/components/layout/StatusBadge'

export default function ManagerDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [movements, setMovements] = useState<InventoryMovement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getProducts(), getInventoryMovements(10)]).then(([p, m]) => {
      setProducts(p)
      setMovements(m)
      setLoading(false)
    })
  }, [])

  const total = products.length
  const rupture = products.filter(p => p.status === 'rupture').length
  const bas = products.filter(p => p.status === 'bas').length
  const stockValue = products.reduce((s, p) => s + p.price * p.quantity, 0)

  if (loading) return <div className="flex items-center justify-center h-full text-gray-400">Chargement…</div>

  return (
    <div>
      <PageHeader title="Dashboard stock" sub="Vue d'ensemble de votre inventaire" />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total produits" value={total} color="blue" />
        <StatCard label="Alertes rupture" value={rupture} color="red" sub="produits à 0" />
        <StatCard label="Stock bas" value={bas} color="yellow" sub="sous le seuil" />
        <StatCard label="Valeur stock" value={stockValue.toLocaleString('fr-MA') + ' dh'} color="green" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Alertes */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Alertes de stock</h2>
          <div className="space-y-3">
            {products.filter(p => p.status !== 'en_stock').length === 0 && (
              <p className="text-sm text-gray-400">Aucune alerte</p>
            )}
            {products.filter(p => p.status !== 'en_stock').slice(0, 6).map(p => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm font-medium text-gray-800">{p.name}</span>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Mouvements récents */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Mouvements récents</h2>
          <div className="space-y-3">
            {movements.length === 0 && <p className="text-sm text-gray-400">Aucun mouvement</p>}
            {movements.map(m => (
              <div key={m.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{m.productName}</p>
                  <p className="text-xs text-gray-400">{m.reason}</p>
                </div>
                <span className={`text-sm font-semibold ${m.type === 'in' ? 'text-green-600' : 'text-red-500'}`}>
                  {m.type === 'in' ? '+' : '-'}{m.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
