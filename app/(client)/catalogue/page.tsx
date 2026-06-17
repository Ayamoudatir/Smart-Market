'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getProducts } from '@/lib/firestore'
import type { Product } from '@/types'
import { useCart } from '@/contexts/CartContext'

const CATS = ['Tout', 'Légumes', 'Fruits', 'Épicerie', 'Boulangerie', 'Fruits secs', 'Viandes', 'Laitiers']

export default function Catalogue() {
  const [products, setProducts] = useState<Product[]>([])
  const [cat, setCat] = useState('Tout')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    getProducts().then(p => { setProducts(p.filter(x => x.status !== 'rupture')); setLoading(false) })
  }, [])

  const filtered = products.filter(p =>
    (cat === 'Tout' || p.categoryName === cat) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="flex items-center justify-center py-20 text-gray-400">Chargement…</div>

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Produits frais du jour</h1>
        <p className="text-sm text-gray-500 mt-1">{products.length} produits disponibles</p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 mb-5 max-w-md">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un produit…" className="flex-1 outline-none text-sm text-gray-700 placeholder:text-gray-400" />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-hide">
        {CATS.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap shrink-0 transition ${cat === c ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(p => (
          <div key={p.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition group">
            <Link href={`/produit/${p.id}`}>
              {p.images?.[0] ? (
                <Image src={p.images[0]} alt={p.name} width={300} height={200} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center text-4xl">🥬</div>
              )}
            </Link>
            <div className="p-3">
              <p className="text-xs text-gray-400 mb-1">{p.categoryName}</p>
              <Link href={`/produit/${p.id}`}>
                <p className="text-sm font-semibold text-gray-900 mb-2 hover:text-green-700 transition">{p.name}</p>
              </Link>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-gray-800">{p.price} dh<span className="text-xs font-normal text-gray-400"> / {p.unit}</span></p>
                <button onClick={() => addItem(p)}
                  className="w-7 h-7 rounded-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center text-lg font-bold transition">+</button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="col-span-4 py-16 text-center text-sm text-gray-400">Aucun produit trouvé</div>}
      </div>
    </div>
  )
}
