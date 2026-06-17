'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getOrders } from '@/lib/firestore'
import type { Order } from '@/types'
import PageHeader from '@/components/layout/PageHeader'
import StatCard from '@/components/layout/StatCard'
import StatusBadge from '@/components/layout/StatusBadge'

export default function PreparateurDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrders().then(o => { setOrders(o); setLoading(false) })
  }, [])

  const waiting = orders.filter(o => o.status === 'en_attente')
  const inProgress = orders.filter(o => o.status === 'en_preparation')
  const done = orders.filter(o => o.status === 'prete')

  if (loading) return <div className="flex items-center justify-center h-full text-gray-400">Chargement…</div>

  return (
    <div>
      <PageHeader title="Tableau de bord" sub="Gestion des préparations" />
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="En attente" value={waiting.length} color="yellow" />
        <StatCard label="En cours" value={inProgress.length} color="blue" />
        <StatCard label="Prêtes" value={done.length} color="green" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Commandes à traiter</h2>
        <div className="space-y-3">
          {[...waiting, ...inProgress].length === 0 && <p className="text-sm text-gray-400">Aucune commande à traiter</p>}
          {[...waiting, ...inProgress].map(o => (
            <Link key={o.id} href={`/preparateur/commandes/${o.id}`} className="flex items-center justify-between py-3 px-4 border border-gray-100 rounded-xl hover:border-green-200 hover:bg-green-50 transition">
              <div>
                <p className="text-sm font-semibold text-gray-900">#{o.id.slice(-6).toUpperCase()}</p>
                <p className="text-xs text-gray-500">{o.clientName} · {o.items.length} article{o.items.length > 1 ? 's' : ''}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-800">{o.total} dh</span>
                <StatusBadge status={o.status} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
