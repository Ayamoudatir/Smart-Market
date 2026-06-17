'use client'
import { useEffect, useState } from 'react'
import { subscribeOrders, getProducts, getAllUsers } from '@/lib/firestore'
import type { Order, Product, User } from '@/types'
import Link from 'next/link'
import PageHeader from '@/components/layout/PageHeader'
import StatusBadge from '@/components/layout/StatusBadge'
import { useAuth } from '@/contexts/AuthContext'
import { Timestamp } from 'firebase/firestore'

function formatTime(d: unknown) {
  if (!d) return ''
  const date = d instanceof Timestamp ? d.toDate() : d instanceof Date ? d : null
  if (!date) return ''
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function isToday(d: unknown) {
  const date = d instanceof Timestamp ? d.toDate() : d instanceof Date ? d : null
  if (!date) return false
  const now = new Date()
  return date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
}

const STATUS_CONFIG = [
  { key: 'en_attente',     label: 'En attente',     color: 'bg-gray-400' },
  { key: 'en_preparation', label: 'En préparation',  color: 'bg-blue-500' },
  { key: 'prete',          label: 'Prêtes',          color: 'bg-green-400' },
  { key: 'en_livraison',   label: 'En livraison',    color: 'bg-orange-400' },
  { key: 'livree',         label: 'Livrées',         color: 'bg-green-600' },
  { key: 'annulee',        label: 'Annulées',        color: 'bg-red-400' },
] as const

export default function AdminDashboard() {
  const { loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    const unsub = subscribeOrders(o => { setOrders(o); setLoading(false) })
    Promise.all([getProducts(), getAllUsers()]).then(([p, u]) => {
      setProducts(p); setUsers(u)
    })
    return unsub
  }, [authLoading])

  if (loading) return <div className="flex items-center justify-center py-20 text-gray-400">Chargement…</div>

  const todayOrders = orders.filter(o => isToday(o.createdAt))
  const caToday = todayOrders.reduce((sum, o) => sum + (o.total ?? 0), 0)
  const caTotal = orders.filter(o => o.status === 'livree').reduce((sum, o) => sum + (o.total ?? 0), 0)
  const critiques = products.filter(p => p.status === 'rupture' || p.status === 'bas')
  const maxCount = Math.max(...STATUS_CONFIG.map(s => orders.filter(o => o.status === s.key).length), 1)

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard Admin" sub="Vue globale en temps réel" />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">CA aujourd'hui</p>
          <p className="text-3xl font-bold text-green-600">{caToday} <span className="text-base font-medium text-gray-400">dh</span></p>
          <p className="text-xs text-gray-400 mt-1">{todayOrders.length} commande{todayOrders.length > 1 ? 's' : ''}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">CA total livré</p>
          <p className="text-3xl font-bold text-gray-900">{caTotal} <span className="text-base font-medium text-gray-400">dh</span></p>
          <p className="text-xs text-gray-400 mt-1">{orders.filter(o => o.status === 'livree').length} livrées</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Utilisateurs</p>
          <p className="text-3xl font-bold text-gray-900">{users.length}</p>
          <p className="text-xs text-gray-400 mt-1">{users.filter(u => u.role === 'client').length} clients · {products.length} produits</p>
        </div>
        <div className={`rounded-2xl border p-5 ${critiques.length > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
          <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${critiques.length > 0 ? 'text-red-400' : 'text-gray-400'}`}>Stock critique</p>
          <p className={`text-3xl font-bold ${critiques.length > 0 ? 'text-red-600' : 'text-gray-900'}`}>{critiques.length}</p>
          <p className={`text-xs mt-1 ${critiques.length > 0 ? 'text-red-400' : 'text-gray-400'}`}>
            {products.filter(p => p.status === 'rupture').length} rupture · {products.filter(p => p.status === 'bas').length} bas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Répartition par statut */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Répartition des commandes</h2>
          <div className="space-y-3">
            {STATUS_CONFIG.map(s => {
              const count = orders.filter(o => o.status === s.key).length
              const pct = Math.round((count / maxCount) * 100)
              return (
                <div key={s.key}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">{s.label}</span>
                    <span className="font-semibold text-gray-900">{count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all duration-500 ${s.color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm">
            <span className="text-gray-400">Total</span>
            <span className="font-bold text-gray-900">{orders.length} commandes</span>
          </div>
        </div>

        {/* Stock critique */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Stock critique</h2>
            <Link href="/manager/produits" className="text-xs text-green-600 hover:text-green-700 font-medium">Gérer →</Link>
          </div>
          {critiques.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p className="text-sm text-gray-400">Tous les stocks sont OK</p>
            </div>
          ) : (
            <div className="space-y-0 divide-y divide-gray-50">
              {critiques.slice(0, 6).map(p => (
                <div key={p.id} className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.categoryName}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">{p.quantity} {p.unit}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.status === 'rupture' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'}`}>
                      {p.status === 'rupture' ? 'Rupture' : 'Bas'}
                    </span>
                  </div>
                </div>
              ))}
              {critiques.length > 6 && <p className="text-xs text-gray-400 text-center pt-2">+{critiques.length - 6} autres</p>}
            </div>
          )}
        </div>
      </div>

      {/* Commandes temps réel */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-gray-900">Commandes récentes</h2>
            <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse inline-block" />
              Live
            </span>
          </div>
          <Link href="/admin/commandes" className="text-xs text-green-600 hover:text-green-700 font-medium">Voir toutes →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-2 pr-4">Commande</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-2 pr-4">Client</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-2 pr-4">Heure</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-2 pr-4">Statut</th>
                <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide pb-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 10).map(o => (
                <tr key={o.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition">
                  <td className="py-3 pr-4 text-sm font-semibold text-gray-900">#{o.id.slice(-6).toUpperCase()}</td>
                  <td className="py-3 pr-4 text-sm text-gray-600">{o.clientName}</td>
                  <td className="py-3 pr-4 text-sm text-gray-400">{formatTime(o.createdAt)}</td>
                  <td className="py-3 pr-4"><StatusBadge status={o.status} /></td>
                  <td className="py-3 text-right text-sm font-bold text-gray-900">{o.total} dh</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={5} className="py-10 text-center text-sm text-gray-400">Aucune commande</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
