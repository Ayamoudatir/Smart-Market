'use client'
import { useEffect, useState } from 'react'
import { getInventoryMovements } from '@/lib/firestore'
import type { InventoryMovement } from '@/types'
import PageHeader from '@/components/layout/PageHeader'

export default function StockHistory() {
  const [movements, setMovements] = useState<InventoryMovement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getInventoryMovements(100).then(m => { setMovements(m); setLoading(false) })
  }, [])

  if (loading) return <div className="flex items-center justify-center h-full text-gray-400">Chargement…</div>

  return (
    <div>
      <PageHeader title="Historique du stock" sub="Tous les mouvements d'entrée et sortie" />
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-100">
              {['Produit', 'Type', 'Quantité', 'Raison', 'Par', 'Date'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {movements.map(m => (
              <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="px-5 py-3.5 text-sm font-medium text-gray-800">{m.productName}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${m.type === 'in' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {m.type === 'in' ? 'Entrée' : 'Sortie'}
                  </span>
                </td>
                <td className={`px-5 py-3.5 text-sm font-semibold ${m.type === 'in' ? 'text-green-600' : 'text-red-500'}`}>
                  {m.type === 'in' ? '+' : '-'}{m.quantity}
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-500">{m.reason}</td>
                <td className="px-5 py-3.5 text-sm text-gray-500">{m.by}</td>
                <td className="px-5 py-3.5 text-xs text-gray-400">{m.date ? new Date((m.date as unknown as { seconds: number }).seconds * 1000).toLocaleDateString('fr-MA') : '-'}</td>
              </tr>
            ))}
            {movements.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">Aucun mouvement enregistré</td></tr>
            )}
          </tbody>
        </table></div>
      </div>
    </div>
  )
}
