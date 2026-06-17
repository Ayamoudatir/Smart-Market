'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { subscribeOrders } from '@/lib/firestore'
import type { Order, OrderStatus } from '@/types'
import PageHeader from '@/components/layout/PageHeader'
import StatusBadge from '@/components/layout/StatusBadge'

const TABS: { label: string; value: OrderStatus | 'all' }[] = [
  { label: 'Toutes', value: 'all' },
  { label: 'En attente', value: 'en_attente' },
  { label: 'En préparation', value: 'en_preparation' },
  { label: 'Prêtes', value: 'prete' },
]

export default function CommandesPreparateur() {
  const [orders, setOrders] = useState<Order[]>([])
  const [tab, setTab] = useState<OrderStatus | 'all'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = subscribeOrders(o => { setOrders(o); setLoading(false) })
    return unsub
  }, [])

  const filtered = tab === 'all' ? orders : orders.filter(o => o.status === tab)

  if (loading) return <div className="flex items-center justify-center h-full text-gray-400">Chargement…</div>

  return (
    <div>
      <PageHeader title="Commandes en attente" sub="Commandes à préparer" />

      <div className="flex gap-2 mb-6">
        {TABS.map(t => (
          <button key={t.value} onClick={() => setTab(t.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${tab === t.value ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-sm text-gray-400">Aucune commande</div>}
        {filtered.map(o => (
          <Link key={o.id} href={`/preparateur/commandes/${o.id}`}
            className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center justify-between hover:border-green-300 transition block">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <p className="font-semibold text-gray-900">Commande #{o.id.slice(-6).toUpperCase()}</p>
                <StatusBadge status={o.status} />
              </div>
              <p className="text-sm text-gray-500">{o.clientName} · {o.clientAddress}</p>
              <p className="text-xs text-gray-400 mt-1">{o.items.length} article{o.items.length > 1 ? 's' : ''}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">{o.total} dh</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
