'use client'
import { useEffect, useState } from 'react'
import { getOrders } from '@/lib/firestore'
import type { Order } from '@/types'
import PageHeader from '@/components/layout/PageHeader'
import StatusBadge from '@/components/layout/StatusBadge'

export default function AdminCommandes() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrders().then(o => { setOrders(o); setLoading(false) })
  }, [])

  if (loading) return <div className="flex items-center justify-center h-full text-gray-400">Chargement…</div>

  return (
    <div>
      <PageHeader title="Toutes les commandes" sub={`${orders.length} commandes`} />
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['Commande', 'Client', 'Adresse', 'Total', 'Statut'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="px-5 py-4 text-sm font-semibold text-gray-900">#{o.id.slice(-6).toUpperCase()}</td>
                <td className="px-5 py-4 text-sm text-gray-700">{o.clientName}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{o.clientAddress}</td>
                <td className="px-5 py-4 text-sm font-semibold text-gray-800">{o.total} dh</td>
                <td className="px-5 py-4"><StatusBadge status={o.status} /></td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-gray-400">Aucune commande</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
