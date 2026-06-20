'use client'
import { useEffect, useState, Fragment } from 'react'
import { subscribeOrders, updateOrderStatus } from '@/lib/firestore'
import { useAuth } from '@/contexts/AuthContext'
import type { Order, OrderStatus } from '@/types'
import PageHeader from '@/components/layout/PageHeader'
import StatusBadge from '@/components/layout/StatusBadge'
import { Timestamp } from 'firebase/firestore'

function formatDate(d: unknown) {
  if (!d) return '—'
  const date = d instanceof Timestamp ? d.toDate() : d instanceof Date ? d : null
  if (!date) return '—'
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'en_attente',     label: 'En attente' },
  { value: 'en_preparation', label: 'En préparation' },
  { value: 'prete',          label: 'Prête' },
  { value: 'en_livraison',   label: 'En livraison' },
  { value: 'livree',         label: 'Livrée' },
  { value: 'annulee',        label: 'Annulée' },
]

const FILTER_TABS: { label: string; value: OrderStatus | 'all' }[] = [
  { label: 'Toutes', value: 'all' },
  { label: 'En attente', value: 'en_attente' },
  { label: 'En préparation', value: 'en_preparation' },
  { label: 'Prêtes', value: 'prete' },
  { label: 'En livraison', value: 'en_livraison' },
  { label: 'Livrées', value: 'livree' },
  { label: 'Annulées', value: 'annulee' },
]

export default function AdminCommandes() {
  const { loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    const unsub = subscribeOrders(o => { setOrders(o); setLoading(false) })
    return unsub
  }, [authLoading])

  async function handleStatusChange(id: string, newStatus: OrderStatus) {
    setSaving(id)
    await updateOrderStatus(id, newStatus)
    setSaving(null)
  }

  const filtered = orders.filter(o => {
    const matchStatus = filter === 'all' || o.status === filter
    const matchSearch = !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      o.clientAddress?.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  if (loading) return <div className="flex items-center justify-center py-20 text-green-800/40">Chargement…</div>

  return (
    <div>
      <PageHeader
        title="Commandes"
        sub={`${orders.length} commandes au total`}
      />

      {/* Filtres statut */}
      <div className="flex gap-2 flex-wrap mb-4">
        {FILTER_TABS.map(t => {
          const count = t.value === 'all' ? orders.length : orders.filter(o => o.status === t.value).length
          return (
            <button key={t.value} onClick={() => setFilter(t.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition ${
                filter === t.value ? 'bg-green-600 text-white' : 'bg-white border border-green-100 text-gray-600 hover:bg-green-50/50'
              }`}>
              {t.label}
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                filter === t.value ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-green-100 rounded-xl px-4 py-2.5 mb-4 max-w-sm">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-800/40"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher par ID, client…"
          className="flex-1 outline-none text-sm text-gray-700 placeholder:text-green-800/40" />
      </div>

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-green-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-green-100">
                <th className="text-left text-xs font-semibold text-green-800/40 uppercase tracking-wide px-5 py-3">Commande</th>
                <th className="text-left text-xs font-semibold text-green-800/40 uppercase tracking-wide px-5 py-3">Client</th>
                <th className="text-left text-xs font-semibold text-green-800/40 uppercase tracking-wide px-5 py-3">Date</th>
                <th className="text-left text-xs font-semibold text-green-800/40 uppercase tracking-wide px-5 py-3">Total</th>
                <th className="text-left text-xs font-semibold text-green-800/40 uppercase tracking-wide px-5 py-3">Statut</th>
                <th className="text-left text-xs font-semibold text-green-800/40 uppercase tracking-wide px-5 py-3">Changer</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => {
                const isOpen = expanded === o.id
                return (
                  <Fragment key={o.id}>
                    <tr
                      className={`border-b border-gray-50 transition cursor-pointer ${isOpen ? 'bg-green-50/30' : 'hover:bg-green-50/50'}`}
                      onClick={() => setExpanded(isOpen ? null : o.id)}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-green-800/40 transition-transform ${isOpen ? 'rotate-90' : ''}`}><polyline points="9 18 15 12 9 6"/></svg>
                          <span className="text-sm font-bold text-gray-900">#{o.id.slice(-6).toUpperCase()}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-gray-800">{o.clientName}</p>
                        <p className="text-xs text-green-800/40 truncate max-w-[160px]">{o.clientAddress}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500">{formatDate(o.createdAt)}</td>
                      <td className="px-5 py-4 text-sm font-bold text-gray-900">{o.total} dh</td>
                      <td className="px-5 py-4"><StatusBadge status={o.status} /></td>
                      <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                        {saving === o.id ? (
                          <span className="text-xs text-green-800/40">…</span>
                        ) : (
                          <select
                            value={o.status}
                            onChange={e => handleStatusChange(o.id, e.target.value as OrderStatus)}
                            className="border border-green-100 rounded-xl px-3 py-1.5 text-xs text-gray-700 outline-none focus:border-green-500 bg-white"
                          >
                            {STATUS_OPTIONS.map(s => (
                              <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>

                    {/* Détail articles (accordéon) */}
                    {isOpen && (
                      <tr className="border-b border-green-100 bg-green-50/50/50">
                        <td colSpan={6} className="px-10 py-4">
                          <div className="space-y-1.5">
                            <p className="text-xs font-semibold text-green-800/40 uppercase tracking-wide mb-2">Articles</p>
                            {o.items.map((item, i) => (
                              <div key={i} className="flex items-center justify-between text-sm max-w-md">
                                <span className="text-gray-700">{item.name} × {item.quantity} {item.unit}</span>
                                <span className="font-medium text-gray-800">{(item.price * item.quantity).toFixed(0)} dh</span>
                              </div>
                            ))}
                            {o.clientPhone && (
                              <p className="text-xs text-green-800/40 pt-2">📞 {o.clientPhone}</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-green-800/40">Aucune commande trouvée</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
