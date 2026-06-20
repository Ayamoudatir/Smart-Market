'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function AiFloatingAgent() {
  const { user } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const firstName = user?.displayName?.split(' ')[0] ?? user?.email?.split('@')[0] ?? ''

  function handleAction() {
    if (!user) {
      router.push('/login?redirect=/panier')
    } else {
      router.push('/panier')
    }
  }

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9998, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>

      {/* Popup */}
      {open && (
        <div style={{
          background: '#fff',
          borderRadius: 20,
          boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
          padding: '20px 20px 16px',
          width: 260,
          border: '1px solid #e5f0e8',
          animation: 'fadeUp 0.2s ease',
        }}>
          <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }`}</style>

          {/* Avatar + nom */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#1a5c2a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#1a5c2a', margin: 0 }}>Assistant Kenzi</p>
              <p style={{ fontSize: 10, color: '#9ca3af', margin: 0 }}>IA · En ligne</p>
            </div>
            <button onClick={() => setOpen(false)} style={{ marginLeft: 'auto', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', padding: 2, lineHeight: 1 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* Message */}
          <div style={{ background: '#f0fdf4', borderRadius: 14, padding: '10px 14px', marginBottom: 14 }}>
            {user ? (
              <p style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: 1.5 }}>
                Bonjour <strong>{firstName}</strong> ! 👋<br />
                Passe ta commande par <strong>voix</strong> ou <strong>photo</strong> en un clic.
              </p>
            ) : (
              <p style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: 1.5 }}>
                Connecte-toi pour passer une commande par <strong>voix</strong> ou <strong>photo</strong>. 🛒
              </p>
            )}
          </div>

          {/* CTA */}
          <button onClick={handleAction} style={{
            width: '100%',
            background: '#1a5c2a',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            padding: '10px 0',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
            {user ? 'Commander par IA' : 'Se connecter'}
          </button>
        </div>
      )}

      {/* Bouton flottant */}
      <button onClick={() => setOpen(o => !o)} style={{
        width: 58,
        height: 58,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #1a5c2a, #22c55e)',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(26,92,42,0.45)',
        position: 'relative',
      }}>
        {/* Pulse rings */}
        <span style={{
          position: 'absolute', inset: -6, borderRadius: '50%',
          border: '2px solid rgba(34,197,94,0.4)',
          animation: 'ping 2s ease-in-out infinite',
        }} />
        <span style={{
          position: 'absolute', inset: -12, borderRadius: '50%',
          border: '2px solid rgba(34,197,94,0.2)',
          animation: 'ping 2s ease-in-out infinite 0.5s',
        }} />
        <style>{`@keyframes ping { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.15);opacity:0.6} }`}</style>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>

        {/* Badge IA */}
        <span style={{
          position: 'absolute', top: -4, right: -4,
          background: '#f5c842', color: '#1a1a1a',
          fontSize: 8, fontWeight: 800,
          padding: '2px 5px', borderRadius: 6,
          letterSpacing: 0.5,
        }}>IA</span>
      </button>

    </div>
  )
}
