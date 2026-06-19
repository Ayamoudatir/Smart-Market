'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { createOrder } from '@/lib/firestore'
import PublicNavbar from '@/components/layout/PublicNavbar'
import PublicFooter from '@/components/layout/PublicFooter'

export default function Panier() {
  const { items, removeItem, updateQty, total, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleOrder() {
    if (!user) { router.push('/login?redirect=/panier'); return }
    if (!address.trim()) { alert('Entrez votre adresse de livraison.'); return }
    setLoading(true)
    await createOrder({
      clientId: user.uid,
      clientName: user.displayName ?? user.email ?? '',
      clientPhone: user.phoneNumber ?? '',
      clientAddress: address,
      items: items.map(i => ({ productId: i.product.id, name: i.product.name, quantity: i.quantity, unit: i.product.unit, price: i.product.price })),
      total,
      status: 'en_attente',
    })
    clearCart()
    router.push('/commandes')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Navbar */}
      <div className="bg-white shadow-sm">
        <PublicNavbar />
      </div>

      {/* Contenu */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 md:px-8 py-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#1a5c2a] rounded-xl flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Mon panier</h1>
            <p className="text-sm text-gray-400">{items.length} article{items.length > 1 ? 's' : ''}</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" className="mx-auto mb-4"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <p className="text-gray-500 font-semibold mb-1">Votre panier est vide</p>
            <p className="text-gray-400 text-sm mb-5">Ajoutez des produits pour commencer</p>
            <button onClick={() => router.push('/#catalogue')}
              className="bg-[#1a5c2a] text-white font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-green-800 transition">
              Voir les produits
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">

            {/* Articles */}
            <div className="md:col-span-2 space-y-3">
              {items.map(({ product: p, quantity }) => (
                <div key={p.id} className="bg-white rounded-2xl border border-gray-100 flex items-center gap-4 px-4 py-3 hover:shadow-sm transition">
                  {/* Image produit */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                    {p.images?.[0] ? (
                      <Image src={p.images[0]} alt={p.name} width={64} height={64} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-green-50 flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#86efac" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.price} dh / {p.unit}</p>
                  </div>

                  {/* Quantité */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => updateQty(p.id, quantity - 1)}
                      className="w-7 h-7 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 flex items-center justify-center font-bold text-sm transition">−</button>
                    <span className="text-sm font-semibold w-5 text-center">{quantity}</span>
                    <button onClick={() => updateQty(p.id, quantity + 1)}
                      className="w-7 h-7 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 flex items-center justify-center font-bold text-sm transition">+</button>
                  </div>

                  <span className="text-sm font-bold text-gray-900 w-16 text-right shrink-0">{(p.price * quantity).toFixed(0)} dh</span>

                  <button onClick={() => removeItem(p.id)} className="text-gray-300 hover:text-red-400 transition ml-1 shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Récapitulatif */}
            <div className="space-y-4">
              {/* Adresse */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline mr-1.5 mb-0.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  Adresse de livraison
                </label>
                <textarea
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  rows={3}
                  placeholder="Ex: Derb El Hajja, Quartier Habous, Casablanca"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#1a5c2a] focus:ring-1 focus:ring-[#1a5c2a] resize-none"
                />
              </div>

              {/* Total + CTA */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Sous-total</span>
                    <span>{total} dh</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Livraison</span>
                    <span className={total >= 150 ? 'text-green-600 font-medium' : ''}>{total >= 150 ? 'Gratuite' : '15 dh'}</span>
                  </div>
                  <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-xl">{total >= 150 ? total : total + 15} dh</span>
                  </div>
                </div>

                {total < 150 && (
                  <p className="text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-2 mb-3">
                    Plus que <strong>{150 - total} dh</strong> pour la livraison gratuite !
                  </p>
                )}

                <button onClick={handleOrder} disabled={loading}
                  className="w-full bg-[#1a5c2a] hover:bg-green-800 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition text-sm">
                  {loading ? 'Envoi en cours…' : 'Valider la commande'}
                </button>
                <button onClick={() => router.push('/#catalogue')}
                  className="w-full mt-2 text-sm text-gray-400 hover:text-gray-600 text-center transition py-2">
                  ← Continuer les achats
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  )
}
