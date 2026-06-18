import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1a5c2a] flex flex-col">

      {/* Navbar */}
      <header className="w-full px-6 md:px-12 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5 shadow">
            <Image src="/assets/kenzi_logo.png" alt="Kenzi Market" width={1536} height={1024} className="w-full h-full object-contain" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">Kenzi Market</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-white/80 hover:text-white text-sm font-medium transition">Accueil</Link>
          <Link href="/catalogue" className="text-white/80 hover:text-white text-sm font-medium transition">Catalogue</Link>
          <Link href="#" className="text-white/80 hover:text-white text-sm font-medium transition">À propos</Link>
          <Link href="#" className="text-white/80 hover:text-white text-sm font-medium transition">Contact</Link>
        </nav>

        <div className="flex items-center gap-3">
          {/* Icône panier */}
          <Link href="/panier" className="w-10 h-10 rounded-xl border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </Link>
          <Link href="/login" className="text-white/80 hover:text-white text-sm font-medium px-4 py-2 transition">
            Connexion
          </Link>
          <Link href="/register" className="bg-[#f5c842] hover:bg-[#e6b800] text-gray-900 font-bold text-sm px-5 py-2.5 rounded-xl transition shadow">
            S'inscrire
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center py-10">

          {/* Texte gauche */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5">
              <span className="w-2 h-2 bg-[#f5c842] rounded-full" />
              <span className="text-white/90 text-xs font-medium">Service de livraison & épicerie fraîche</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
              Recevez votre<br />
              épicerie <span className="text-[#f5c842]">fraîche</span><br />
              à domicile.
            </h1>

            <p className="text-white/70 text-base md:text-lg max-w-md">
              Des légumes, fruits et produits du marché livrés en 30 minutes directement chez vous.
            </p>

            {/* Barre de catégorie + bouton */}
            <div className="flex items-center gap-3 max-w-md">
              <div className="flex-1 bg-white rounded-xl flex items-center px-4 py-3 gap-2 shadow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <span className="text-gray-400 text-sm">Rechercher un produit…</span>
              </div>
              <Link href="/catalogue" className="bg-[#f5c842] hover:bg-[#e6b800] text-gray-900 font-bold text-sm px-6 py-3 rounded-xl transition shadow whitespace-nowrap">
                Commander
              </Link>
            </div>

            <p className="text-white/50 text-xs">
              Pas encore membre ?{' '}
              <Link href="/register" className="text-[#f5c842] hover:underline font-medium">S'inscrire maintenant</Link>
            </p>

            {/* Stats */}
            <div className="flex items-center gap-6 pt-2">
              <div className="flex -space-x-2">
                {['bg-green-300','bg-yellow-300','bg-orange-300'].map((c,i) => (
                  <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-[#1a5c2a]`} />
                ))}
              </div>
              <div>
                <p className="text-white font-bold text-sm">+2 500 clients</p>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill="#f5c842" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}
                  <span className="text-white/60 text-xs ml-1">4.8 (1.2k avis)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Image droite */}
          <div className="relative flex justify-center items-end">
            {/* Cercles décoratifs */}
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-green-600/30 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-[#f5c842]/10 rounded-full blur-2xl" />

            {/* Badges flottants */}
            <div className="absolute top-8 right-4 bg-white rounded-2xl px-4 py-2.5 shadow-lg flex items-center gap-2 z-10">
              <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Qualité garantie</p>
                <p className="text-[10px] text-gray-400">Produits frais</p>
              </div>
            </div>

            <div className="absolute top-1/2 right-0 bg-white rounded-2xl px-3 py-2.5 shadow-lg flex items-center gap-2 z-10">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <p className="text-xs font-bold text-gray-800">Livraison 30 min</p>
            </div>

            <div className="absolute bottom-20 right-0 bg-white rounded-2xl px-3 py-2.5 shadow-lg flex items-center gap-2 z-10">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f5c842" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <p className="text-xs font-bold text-gray-800">7j/7 disponible</p>
            </div>

            <Image
              src="/assets/kenzi_market_heropage.png"
              alt="Livreur Kenzi Market"
              width={600}
              height={500}
              className="relative z-10 object-contain max-h-[520px] drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </main>
    </div>
  )
}
