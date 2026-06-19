'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { getProducts } from '@/lib/firestore'
import type { Product } from '@/types'
import { useCart } from '@/contexts/CartContext'
import PublicNavbar from '@/components/layout/PublicNavbar'
import PublicFooter from '@/components/layout/PublicFooter'

const SLUG_TO_CAT: Record<string, string> = {
  'legumes':        'Légumes',
  'fruits':         'Fruits',
  'viandes':        'Viandes',
  'boulangerie':    'Boulangerie',
  'laitiers':       'Laitiers',
  'epicerie':       'Épicerie',
  'fruits-secs':    'Fruits secs',
}

const CAT_META: Record<string, { gradient: string; desc: string }> = {
  'Légumes':     { gradient: 'from-green-600 to-green-400',   desc: 'Légumes frais du marché, cueillis chaque matin.' },
  'Fruits':      { gradient: 'from-orange-500 to-yellow-400', desc: 'Fruits de saison gorgés de soleil.' },
  'Viandes':     { gradient: 'from-red-600 to-rose-400',      desc: 'Viandes et volailles sélectionnées avec soin.' },
  'Boulangerie': { gradient: 'from-yellow-600 to-amber-400',  desc: 'Pain frais et viennoiseries du four.' },
  'Laitiers':    { gradient: 'from-sky-500 to-blue-400',      desc: 'Produits laitiers frais et naturels.' },
  'Épicerie':    { gradient: 'from-purple-600 to-violet-400', desc: 'Épicerie fine et produits du quotidien.' },
  'Fruits secs': { gradient: 'from-amber-700 to-yellow-500',  desc: 'Fruits secs et oléagineux de qualité.' },
}

export default function CategoriePage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const catName = SLUG_TO_CAT[slug] ?? 'Tout'
  const meta = CAT_META[catName]

  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<'default' | 'asc' | 'desc'>('default')
  const [loading, setLoading] = useState(true)
  const [addedId, setAddedId] = useState<string | null>(null)
  const { addItem, totalItems } = useCart()

  useEffect(() => {
    getProducts().then(all => {
      setProducts(all.filter(p => p.status !== 'rupture' && p.categoryName === catName))
      setLoading(false)
    })
  }, [catName])

  function handleAdd(p: Product) {
    addItem(p)
    setAddedId(p.id)
    setTimeout(() => setAddedId(null), 1000)
  }

  let filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
  if (sort === 'asc')  filtered = [...filtered].sort((a, b) => a.price - b.price)
  if (sort === 'desc') filtered = [...filtered].sort((a, b) => b.price - a.price)

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── BANNER CATÉGORIE avec navbar ── */}
      <div className="overflow-visible relative" style={{ background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 50%, #fff8e1 100%)' }}>

        <PublicNavbar search={search} onSearch={setSearch} placeholder={`Rechercher dans ${catName}…`} />
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative flex items-center min-h-[220px]">

          {/* Texte gauche */}
          <div className="relative z-10 py-8 flex-1">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
              <Link href="/" className="hover:text-gray-600 transition">Accueil</Link>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
              <span className="text-gray-700 font-medium">{catName}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900">{catName}</h1>
            <p className="text-gray-500 mt-2 text-sm max-w-xs">{meta?.desc}</p>
            <span className="inline-block mt-3 bg-[#1a5c2a] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              {products.length} produits disponibles
            </span>
          </div>

          {/* Image centrale — centrée sur la ligne de séparation */}
          <div className="absolute left-[45%] -translate-x-1/2 -bottom-[220px] pointer-events-none z-20">
            <Image
              src="/assets/panier_legumes .png"
              alt={catName}
              width={720}
              height={560}
              className="object-contain drop-shadow-2xl"
            />
          </div>

          {/* Espace droite */}
          <div className="flex-1" />
        </div>
      </div>

      {/* ── CONTENU ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-64 pb-8">

        {/* Barre filtres */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Retour
          </button>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{filtered.length} produits</span>
            <select value={sort} onChange={e => setSort(e.target.value as typeof sort)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#1a5c2a] bg-white">
              <option value="default">Pertinence</option>
              <option value="asc">Prix croissant</option>
              <option value="desc">Prix décroissant</option>
            </select>
          </div>
        </div>

        {/* Grille */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="w-full h-44 bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" className="mx-auto mb-4"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <p className="text-gray-400 font-medium">Aucun produit trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map(p => (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all group">
                <div className="relative overflow-hidden">
                  {p.images?.[0] ? (
                    <Image src={p.images[0]} alt={p.name} width={300} height={220} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className={`w-full h-44 bg-gradient-to-br ${meta?.gradient ?? 'from-green-50 to-green-100'} opacity-30 flex items-center justify-center`}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/></svg>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">{p.name}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-base font-bold text-gray-900">{p.price} dh</span>
                      <span className="text-xs text-gray-400 ml-1">/ {p.unit}</span>
                    </div>
                    <button
                      onClick={() => handleAdd(p)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white transition-all ${addedId === p.id ? 'bg-green-500 scale-110' : 'bg-[#1a5c2a] hover:bg-green-700 hover:scale-105'}`}>
                      {addedId === p.id
                        ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      }
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <PublicFooter />

      {/* Panier flottant */}
      {totalItems > 0 && (
        <Link href="/panier" className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#f5c842] text-gray-900 font-bold px-5 py-3.5 rounded-2xl shadow-2xl hover:scale-105 transition-all">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          <span>Mon panier</span>
          <span className="bg-gray-900 text-white text-xs font-extrabold w-5 h-5 rounded-full flex items-center justify-center">{totalItems}</span>
        </Link>
      )}
    </div>
  )
}
