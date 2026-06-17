'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getProduct } from '@/lib/firestore'
import type { Product } from '@/types'
import { useCart } from '@/contexts/CartContext'
import StatusBadge from '@/components/layout/StatusBadge'

const CATEGORY_EMOJI: Record<string, string> = {
  'Légumes': '🥬', 'Fruits': '🍊', 'Épicerie': '🫙',
  'Boulangerie': '🥖', 'Fruits secs': '🌰', 'Laitiers': '🥛',
  'Viandes': '🥩', 'Poissons': '🐟',
}

export default function FicheProduit() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { addItem, items } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    getProduct(id).then(p => { setProduct(p); setLoading(false) })
  }, [id])

  const cartItem = items.find(i => i.product.id === id)

  function handleAdd() {
    if (!product) return
    addItem(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return (
    <div className="flex items-center justify-center py-32 text-gray-400">
      Chargement…
    </div>
  )

  if (!product) return (
    <div className="text-center py-32">
      <p className="text-lg text-gray-500">Produit introuvable.</p>
      <Link href="/catalogue" className="mt-4 inline-block text-green-600 hover:text-green-700 text-sm font-medium">
        ← Retour au catalogue
      </Link>
    </div>
  )

  const emoji = CATEGORY_EMOJI[product.categoryName] ?? '🛒'

  return (
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/catalogue" className="hover:text-gray-600">Catalogue</Link>
        <span>/</span>
        <span className="text-gray-500">{product.categoryName}</span>
        <span>/</span>
        <span className="text-gray-800 font-medium">{product.name}</span>
      </nav>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="md:flex">
          {/* Image */}
          <div className="md:w-80 shrink-0">
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                width={320}
                height={320}
                className="w-full h-64 md:h-full object-cover"
              />
            ) : (
              <div className="w-full h-64 md:h-full bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center text-8xl">
                {emoji}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                  {product.categoryName}
                </span>
                <StatusBadge status={product.status} />
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-1">{product.name}</h1>

              {product.description && (
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{product.description}</p>
              )}

              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-gray-900">{product.price} dh</span>
                <span className="text-gray-400 text-sm">/ {product.unit}</span>
              </div>

              <p className="text-sm text-gray-400 mb-6">
                Stock disponible : <span className="font-medium text-gray-700">{product.quantity} {product.unit}</span>
              </p>
            </div>

            {product.status !== 'rupture' ? (
              <div>
                {/* Quantity selector */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm font-medium text-gray-700">Quantité</span>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition font-bold"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-sm font-semibold text-gray-900">{qty}</span>
                    <button
                      onClick={() => setQty(q => Math.min(product.quantity, q + 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition font-bold"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-gray-400">= {(product.price * qty).toFixed(0)} dh</span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAdd}
                    className={`flex-1 font-semibold py-3 rounded-xl transition text-sm ${
                      added
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {added ? '✓ Ajouté au panier' : 'Ajouter au panier'}
                  </button>
                  <Link
                    href="/panier"
                    className="px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition relative"
                  >
                    Panier
                    {cartItem && (
                      <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {cartItem.quantity}
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 font-medium">
                Ce produit est en rupture de stock.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Link href="/catalogue" className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1">
          ← Continuer les achats
        </Link>
      </div>
    </div>
  )
}
