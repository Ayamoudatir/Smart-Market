import Link from 'next/link'
import Image from 'next/image'

export default function PublicFooter() {
  return (
    <footer className="bg-[#0f3d1a]/90 backdrop-blur-md text-white mt-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">

        {/* Ligne principale */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

          {/* Logo + desc */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <Image src="/assets/kenzi_logo.png" alt="Kenzi Market" width={90} height={90} className="object-contain" />
            <div>
              <p className="font-extrabold text-lg tracking-tight">Kenzi Market</p>
              <p className="text-white/50 text-sm mt-1 leading-relaxed">Votre hanout de quartier, livré en 30 minutes.</p>
            </div>
            {/* Réseaux sociaux */}
            <div className="flex items-center gap-3 mt-2">
              {[
                <svg key="fb" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
                <svg key="ig" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
                <svg key="yt" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>,
              ].map((icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Catégories */}
          <div>
            <p className="font-bold text-sm mb-4 text-[#f5c842]">Catégories</p>
            <ul className="space-y-2 text-sm text-white/60">
              {['Légumes', 'Fruits', 'Viandes', 'Boulangerie', 'Laitiers', 'Épicerie', 'Fruits secs'].map(c => (
                <li key={c}><Link href={`/categorie/${c.toLowerCase().replace(' ', '-').replace('é', 'e').replace('è', 'e')}`} className="hover:text-white transition">{c}</Link></li>
              ))}
            </ul>
          </div>

          {/* Informations */}
          <div>
            <p className="font-bold text-sm mb-4 text-[#f5c842]">Informations</p>
            <ul className="space-y-2 text-sm text-white/60">
              {['À propos', 'Contact', 'FAQ', 'Politique de livraison', 'Mentions légales'].map(l => (
                <li key={l}><Link href="#" className="hover:text-white transition">{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Nos engagements */}
          <div>
            <p className="font-bold text-sm mb-4 text-[#f5c842]">Nos engagements</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Produits frais', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
                { label: 'Livraison 30 min', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> },
                { label: 'Satisfait ou remboursé', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="20 6 9 17 4 12"/></svg> },
                { label: 'Paiement sécurisé', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
              ].map((e, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 bg-white/5 rounded-xl p-3 text-center">
                  <span className="text-[#f5c842]">{e.icon}</span>
                  <span className="text-white/60 text-xs leading-tight">{e.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bas footer */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">© 2025 Kenzi Market — Tous droits réservés</p>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <Link href="/login" className="hover:text-white transition">Connexion</Link>
            <Link href="/register" className="hover:text-white transition">S'inscrire</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
