'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getOrder, updateOrderStatus } from '@/lib/firestore'
import type { Order } from '@/types'
import StatusBadge from '@/components/layout/StatusBadge'
import { useAuth } from '@/contexts/AuthContext'
import { Timestamp } from 'firebase/firestore'

function formatDate(d: unknown) {
  if (!d) return ''
  const date = d instanceof Timestamp ? d.toDate() : d instanceof Date ? d : null
  if (!date) return ''
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export default function PreparationDetail() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [checked, setChecked] = useState<Set<number>>(new Set())

  useEffect(() => {
    getOrder(id).then(o => {
      setOrder(o)
      setLoading(false)
      // Si déjà en préparation ou prête, on coche tout par défaut
      if (o && (o.status === 'prete' || o.status === 'en_livraison' || o.status === 'livree')) {
        setChecked(new Set(o.items.map((_, i) => i)))
      }
    })
  }, [id])

  function toggleCheck(i: number) {
    if (order?.status === 'prete') return
    setChecked(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  async function takeOrder() {
    setSaving(true)
    await updateOrderStatus(id, 'en_preparation', { preparedBy: user?.displayName ?? user?.email })
    setOrder(prev => prev ? { ...prev, status: 'en_preparation' } : prev)
    setSaving(false)
  }

  async function validatePrep() {
    if (!order) return
    setSaving(true)
    await updateOrderStatus(id, 'prete')
    setOrder(prev => prev ? { ...prev, status: 'prete' } : prev)
    setChecked(new Set(order.items.map((_, i) => i)))
    setSaving(false)
  }

  if (loading) return <div className="flex items-center justify-center py-20 text-gray-400">Chargement…</div>
  if (!order) return <div className="text-center text-gray-400 mt-20">Commande introuvable</div>

  const allChecked = order.items.length > 0 && checked.size === order.items.length
  const progress = order.items.length > 0 ? Math.round((checked.size / order.items.length) * 100) : 0

  return (
    <div className="max-w-xl">

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-gray-900">Commande #{id.slice(-6).toUpperCase()}</h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-sm text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
        </div>
      </div>

      {/* Infos client */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4 flex items-start gap-3">
        <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">{order.clientName}</p>
          <p className="text-sm text-gray-500">{order.clientAddress}</p>
          {order.clientPhone && <p className="text-sm text-gray-500">{order.clientPhone}</p>}
        </div>
      </div>

      {/* Articles avec cases à cocher */}
      <div className="bg-white rounded-2xl border border-gray-200 mb-4 overflow-hidden">
        {/* Barre de progression */}
        {order.status === 'en_preparation' && (
          <div className="px-5 pt-4 pb-3 border-b border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span className="font-medium">{checked.size}/{order.items.length} articles préparés</span>
              <span className="font-semibold text-green-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="divide-y divide-gray-50">
          <div className="px-5 py-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Articles à assembler</p>
          </div>
          {order.items.map((item, i) => {
            const isChecked = checked.has(i)
            const canCheck = order.status === 'en_preparation'
            return (
              <button
                key={i}
                type="button"
                onClick={() => canCheck && toggleCheck(i)}
                disabled={!canCheck}
                className={`w-full flex items-center gap-4 px-5 py-3.5 text-left transition ${canCheck ? 'hover:bg-gray-50 active:bg-gray-100 cursor-pointer' : 'cursor-default'} ${isChecked ? 'bg-green-50/50' : ''}`}
              >
                {/* Checkbox */}
                <div className={`w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                  isChecked
                    ? 'bg-green-500 border-green-500'
                    : order.status === 'en_preparation'
                    ? 'border-gray-300'
                    : 'border-gray-200'
                }`}>
                  {isChecked && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>

                {/* Nom + quantité */}
                <span className={`flex-1 text-sm font-medium transition-all ${isChecked ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                  {item.name}
                </span>
                <span className={`text-sm font-semibold shrink-0 ${isChecked ? 'text-gray-400' : 'text-gray-700'}`}>
                  {item.quantity} {item.unit}
                </span>
              </button>
            )
          })}
        </div>

        {/* Total */}
        <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <p className="text-sm text-gray-500">Total commande</p>
          <p className="text-xl font-bold text-gray-900">{order.total} dh</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {order.status === 'en_attente' && (
          <button
            onClick={takeOrder}
            disabled={saving}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition"
          >
            {saving ? '…' : 'Prendre en charge'}
          </button>
        )}

        {order.status === 'en_preparation' && (
          <button
            onClick={validatePrep}
            disabled={saving || !allChecked}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
          >
            {saving ? '…' : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                {allChecked ? 'Marquer comme prête' : `Encore ${order.items.length - checked.size} article${order.items.length - checked.size > 1 ? 's' : ''}`}
              </>
            )}
          </button>
        )}

        {(order.status === 'prete' || order.status === 'en_livraison' || order.status === 'livree') && (
          <div className="flex-1 bg-green-50 border border-green-200 text-green-700 font-semibold py-3.5 rounded-xl text-center flex items-center justify-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Commande prête
          </div>
        )}
      </div>

      {/* Hint cases à cocher */}
      {order.status === 'en_preparation' && !allChecked && (
        <p className="text-xs text-gray-400 text-center mt-3">Coche chaque article au fur et à mesure pour valider la commande</p>
      )}
    </div>
  )
}
