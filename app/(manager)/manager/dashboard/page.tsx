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

  if (loading) return <div className="flex items-center justify-center h-full text-green-800/40">Chargement…</div>

  return (
    <div>
      <PageHeader title="Dashboard stock" sub="Vue d'ensemble de votre inventaire" />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total produits" value={total} color="blue"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>} />
        <StatCard label="Alertes rupture" value={rupture} color="red" sub="produits à 0"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>} />
        <StatCard label="Stock bas" value={bas} color="yellow" sub="sous le seuil"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>} />
        <StatCard label="Valeur stock" value={stockValue.toLocaleString('fr-MA') + ' dh'} color="green"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Alertes */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-green-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Alertes de stock</h2>
          <div className="space-y-3">
            {products.filter(p => p.status !== 'en_stock').length === 0 && (
              <p className="text-sm text-green-800/40">Aucune alerte</p>
            )}
            {products.filter(p => p.status !== 'en_stock').slice(0, 6).map(p => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-green-100 last:border-0">
                <span className="text-sm font-medium text-gray-800">{p.name}</span>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Mouvements récents */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-green-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Mouvements récents</h2>
          <div className="space-y-3">
            {movements.length === 0 && <p className="text-sm text-green-800/40">Aucun mouvement</p>}
            {movements.map(m => (
              <div key={m.id} className="flex items-center justify-between py-2 border-b border-green-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{m.productName}</p>
                  <p className="text-xs text-green-800/40">{m.reason}</p>
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
