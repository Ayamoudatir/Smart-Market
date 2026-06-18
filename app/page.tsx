import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d3d1e 0%, #1a5c2a 40%, #2d7a3a 70%, #1e6b30 100%)' }}>

      {/* Formes organiques floues background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #4ade80, transparent)' }} />
        <div className="absolute top-1/3 -left-20 w-72 h-72 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #86efac, transparent)' }} />
        <div className="absolute -bottom-20 left-1/4 w-80 h-80 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #16a34a, transparent)' }} />
        <div className="absolute top-0 right-1/3 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #f5c842, transparent)' }} />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #15803d, transparent)' }} />
        {/* Grille subtile */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      {/* NAVBAR */}
      <nav className="relative z-50 w-full px-6 md:px-16 pt-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center p-2 shadow-lg group-hover:bg-white/25 transition-all duration-300">
              <Image src="/assets/kenzi_logo.png" alt="Kenzi Market" width={200} height={200} className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-white font-extrabold text-xl tracking-tight leading-none block">Kenzi</span>
              <span className="text-[#f5c842] font-bold text-sm tracking-widest uppercase leading-none">Market</span>
            </div>
          </Link>

          {/* Liens nav - glassmorphism pill */}
          <div className="hidden lg:flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-2 py-1.5">
            {['Accueil', 'Catégories', 'Promotions', 'À propos', 'Contact'].map((item, i) => (
              <Link key={item} href={i === 0 ? '/' : i === 1 ? '/catalogue' : '#'}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  i === 0 ? 'bg-white/20 text-white shadow-sm' : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}>
                {item}
              </Link>
            ))}
          </div>

          {/* Boutons auth */}
          <div className="flex items-center gap-3">
            <Link href="/login"
              className="hidden md:block text-white/80 hover:text-white text-sm font-medium px-5 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 backdrop-blur-sm transition-all duration-200">
              Connexion
            </Link>
            <Link href="/register"
              className="text-gray-900 font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 active:scale-100"
              style={{ background: 'linear-gradient(135deg, #f5c842, #e6aa00)' }}>
              Inscription
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO - deux colonnes */}
      <main className="relative z-10 min-h-[calc(100vh-88px)] flex items-center">
        <div className="w-full max-w-8xl mx-auto px-6 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-8">

          {/* ─── COLONNE GAUCHE ─── */}
          <div className="space-y-7 max-w-xl">

            {/* Badge livraison rapide */}
            <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 shadow-lg">
              <span className="flex items-center justify-center w-5 h-5 bg-[#f5c842] rounded-full shrink-0">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1a5c2a" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
              <span className="text-white/90 text-sm font-semibold tracking-wide">Livraison rapide de produits frais</span>
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shrink-0" />
            </div>

            {/* Titre */}
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-white leading-[1.05] tracking-tight">
                Vos courses<br />
                livrées{' '}
                <span className="relative inline-block">
                  <span className="relative z-10" style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text', backgroundImage: 'linear-gradient(90deg, #f5c842, #ffd700)', backgroundClip: 'text' }}>
                    directement
                  </span>
                </span><br />
                <span className="text-white/90">chez vous.</span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-white/65 text-lg leading-relaxed">
              Des légumes frais, fruits de saison et produits du marché sélectionnés avec soin — livrés en <span className="text-white font-semibold">moins de 30 minutes</span> à votre porte.
            </p>

            {/* Barre de recherche */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 shadow-xl max-w-md">
              <div className="flex items-center gap-3 flex-1 px-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input
                  type="text"
                  placeholder="Tomates, pommes, pain..."
                  className="flex-1 bg-transparent text-white placeholder:text-white/40 text-sm outline-none"
                />
              </div>
              <Link href="/catalogue"
                className="text-gray-900 font-bold text-sm px-5 py-2.5 rounded-xl shadow transition-all hover:scale-105 whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #f5c842, #e6aa00)' }}>
                Rechercher
              </Link>
            </div>

            {/* Boutons CTA */}
            <div className="flex items-center gap-4 flex-wrap">
              <Link href="/catalogue"
                className="flex items-center gap-2 text-gray-900 font-bold text-sm px-7 py-3.5 rounded-2xl shadow-xl transition-all duration-200 hover:shadow-2xl hover:scale-105 active:scale-100"
                style={{ background: 'linear-gradient(135deg, #f5c842, #e6aa00)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                Commander maintenant
              </Link>
              <Link href="/catalogue"
                className="flex items-center gap-2 text-white font-semibold text-sm px-7 py-3.5 rounded-2xl border border-white/25 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Voir les catégories
              </Link>
            </div>

            {/* Stats glassmorphism */}
            <div className="flex items-center gap-4 flex-wrap pt-2">
              {[
                { value: '2 500+', label: 'Clients satisfaits' },
                { value: '30 min', label: 'Livraison express' },
                { value: '500+', label: 'Produits frais' },
              ].map(s => (
                <div key={s.value} className="bg-white/8 backdrop-blur-sm border border-white/12 rounded-2xl px-4 py-3 text-center min-w-[90px]">
                  <p className="text-white font-extrabold text-lg leading-none">{s.value}</p>
                  <p className="text-white/50 text-xs mt-1 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ─── COLONNE DROITE — image livreur ─── */}
          <div className="relative flex justify-center lg:justify-end items-end h-full min-h-[400px] lg:min-h-[560px]">

            {/* Halo vert derrière le livreur */}
            <div className="absolute bottom-0 right-0 w-[480px] h-[480px] rounded-full opacity-30 blur-3xl"
              style={{ background: 'radial-gradient(circle, #4ade80, transparent 70%)' }} />

            {/* Cercle décoratif animé */}
            <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full border border-white/10 animate-spin" style={{ animationDuration: '30s' }} />
            <div className="absolute bottom-16 right-16 w-56 h-56 rounded-full border border-white/8 animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }} />

            {/* Badge glassmorphism flottants */}
            <div className="absolute top-8 left-0 lg:left-4 bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="w-9 h-9 bg-green-400/20 rounded-xl flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div>
                <p className="text-white font-bold text-sm">Qualité garantie</p>
                <p className="text-white/50 text-xs">100% produits frais</p>
              </div>
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 right-0 bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3">
              <div className="w-9 h-9 bg-yellow-400/20 rounded-xl flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f5c842" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div>
                <p className="text-white font-bold text-sm">Livraison 30 min</p>
                <p className="text-white/50 text-xs">Partout en ville</p>
              </div>
            </div>

            <div className="absolute bottom-24 left-0 lg:left-4 bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-400/20 rounded-xl flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div>
                <p className="text-white font-bold text-sm">7j/7 disponible</p>
                <p className="text-white/50 text-xs">8h – 22h</p>
              </div>
            </div>

            {/* Image principale */}
            <Image
              src="/assets/kenzi_market_heropage.png"
              alt="Livreur Kenzi Market"
              width={640}
              height={560}
              priority
              className="relative z-10 object-contain object-bottom max-h-[520px] lg:max-h-[600px] w-auto drop-shadow-2xl"
            />
          </div>
        </div>
      </main>
    </div>
  )
}
