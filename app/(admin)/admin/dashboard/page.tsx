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

  if (loading) return <div className="flex items-center justify-center py-20 text-green-800/40">Chargement…</div>

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
        {/* CA aujourd'hui */}
        <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white shadow-sm group">
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-10 blur-2xl pointer-events-none group-hover:opacity-20 transition-opacity" style={{ background: '#1a5c2a' }} />
          <div className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full bg-green-500" />
          <div className="px-5 pt-4 pb-5 pl-6">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">CA aujourd'hui</p>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-green-100 text-green-700 shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
            </div>
            <p className="text-4xl font-black tracking-tight leading-none text-[#1a5c2a]">{caToday}<span className="text-lg font-semibold text-green-800/30 ml-1">dh</span></p>
            <p className="text-xs text-gray-400 mt-2 font-medium">{todayOrders.length} commande{todayOrders.length > 1 ? 's' : ''} aujourd'hui</p>
          </div>
          <div className="absolute bottom-0 left-6 right-0 h-px opacity-30" style={{ background: 'linear-gradient(to right, #22c55e, transparent)' }} />
        </div>

        {/* CA total livré */}
        <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white shadow-sm group">
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-10 blur-2xl pointer-events-none group-hover:opacity-20 transition-opacity" style={{ background: '#374151' }} />
          <div className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full bg-gray-400" />
          <div className="px-5 pt-4 pb-5 pl-6">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">CA total livré</p>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-100 text-gray-600 shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
              </div>
            </div>
            <p className="text-4xl font-black tracking-tight leading-none text-gray-800">{caTotal}<span className="text-lg font-semibold text-gray-400 ml-1">dh</span></p>
            <p className="text-xs text-gray-400 mt-2 font-medium">{orders.filter(o => o.status === 'livree').length} commandes livrées</p>
          </div>
          <div className="absolute bottom-0 left-6 right-0 h-px opacity-30" style={{ background: 'linear-gradient(to right, #6b7280, transparent)' }} />
        </div>

        {/* Utilisateurs */}
        <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white shadow-sm group">
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-10 blur-2xl pointer-events-none group-hover:opacity-20 transition-opacity" style={{ background: '#1d4ed8' }} />
          <div className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full bg-blue-400" />
          <div className="px-5 pt-4 pb-5 pl-6">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Utilisateurs</p>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600 shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
            </div>
            <p className="text-4xl font-black tracking-tight leading-none text-blue-700">{users.length}</p>
            <p className="text-xs text-gray-400 mt-2 font-medium">{users.filter(u => u.role === 'client').length} clients · {products.length} produits</p>
          </div>
          <div className="absolute bottom-0 left-6 right-0 h-px opacity-30" style={{ background: 'linear-gradient(to right, #3b82f6, transparent)' }} />
        </div>

        {/* Stock critique */}
        <div className={`relative overflow-hidden rounded-2xl backdrop-blur-sm border shadow-sm group ${critiques.length > 0 ? 'bg-red-50/80 border-red-100' : 'bg-white/80 border-white'}`}>
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-10 blur-2xl pointer-events-none group-hover:opacity-20 transition-opacity" style={{ background: critiques.length > 0 ? '#dc2626' : '#1a5c2a' }} />
          <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${critiques.length > 0 ? 'bg-red-500' : 'bg-green-400'}`} />
          <div className="px-5 pt-4 pb-5 pl-6">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Stock critique</p>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${critiques.length > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
            </div>
            <p className={`text-4xl font-black tracking-tight leading-none ${critiques.length > 0 ? 'text-red-600' : 'text-green-600'}`}>{critiques.length}</p>
            <p className="text-xs text-gray-400 mt-2 font-medium">
              {products.filter(p => p.status === 'rupture').length} rupture · {products.filter(p => p.status === 'bas').length} bas
            </p>
          </div>
          <div className="absolute bottom-0 left-6 right-0 h-px opacity-30" style={{ background: `linear-gradient(to right, ${critiques.length > 0 ? '#ef4444' : '#22c55e'}, transparent)` }} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Répartition par statut */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-green-100 p-5">
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
          <div className="mt-4 pt-4 border-t border-green-100 flex justify-between text-sm">
            <span className="text-green-800/40">Total</span>
            <span className="font-bold text-gray-900">{orders.length} commandes</span>
          </div>
        </div>

        {/* Stock critique */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-green-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Stock critique</h2>
            <Link href="/manager/produits" className="text-xs text-green-600 hover:text-green-700 font-medium">Gérer →</Link>
          </div>
          {critiques.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p className="text-sm text-green-800/40">Tous les stocks sont OK</p>
            </div>
          ) : (
            <div className="space-y-0 divide-y divide-gray-50">
              {critiques.slice(0, 6).map(p => (
                <div key={p.id} className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{p.name}</p>
                    <p className="text-xs text-green-800/40">{p.categoryName}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">{p.quantity} {p.unit}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.status === 'rupture' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'}`}>
                      {p.status === 'rupture' ? 'Rupture' : 'Bas'}
                    </span>
                  </div>
                </div>
              ))}
              {critiques.length > 6 && <p className="text-xs text-green-800/40 text-center pt-2">+{critiques.length - 6} autres</p>}
            </div>
          )}
        </div>
      </div>

      {/* Commandes temps réel */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-green-100 p-5">
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
              <tr className="border-b border-green-100">
                <th className="text-left text-xs font-semibold text-green-800/40 uppercase tracking-wide pb-2 pr-4">Commande</th>
                <th className="text-left text-xs font-semibold text-green-800/40 uppercase tracking-wide pb-2 pr-4">Client</th>
                <th className="text-left text-xs font-semibold text-green-800/40 uppercase tracking-wide pb-2 pr-4">Heure</th>
                <th className="text-left text-xs font-semibold text-green-800/40 uppercase tracking-wide pb-2 pr-4">Statut</th>
                <th className="text-right text-xs font-semibold text-green-800/40 uppercase tracking-wide pb-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 10).map(o => (
                <tr key={o.id} className="border-b border-gray-50 last:border-0 hover:bg-green-50/50/50 transition">
                  <td className="py-3 pr-4 text-sm font-semibold text-gray-900">#{o.id.slice(-6).toUpperCase()}</td>
                  <td className="py-3 pr-4 text-sm text-gray-600">{o.clientName}</td>
                  <td className="py-3 pr-4 text-sm text-green-800/40">{formatTime(o.createdAt)}</td>
                  <td className="py-3 pr-4"><StatusBadge status={o.status} /></td>
                  <td className="py-3 text-right text-sm font-bold text-gray-900">{o.total} dh</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={5} className="py-10 text-center text-sm text-green-800/40">Aucune commande</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
