'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getProduct, updateProduct, addInventoryMovement, getInventoryMovementsByProduct } from '@/lib/firestore'
import { useAuth } from '@/contexts/AuthContext'
import type { Product, InventoryMovement } from '@/types'
import StatusBadge from '@/components/layout/StatusBadge'
import { Timestamp } from 'firebase/firestore'

function computeStatus(qty: number, threshold: number) {
  if (qty === 0) return 'rupture' as const
  if (qty <= threshold) return 'bas' as const
  return 'en_stock' as const
}

function formatDate(d: unknown) {
  if (!d) return '—'
  if (d instanceof Timestamp) return d.toDate().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  if (d instanceof Date) return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  return '—'
}

export default function FicheProduit() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuth()

  const [product, setProduct] = useState<Product | null>(null)
  const [movements, setMovements] = useState<InventoryMovement[]>([])
  const [loading, setLoading] = useState(true)

  // Ajustement stock
  const [mode, setMode] = useState<'in' | 'out'>('in')
  const [qty, setQty] = useState('')
  const [reason, setReason] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getProduct(id), getInventoryMovementsByProduct(id)]).then(([p, m]) => {
      setProduct(p)
      setMovements(m)
      setLoading(false)
    })
  }, [id])

  async function handleAdjust(e: React.FormEvent) {
    e.preventDefault()
    if (!product) return
    const n = Number(qty)
    if (!n || n <= 0) { setError('Quantité invalide.'); return }
    if (mode === 'out' && n > product.quantity) { setError('Quantité supérieure au stock disponible.'); return }

    setSaving(true)
    setError('')
    try {
      const newQty = mode === 'in' ? product.quantity + n : product.quantity - n
      const newStatus = computeStatus(newQty, product.alertThreshold)

      await Promise.all([
        updateProduct(id, { quantity: newQty, status: newStatus }),
        addInventoryMovement({
          productId: id,
          productName: product.name,
          type: mode,
          quantity: n,
          reason: reason || (mode === 'in' ? 'Réapprovisionnement' : 'Sortie stock'),
          by: user?.displayName ?? user?.email ?? 'Manager',
          date: new Date() as unknown as Date,
        }),
      ])

      setProduct(prev => prev ? { ...prev, quantity: newQty, status: newStatus } : prev)
      setMovements(prev => [{
        id: Date.now().toString(),
        productId: id,
        productName: product.name,
        type: mode,
        quantity: n,
        reason: reason || (mode === 'in' ? 'Réapprovisionnement' : 'Sortie stock'),
        by: user?.displayName ?? user?.email ?? 'Manager',
        date: new Date() as unknown as Date,
      }, ...prev])
      setQty('')
      setReason('')
    } catch {
      setError('Erreur lors de la mise à jour.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center py-20 text-gray-400">Chargement…</div>
  if (!product) return <div className="flex items-center justify-center py-20 text-gray-400">Produit introuvable.</div>

  return (
    <div className="max-w-3xl space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button onClick={() => router.back()} className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mb-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Retour
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{product.categoryName} · {product.price} dh / {product.unit}</p>
        </div>
        <Link href={`/manager/produits/${id}/modifier`}
          className="flex items-center gap-2 border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded-xl hover:bg-gray-50 transition">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Modifier
        </Link>
      </div>

      {/* Résumé produit */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 flex gap-5">
        {product.images?.[0] ? (
          <Image src={product.images[0]} alt={product.name} width={100} height={100} className="w-24 h-24 rounded-xl object-cover shrink-0" />
        ) : (
          <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center text-gray-300 shrink-0">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </div>
        )}
        <div className="flex-1 grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Stock actuel</p>
            <p className="text-3xl font-bold text-gray-900">{product.quantity}</p>
            <p className="text-xs text-gray-500">{product.unit}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Seuil d'alerte</p>
            <p className="text-2xl font-bold text-gray-700">{product.alertThreshold}</p>
            <p className="text-xs text-gray-500">{product.unit}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Statut</p>
            <div className="mt-1"><StatusBadge status={product.status} /></div>
          </div>
        </div>
      </div>

      {/* Ajustement de stock */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Ajuster le stock</h2>

        {/* Toggle entrée / sortie */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setMode('in')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2 ${
              mode === 'in' ? 'bg-green-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
            Entrée stock
          </button>
          <button
            type="button"
            onClick={() => setMode('out')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2 ${
              mode === 'out' ? 'bg-red-500 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
            Sortie stock
          </button>
        </div>

        <form onSubmit={handleAdjust} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Quantité ({product.unit})</label>
              <input
                type="number" min="1" required
                value={qty} onChange={e => setQty(e.target.value)}
                placeholder="ex: 20"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Motif (optionnel)</label>
              <input
                type="text"
                value={reason} onChange={e => setReason(e.target.value)}
                placeholder={mode === 'in' ? 'Réapprovisionnement…' : 'Perte, casse…'}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Aperçu nouveau stock */}
          {qty && Number(qty) > 0 && (
            <div className={`rounded-xl px-4 py-3 text-sm flex items-center justify-between ${mode === 'in' ? 'bg-green-50' : 'bg-red-50'}`}>
              <span className="text-gray-600">Nouveau stock estimé</span>
              <span className={`font-bold text-lg ${mode === 'in' ? 'text-green-700' : 'text-red-600'}`}>
                {mode === 'in' ? product.quantity + Number(qty) : product.quantity - Number(qty)} {product.unit}
              </span>
            </div>
          )}

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit" disabled={saving}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold text-white transition disabled:opacity-60 ${
              mode === 'in' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {saving ? 'Enregistrement…' : mode === 'in' ? `+ Ajouter au stock` : `− Retirer du stock`}
          </button>
        </form>
      </div>

      {/* Historique mouvements */}
      <div className="bg-white rounded-2xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Historique des mouvements</h2>
        </div>
        {movements.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-gray-400">Aucun mouvement enregistré</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {movements.map(m => (
              <div key={m.id} className="px-5 py-3.5 flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  m.type === 'in' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {m.type === 'in' ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={`${m.type === 'in' ? '#16a34a' : '#ef4444'}`} strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
                  ) : (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 font-medium">{m.reason}</p>
                  <p className="text-xs text-gray-400 mt-0.5">par {m.by} · {formatDate(m.date)}</p>
                </div>
                <span className={`text-sm font-bold shrink-0 ${m.type === 'in' ? 'text-green-600' : 'text-red-500'}`}>
                  {m.type === 'in' ? '+' : '−'}{m.quantity} {product.unit}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
