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
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })
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

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#1a5c2a] border-t-transparent animate-spin" />
        <p className="text-sm text-green-800/40">Chargement…</p>
      </div>
    </div>
  )
  if (!order) return (
    <div className="flex flex-col items-center justify-center py-20 gap-2">
      <p className="text-gray-400">Commande introuvable</p>
      <button onClick={() => router.back()} className="text-sm text-[#1a5c2a] font-semibold hover:underline">← Retour</button>
    </div>
  )

  const allChecked = order.items.length > 0 && checked.size === order.items.length
  const progress = order.items.length > 0 ? Math.round((checked.size / order.items.length) * 100) : 0

  return (
    <div className="max-w-xl space-y-4">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl bg-white/80 backdrop-blur-sm border border-green-100 flex items-center justify-center text-green-800/60 hover:text-[#1a5c2a] hover:border-green-300 transition shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-black text-[#1a5c2a]">#{id.slice(-6).toUpperCase()}</h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-xs text-green-800/40 mt-0.5 font-medium">{formatDate(order.createdAt)}</p>
        </div>
      </div>

      {/* Infos client */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-green-100 p-4 flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-[#1a5c2a]/10 flex items-center justify-center shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a5c2a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm">{order.clientName}</p>
          <p className="text-xs text-green-800/50 mt-0.5 truncate">{order.clientAddress}</p>
          {order.clientPhone && <p className="text-xs text-green-800/50">{order.clientPhone}</p>}
        </div>
        {order.clientPhone && (
          <a href={`tel:${order.clientPhone}`}
            className="w-9 h-9 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-700 hover:bg-green-100 transition shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.06 6.18 2 2 0 0 1 6.01 4h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L10.09 11a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 24 18z"/></svg>
          </a>
        )}
      </div>

      {/* Articles */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-green-100 overflow-hidden">

        {/* Progress bar (en préparation) */}
        {order.status === 'en_preparation' && (
          <div className="px-5 pt-4 pb-4 border-b border-green-50">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-green-800/60">{checked.size} / {order.items.length} articles préparés</span>
              <span className="font-black text-[#1a5c2a]">{progress}%</span>
            </div>
            <div className="w-full bg-green-100/60 rounded-full h-2.5">
              <div
                className="h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: 'linear-gradient(to right, #1a5c2a, #22c55e)' }}
              />
            </div>
          </div>
        )}

        {/* Label */}
        <div className="px-5 py-3 border-b border-green-50">
          <p className="text-[10px] font-bold uppercase tracking-widest text-green-800/40">Articles à assembler</p>
        </div>

        {/* Items */}
        <div className="divide-y divide-green-50/80">
          {order.items.map((item, i) => {
            const isChecked = checked.has(i)
            const canCheck = order.status === 'en_preparation'
            return (
              <button
                key={i}
                type="button"
                onClick={() => canCheck && toggleCheck(i)}
                disabled={!canCheck}
                className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-all
                  ${canCheck ? 'hover:bg-green-50/60 active:bg-green-100/40 cursor-pointer' : 'cursor-default'}
                  ${isChecked ? 'bg-green-50/40' : ''}`}
              >
                {/* Checkbox */}
                <div className={`w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center transition-all duration-200 ${
                  isChecked
                    ? 'bg-[#1a5c2a] border-[#1a5c2a] shadow-sm'
                    : canCheck
                    ? 'border-green-200 hover:border-green-400'
                    : 'border-green-100'
                }`}>
                  {isChecked && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>

                {/* Nom */}
                <span className={`flex-1 text-sm font-semibold transition-all ${isChecked ? 'line-through text-gray-300' : 'text-gray-800'}`}>
                  {item.name}
                </span>

                {/* Quantité */}
                <span className={`text-sm font-bold shrink-0 px-3 py-1 rounded-lg transition-all ${
                  isChecked ? 'bg-green-50 text-green-300' : 'bg-green-50 text-[#1a5c2a]'
                }`}>
                  {item.quantity} {item.unit}
                </span>
              </button>
            )
          })}
        </div>

        {/* Total */}
        <div className="px-5 py-4 border-t border-green-100 flex items-center justify-between bg-green-50/40">
          <p className="text-sm text-green-800/50 font-medium">Total commande</p>
          <div className="flex items-baseline gap-1">
            <p className="text-2xl font-black text-[#1a5c2a]">{order.total}</p>
            <p className="text-sm font-semibold text-green-800/40">dh</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div>
        {order.status === 'en_attente' && (
          <button
            onClick={takeOrder}
            disabled={saving}
            className="w-full bg-[#1a5c2a] hover:bg-green-800 disabled:opacity-60 text-white font-bold py-4 rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-green-900/20"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
            {saving ? 'Prise en charge…' : 'Prendre en charge'}
          </button>
        )}

        {order.status === 'en_preparation' && (
          <button
            onClick={validatePrep}
            disabled={saving || !allChecked}
            className="w-full bg-[#1a5c2a] hover:bg-green-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-green-900/20"
          >
            {saving ? (
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {allChecked ? 'Marquer comme prête' : `${order.items.length - checked.size} article${order.items.length - checked.size > 1 ? 's' : ''} restant${order.items.length - checked.size > 1 ? 's' : ''}`}
              </>
            )}
          </button>
        )}

        {(order.status === 'prete' || order.status === 'en_livraison' || order.status === 'livree') && (
          <div className="w-full bg-green-50 border border-green-200 text-green-700 font-bold py-4 rounded-2xl text-center flex items-center justify-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Commande prête
          </div>
        )}
      </div>

      {order.status === 'en_preparation' && !allChecked && (
        <p className="text-xs text-green-800/30 text-center font-medium">
          Coche chaque article au fur et à mesure pour valider
        </p>
      )}
    </div>
  )
}
