'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { createOrder } from '@/lib/firestore'
import PageHeader from '@/components/layout/PageHeader'

export default function Panier() {
  const { items, removeItem, updateQty, total, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleOrder() {
    if (!address.trim()) { alert('Entrez votre adresse de livraison.'); return }
    setLoading(true)
    await createOrder({
      clientId: user?.uid ?? '',
      clientName: user?.displayName ?? user?.email ?? '',
      clientPhone: user?.phoneNumber ?? '',
      clientAddress: address,
      items: items.map(i => ({ productId: i.product.id, name: i.product.name, quantity: i.quantity, unit: i.product.unit, price: i.product.price })),
      total,
      status: 'en_attente',
    })
    clearCart()
    router.push('/commandes')
  }

  if (items.length === 0) return (
    <div className="text-center py-20">
      <p className="text-4xl mb-4">🛒</p>
      <p className="text-lg font-semibold text-gray-700">Votre panier est vide</p>
      <button onClick={() => router.push('/catalogue')} className="mt-4 text-sm text-green-600 hover:text-green-700 font-medium">← Continuer les achats</button>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Mon panier" sub={`${items.length} article${items.length > 1 ? 's' : ''}`} />

      <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 mb-4">
        {items.map(({ product: p, quantity }) => (
          <div key={p.id} className="flex items-center gap-4 px-5 py-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl shrink-0">🥬</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">{p.name}</p>
              <p className="text-xs text-gray-400">{p.price} dh / {p.unit}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQty(p.id, quantity - 1)} className="w-7 h-7 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 flex items-center justify-center text-sm font-bold">-</button>
              <span className="text-sm font-semibold w-6 text-center">{quantity}</span>
              <button onClick={() => updateQty(p.id, quantity + 1)} className="w-7 h-7 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 flex items-center justify-center text-sm font-bold">+</button>
            </div>
            <span className="text-sm font-bold text-gray-800 w-16 text-right">{(p.price * quantity).toFixed(0)} dh</span>
            <button onClick={() => removeItem(p.id)} className="text-gray-300 hover:text-red-400 transition ml-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Adresse de livraison</label>
        <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Ex: Derb El Hajja, Quartier Habous, Casablanca"
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-600">Total</span>
          <span className="text-2xl font-bold text-gray-900">{total} dh</span>
        </div>
        <button onClick={handleOrder} disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition">
          {loading ? 'Envoi…' : 'Valider la commande'}
        </button>
        <button onClick={() => router.push('/catalogue')} className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700 text-center">Continuer les achats</button>
      </div>
    </div>
  )
}
