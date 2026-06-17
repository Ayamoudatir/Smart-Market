'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getOrder, updateOrderStatus } from '@/lib/firestore'
import type { Order } from '@/types'
import PageHeader from '@/components/layout/PageHeader'
import StatusBadge from '@/components/layout/StatusBadge'
import { useAuth } from '@/contexts/AuthContext'

export default function PreparationDetail() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getOrder(id).then(o => { setOrder(o); setLoading(false) })
  }, [id])

  async function takeOrder() {
    setSaving(true)
    await updateOrderStatus(id, 'en_preparation', { preparedBy: user?.displayName ?? user?.email })
    setOrder(prev => prev ? { ...prev, status: 'en_preparation' } : prev)
    setSaving(false)
  }

  async function validatePrep() {
    setSaving(true)
    await updateOrderStatus(id, 'prete')
    setOrder(prev => prev ? { ...prev, status: 'prete' } : prev)
    setSaving(false)
  }

  if (loading) return <div className="flex items-center justify-center h-full text-gray-400">Chargement…</div>
  if (!order) return <div className="text-center text-gray-400 mt-20">Commande introuvable</div>

  return (
    <div className="max-w-2xl">
      <PageHeader
        title={`Préparation #${id.slice(-6).toUpperCase()}`}
        action={<button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700">← Retour</button>}
      />

      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-semibold text-gray-900">{order.clientName}</p>
            <p className="text-sm text-gray-500">{order.clientAddress}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <div className="border-t border-gray-100 pt-4 space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Articles à assembler</p>
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full border-2 border-gray-200 shrink-0" />
                <span className="text-sm text-gray-800">{item.name}</span>
              </div>
              <span className="text-sm font-semibold text-gray-700">{item.quantity} {item.unit}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">Total commande</p>
          <p className="text-xl font-bold text-gray-900">{order.total} dh</p>
        </div>
      </div>

      <div className="flex gap-3">
        {order.status === 'en_attente' && (
          <button onClick={takeOrder} disabled={saving} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition">
            {saving ? '…' : 'Prendre en charge'}
          </button>
        )}
        {order.status === 'en_preparation' && (
          <>
            <button className="flex-1 border border-red-300 text-red-600 hover:bg-red-50 font-medium py-3 rounded-xl transition text-sm">Signaler un problème</button>
            <button onClick={validatePrep} disabled={saving} className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition">
              {saving ? '…' : 'Marquer comme prête'}
            </button>
          </>
        )}
        {order.status === 'prete' && (
          <div className="flex-1 bg-green-50 border border-green-200 text-green-700 font-semibold py-3 rounded-xl text-center">Commande prête ✓</div>
        )}
      </div>
    </div>
  )
}
