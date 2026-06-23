'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { getProducts } from '@/lib/firestore'
import type { Product } from '@/types'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import PublicNavbar from '@/components/layout/PublicNavbar'
import PublicFooter from '@/components/layout/PublicFooter'

function HeroAiAgent() {
  const { user } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const firstName = user?.displayName?.split(' ')[0] ?? user?.email?.split('@')[0] ?? ''

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Popup */}
      {open && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 12px)', left: 0,
          background: '#fff', borderRadius: 20,
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
          padding: '18px 18px 14px', width: 270,
          border: '1px solid #e5f0e8',
          animation: 'fadeUp 0.2s ease',
          zIndex: 100,
        }}>
          <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
            <div style={{ width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,#1a5c2a,#22c55e)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
            </div>
            <div>
              <p style={{ fontSize:12,fontWeight:700,color:'#1a5c2a',margin:0 }}>Assistant Kenzi IA</p>
              <p style={{ fontSize:10,color:'#9ca3af',margin:0 }}>Répond à ta voix · En ligne</p>
            </div>
            <button onClick={() => setOpen(false)} style={{ marginLeft:'auto',color:'#9ca3af',background:'none',border:'none',cursor:'pointer',padding:2 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div style={{ background:'#f0fdf4',borderRadius:14,padding:'10px 13px',marginBottom:13 }}>
            {user ? (
              <p style={{ fontSize:13,color:'#374151',margin:0,lineHeight:1.6 }}>
                Bonjour <strong>{firstName}</strong> 👋<br />
                Dicte ta liste de courses ou prends une photo — je m'occupe du reste.
              </p>
            ) : (
              <p style={{ fontSize:13,color:'#374151',margin:0,lineHeight:1.6 }}>
                Connecte-toi et commande par <strong>voix</strong> ou <strong>photo</strong> en quelques secondes. 🎙️
              </p>
            )}
          </div>
          <button onClick={() => { setOpen(false); router.push(user ? '/panier' : '/login?redirect=/panier') }}
            style={{ width:'100%',background:'#1a5c2a',color:'#fff',border:'none',borderRadius:12,padding:'10px 0',fontSize:13,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
            {user ? 'Commander par voix ou photo' : 'Se connecter'}
          </button>
        </div>
      )}

      {/* Bouton bulle */}
      <button onClick={() => setOpen(o => !o)} style={{
        display:'flex', alignItems:'center', gap:10,
        background:'rgba(255,255,255,0.12)', backdropFilter:'blur(12px)',
        border:'1px solid rgba(255,255,255,0.25)',
        borderRadius:50, padding:'10px 18px 10px 10px',
        cursor:'pointer', color:'#fff',
        boxShadow:'0 4px 20px rgba(0,0,0,0.2)',
        transition:'transform 0.2s',
      }}
        onMouseEnter={e => (e.currentTarget.style.transform='scale(1.03)')}
        onMouseLeave={e => (e.currentTarget.style.transform='scale(1)')}
      >
        {/* Avatar animé */}
        <div style={{ position:'relative', width:38, height:38, borderRadius:'50%', background:'linear-gradient(135deg,#1a5c2a,#22c55e)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <span style={{ position:'absolute',inset:-5,borderRadius:'50%',border:'2px solid rgba(34,197,94,0.5)',animation:'ripple 2s ease-in-out infinite' }} />
          <style>{`@keyframes ripple{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.2);opacity:0.4}}`}</style>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
          <span style={{ position:'absolute',top:-3,right:-3,background:'#f5c842',color:'#111',fontSize:7,fontWeight:800,padding:'1px 4px',borderRadius:4 }}>IA</span>
        </div>
        <div style={{ textAlign:'left' }}>
          <p style={{ fontSize:12,fontWeight:700,margin:0,lineHeight:1.2 }}>Commander par IA</p>
          <p style={{ fontSize:10,opacity:0.7,margin:0 }}>Voix · Photo · Texte</p>
        </div>
      </button>
    </div>
  )
}

const CATS = ['Tout', 'Légumes', 'Fruits', 'Épicerie', 'Boulangerie', 'Fruits secs', 'Viandes', 'Laitiers']

const CAT_ICONS = [
  { label: 'Légumes', bg: 'bg-green-100', svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 1 10 10"/><path d="M12 2C6.5 2 2 6.5 2 12"/><path d="M12 22V12"/><path d="M2 12h20"/></svg> },
  { label: 'Fruits', bg: 'bg-orange-100', svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20"/><path d="M2 12h20"/></svg> },
  { label: 'Viandes', bg: 'bg-red-100', svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg> },
  { label: 'Boulangerie', bg: 'bg-yellow-100', svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/></svg> },
  { label: 'Laitiers', bg: 'bg-sky-100', svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2h8l2 6H6L8 2z"/><path d="M6 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8"/><line x1="10" y1="12" x2="14" y2="12"/></svg> },
  { label: 'Épicerie', bg: 'bg-purple-100', svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg> },
  { label: 'Fruits secs', bg: 'bg-amber-100', svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 19.34"/><path d="M21 3l-1 9s-5-5-11-3"/></svg> },
  { label: 'Livraison rapide', bg: 'bg-teal-100', svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> },
]

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [cat, setCat] = useState('Tout')
  const [search, setSearch] = useState('')
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [addedId, setAddedId] = useState<string | null>(null)
  const [catOpen, setCatOpen] = useState(false)
  const { addItem, totalItems } = useCart()
  const { user } = useAuth()
  const displayName = user?.displayName || user?.email?.split('@')[0] || ''
  const initials = displayName ? displayName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2) : null

  useEffect(() => {
    getProducts().then(p => { setProducts(p.filter(x => x.status !== 'rupture')); setLoadingProducts(false) })
  }, [])

  function handleAdd(p: Product) {
    addItem(p)
    setAddedId(p.id)
    setTimeout(() => setAddedId(null), 1000)
  }

  const filtered = products.filter(p =>
    (cat === 'Tout' || p.categoryName === cat) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── BARRE ANNONCE ── */}
      <div className="bg-[#1a5c2a] text-white text-center text-xs font-semibold py-2 tracking-wide">
        Livraison gratuite dès <span className="text-[#f5c842]">150 dh</span> — Produits frais livrés en <span className="text-[#f5c842]">30 minutes</span>
      </div>

      {/* ── HERO BANNER avec navbar transparente ── */}
      <div className="relative w-full h-[700px] md:h-[820px] overflow-hidden">
        <Image
          src="/assets/kenzi_market_heropage.png"
          alt="Kenzi Market"
          fill
          priority
          className="object-cover object-[center_5%] hero-img"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/50 to-transparent" />

        {/* Navbar transparente */}
        <header className="absolute top-0 left-0 right-0 z-50">
          {/* Ligne 1 : Logo + Compte + Panier */}
          <div className="flex items-center px-3 md:px-14 py-3 gap-2">
            <Link href="/" className="shrink-0">
              <Image src="/assets/kenzi_logo.png" alt="Kenzi Market" width={100} height={100} className="object-contain drop-shadow-lg w-12 h-12 md:w-[88px] md:h-[88px]" />
            </Link>

            {/* Barre de recherche desktop uniquement */}
            <div className="hidden md:flex flex-1 max-w-xl mx-2">
              <div className="flex items-center bg-white/15 backdrop-blur-md rounded-xl overflow-hidden border border-white/25 focus-within:bg-white/25 transition w-full">
                <div className="flex items-center gap-2 flex-1 px-4 py-2.5">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="opacity-60 shrink-0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un produit…" className="flex-1 bg-transparent text-sm text-white placeholder:text-white/50 outline-none" />
                </div>
                <button onClick={() => document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' })} className="bg-[#f5c842] text-gray-900 px-5 py-2.5 text-sm font-bold hover:bg-yellow-400 transition shrink-0">
                  Rechercher
                </button>
              </div>
            </div>

            {/* Spacer mobile */}
            <div className="flex-1 md:hidden" />

            {/* Compte + Panier */}
            <div className="flex items-center gap-0 shrink-0">
              <Link href={user ? '/compte' : '/login'} className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl hover:bg-white/10 transition">
                {initials ? (
                  <div className="w-7 h-7 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-white text-[10px] font-black">{initials}</div>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                )}
                <span className="text-white/70 text-[10px]">{user ? (displayName.split(' ')[0] || 'Compte') : 'Compte'}</span>
              </Link>
              <Link href="/panier" className="relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl hover:bg-white/10 transition">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                <span className="text-white/70 text-[10px]">Panier</span>
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 bg-[#f5c842] text-gray-900 text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center leading-none">{totalItems}</span>
                )}
              </Link>
            </div>
          </div>

          {/* Ligne 2 : Barre de recherche mobile pleine largeur */}
          <div className="md:hidden px-3 pb-2">
            <div className="flex items-center bg-white/15 backdrop-blur-md rounded-xl overflow-hidden border border-white/25 focus-within:bg-white/25 transition">
              <div className="flex items-center gap-2 flex-1 px-3 py-2.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="opacity-60 shrink-0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un produit…" className="flex-1 bg-transparent text-sm text-white placeholder:text-white/50 outline-none" />
              </div>
              <button onClick={() => document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' })} className="bg-[#f5c842] text-gray-900 px-4 py-2.5 text-sm font-bold hover:bg-yellow-400 transition shrink-0">
                Rechercher
              </button>
            </div>
          </div>
        </header>

        {/* Contenu hero */}
        <div className="absolute inset-0 flex items-center">
          <div className="px-8 md:px-16 max-w-xl space-y-5 pt-20">
            <div className="hero-badge inline-flex items-center gap-2 bg-[#f5c842] text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full badge-pulse">
              <span className="w-1.5 h-1.5 bg-gray-900 rounded-full animate-pulse" />
              Nouveautés du jour
            </div>
            <h1 className="hero-title text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-lg">
              Épicerie <span className="text-[#f5c842]">fraîche</span><br />livrée chez vous
            </h1>
            <p className="hero-sub text-white/70 text-base">Produits sélectionnés du marché, livrés en <span className="text-white font-semibold">30 min</span>.</p>
            <div className="hero-cta flex items-center gap-3 flex-wrap">
              <button
                onClick={() => document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-[#f5c842] text-gray-900 font-bold px-6 py-3 rounded-xl text-sm hover:bg-yellow-400 hover:scale-105 active:scale-95 transition-all shadow-lg">
                Commander maintenant
              </button>
              <Link href="/register" className="text-white border border-white/40 font-semibold px-6 py-3 rounded-xl text-sm hover:bg-white/10 hover:scale-105 active:scale-95 transition-all">
                S'inscrire
              </Link>
            </div>

            {/* Bulle agent IA */}
            <HeroAiAgent />
          </div>
        </div>
      </div>

      {/* ── BARRE CATÉGORIES TOGGLE ── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-3 h-14">

            {/* Bouton toggle "Toutes les catégories" */}
            <button
              onClick={() => setCatOpen(o => !o)}
              className="flex items-center gap-2 bg-[#1a5c2a] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-800 transition shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              Toutes les catégories
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform ${catOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
            </button>

            {/* Séparateur */}
            <div className="w-px h-6 bg-gray-200 shrink-0" />

            {/* Catégories scrollables */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide flex-1">
              {CATS.map(c => (
                <button key={c} onClick={() => { setCat(c); document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' }) }}
                  className={`px-4 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap transition shrink-0 ${cat === c ? 'bg-[#1a5c2a] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dropdown catégories */}
        {catOpen && (
          <div className="absolute left-0 right-0 bg-white border-t border-gray-100 shadow-xl z-50">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
              <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                {CAT_ICONS.map((c, i) => (
                  <button key={i} onClick={() => { setCat(c.label === 'Livraison rapide' ? 'Tout' : c.label); setCatOpen(false); document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' }) }}
                    className="flex flex-col items-center gap-2 group">
                    <div className={`w-14 h-14 rounded-full ${c.bg} flex items-center justify-center group-hover:scale-110 transition shadow-sm`}>
                      {c.svg}
                    </div>
                    <span className="text-xs font-medium text-gray-600 group-hover:text-[#1a5c2a] transition text-center">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── SECTION CATALOGUE ── */}
      <section id="catalogue" className="max-w-7xl mx-auto px-4 md:px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {cat === 'Tout' ? 'Tous les produits' : cat}
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">{filtered.length} produits disponibles</p>
          </div>
          {cat !== 'Tout' && (
            <button onClick={() => setCat('Tout')} className="text-sm text-[#1a5c2a] font-medium hover:underline">
              Voir tout
            </button>
          )}
        </div>

        {/* Grille produits */}
        {loadingProducts ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="w-full h-40 bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map(p => (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all group">
                <div className="relative overflow-hidden">
                  {p.images?.[0] ? (
                    <Image src={p.images[0]} alt={p.name} width={300} height={200} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-40 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#86efac" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <span className="bg-[#1a5c2a] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{p.categoryName}</span>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">{p.name}</p>
                  <div className="flex items-center justify-between mt-2">
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
            {filtered.length === 0 && (
              <div className="col-span-5 py-20 text-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" className="mx-auto mb-3"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <p className="text-sm text-gray-400">Aucun produit trouvé</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── NOS UNIVERS ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <h2 className="text-xl font-bold text-gray-900 mb-5">Découvrez nos univers</h2>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {[
            { label: 'Légumes frais', sub: '45+ produits', gradient: 'from-green-600 to-green-400', slug: 'legumes', icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 1 10 10"/><path d="M12 2C6.5 2 2 6.5 2 12"/><path d="M12 22V12"/><path d="M2 12h20"/></svg> },
            { label: 'Fruits de saison', sub: '30+ produits', gradient: 'from-orange-500 to-yellow-400', slug: 'fruits', icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20"/><path d="M2 12h20"/></svg> },
            { label: 'Viandes & Volailles', sub: '20+ produits', gradient: 'from-red-600 to-rose-400', slug: 'viandes', icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg> },
            { label: 'Boulangerie', sub: '15+ produits', gradient: 'from-yellow-600 to-amber-400', slug: 'boulangerie', icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/></svg> },
            { label: 'Produits laitiers', sub: '25+ produits', gradient: 'from-sky-500 to-blue-400', slug: 'laitiers', icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2h8l2 6H6L8 2z"/><path d="M6 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8"/><line x1="10" y1="12" x2="14" y2="12"/></svg> },
            { label: 'Épicerie fine', sub: '60+ produits', gradient: 'from-purple-600 to-violet-400', slug: 'epicerie', icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg> },
            { label: 'Fruits secs', sub: '18+ produits', gradient: 'from-amber-700 to-yellow-500', slug: 'fruits-secs', icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 19.34"/><path d="M21 3l-1 9s-5-5-11-3"/></svg> },
          ].map((u, i) => (
            <Link key={i} href={`/categorie/${u.slug}`}
              className="shrink-0 w-44 h-52 rounded-2xl overflow-hidden relative group hover:scale-105 transition-transform">
              <div className={`absolute inset-0 bg-gradient-to-b ${u.gradient}`} />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition" />
              <div className="relative h-full flex flex-col items-center justify-center gap-3 p-4">
                <div className="opacity-90">{u.icon}</div>
                <div className="text-center">
                  <p className="text-white font-bold text-sm leading-tight">{u.label}</p>
                  <p className="text-white/70 text-xs mt-1">{u.sub}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <PublicFooter />

    </div>
  )
}
