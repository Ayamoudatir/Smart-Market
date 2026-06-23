'use client'
import { useState, useRef, useCallback } from 'react'
import { useCart } from '@/contexts/CartContext'
import { getProducts } from '@/lib/firestore'
import type { Product } from '@/types'

type Result = { name: string; status: 'added' | 'notfound' }

function findMatch(products: Product[], name: string): Product | undefined {
  const q = name.toLowerCase().replace(/s$/, '').slice(0, 5)
  return products.find(p => {
    const pn = p.name.toLowerCase().replace(/s$/, '')
    return pn.includes(q) || q.includes(pn.slice(0, 5)) || pn.slice(0, 4) === q.slice(0, 4)
  })
}

async function processItems(
  aiItems: { name: string; quantity: number }[],
  products: Product[],
  addItem: (p: Product, qty: number) => void
): Promise<Result[]> {
  const results: Result[] = []
  for (const aiItem of aiItems) {
    const match = findMatch(products, aiItem.name)
    if (match) {
      addItem(match, aiItem.quantity || 1)
      results.push({ name: match.name, status: 'added' })
    } else {
      results.push({ name: aiItem.name, status: 'notfound' })
    }
  }
  return results
}

export default function AiCartInput() {
  const { addItem } = useCart()
  const [text, setText] = useState('')
  const [listening, setListening] = useState(false)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [results, setResults] = useState<Result[]>([])
  const [cameraOpen, setCameraOpen] = useState(false)
  const recognitionRef = useRef<{ stop: () => void } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  function startVoice() {
    type SRConstructor = new () => {
      lang: string; continuous: boolean; interimResults: boolean
      onstart: (() => void) | null; onend: (() => void) | null
      onerror: (() => void) | null
      onresult: ((e: { results: { [key: number]: { transcript: string } }[] }) => void) | null
      start: () => void; stop: () => void
    }
    const w = window as unknown as { SpeechRecognition?: SRConstructor; webkitSpeechRecognition?: SRConstructor }
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition
    if (!SR) { alert('Votre navigateur ne supporte pas la reconnaissance vocale.'); return }
    const r = new SR()
    r.lang = 'fr-FR'
    r.continuous = false
    r.interimResults = false
    r.onstart = () => setListening(true)
    r.onend = () => setListening(false)
    r.onresult = (e) => setText((e.results[0] as { [key: number]: { transcript: string } })[0].transcript)
    r.onerror = () => setListening(false)
    recognitionRef.current = r
    r.start()
  }

  function stopVoice() {
    recognitionRef.current?.stop()
    setListening(false)
  }

  const openCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      setCameraOpen(true)
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
        }
      }, 100)
    } catch {
      alert('Impossible d\'accéder à la caméra.')
    }
  }, [])

  function closeCamera() {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setCameraOpen(false)
  }

  function capturePhoto() {
    if (!videoRef.current) return
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
    const base64 = dataUrl.split(',')[1]
    setPreview(dataUrl)
    closeCamera()
    submitImage(base64)
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1]
      setPreview(reader.result as string)
      submitImage(base64)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  async function submitImage(base64: string) {
    setLoading(true)
    setResults([])
    try {
      const products = await getProducts()
      const res = await fetch('/api/ai-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64 }),
      })
      const data = await res.json()
      const aiItems: { name: string; quantity: number }[] = data.items ?? []
      const resultList = await processItems(aiItems, products, addItem)
      setResults(resultList)
    } catch (err) {
      console.error(err)
      setResults([{ name: 'Erreur lors de la lecture de l\'image', status: 'notfound' }])
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit() {
    if (!text.trim()) return
    setLoading(true)
    setResults([])
    setPreview(null)
    try {
      const products = await getProducts()
      const res = await fetch('/api/ai-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      const data = await res.json()
      const aiItems: { name: string; quantity: number }[] = data.items ?? []
      const resultList = await processItems(aiItems, products, addItem)
      setResults(resultList)
      setText('')
    } catch (err) {
      console.error(err)
      setResults([{ name: 'Erreur de connexion', status: 'notfound' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Modal caméra */}
      {cameraOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#000', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(0,0,0,0.8)', flexShrink: 0 }}>
            <p style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>Prendre une photo</p>
            <button onClick={closeCamera} style={{ color: 'rgba(255,255,255,0.7)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          {/* Vidéo */}
          <video ref={videoRef} style={{ flex: 1, width: '100%', objectFit: 'cover', display: 'block' }} autoPlay playsInline muted />
          {/* Bouton capture */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px 0', background: 'rgba(0,0,0,0.8)', flexShrink: 0 }}>
            <button onClick={capturePhoto}
              style={{ width: 72, height: 72, borderRadius: '50%', background: '#fff', border: '5px solid #1a5c2a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#1a5c2a' }} />
            </button>
          </div>
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-green-100 p-4 mb-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-[#1a5c2a]/10 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a5c2a" strokeWidth="2.5"><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
          </div>
          <p className="text-sm font-bold text-[#1a5c2a]">Commande par voix, texte ou photo</p>
          <span className="text-[10px] bg-[#f5c842] text-gray-800 font-bold px-2 py-0.5 rounded-full">IA</span>
        </div>

        {/* Texte + voix + envoyer */}
        <div className="flex gap-2 mb-2">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="Ex: 2kg de tomates, 1 litre de lait..."
            className="flex-1 bg-green-50/60 border border-green-100 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-green-300 transition"
          />
          <button onClick={listening ? stopVoice : startVoice}
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition ${listening ? 'bg-red-500 text-white animate-pulse' : 'bg-green-100 text-[#1a5c2a] hover:bg-green-200'}`}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
          </button>
          <button onClick={handleSubmit} disabled={loading || !text.trim()}
            className="w-10 h-10 bg-[#1a5c2a] hover:bg-green-800 disabled:opacity-40 text-white rounded-xl flex items-center justify-center shrink-0 transition">
            {loading && !preview
              ? <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            }
          </button>
        </div>

        {/* Boutons photo */}
        <div className="flex gap-2">
          <button onClick={openCamera} disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border border-green-100 bg-green-50/60 text-green-700 text-xs font-semibold hover:bg-green-100 disabled:opacity-40 transition">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            Prendre une photo
          </button>

          <button onClick={() => fileRef.current?.click()} disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border border-green-100 bg-green-50/60 text-green-700 text-xs font-semibold hover:bg-green-100 disabled:opacity-40 transition">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Uploader une image
          </button>

          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>

        {/* Preview image */}
        {preview && (
          <div className="mt-3 relative">
            <img src={preview} alt="preview" className="w-full max-h-40 object-cover rounded-xl border border-green-100" />
            {!loading && (
              <button onClick={() => { setPreview(null); setResults([]) }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            )}
            {loading && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-sm rounded-xl flex items-center justify-center gap-2">
                <div className="w-5 h-5 rounded-full border-2 border-[#1a5c2a] border-t-transparent animate-spin" />
                <p className="text-sm font-semibold text-[#1a5c2a]">Analyse en cours…</p>
              </div>
            )}
          </div>
        )}

        {/* Résultats */}
        {results.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {results.map((r, i) => (
              <div key={i} className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg ${r.status === 'added' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-500'}`}>
                {r.status === 'added'
                  ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                }
                {r.name} — {r.status === 'added' ? 'ajouté au panier' : 'introuvable dans le catalogue'}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
