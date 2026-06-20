'use client'
import { useState, useRef } from 'react'
import { useCart } from '@/contexts/CartContext'
import { getProducts } from '@/lib/firestore'

type Result = { name: string; status: 'added' | 'notfound' }

export default function AiCartInput() {
  const { addItem } = useCart()
  const [text, setText] = useState('')
  const [listening, setListening] = useState(false)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Result[]>([])
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  function startVoice() {
    const SpeechRecognition = window.SpeechRecognition || (window as unknown as { webkitSpeechRecognition: typeof SpeechRecognition }).webkitSpeechRecognition
    if (!SpeechRecognition) { alert('Votre navigateur ne supporte pas la reconnaissance vocale.'); return }

    const recognition = new SpeechRecognition()
    recognition.lang = 'fr-FR'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript
      setText(transcript)
    }
    recognition.onerror = () => setListening(false)

    recognitionRef.current = recognition
    recognition.start()
  }

  function stopVoice() {
    recognitionRef.current?.stop()
    setListening(false)
  }

  async function handleSubmit() {
    if (!text.trim()) return
    setLoading(true)
    setResults([])

    const products = await getProducts()
    const res = await fetch('/api/ai-cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, products: products.map(p => ({ name: p.name, unit: p.unit })) }),
    })
    const data = await res.json()
    const aiItems: { name: string; quantity: number }[] = data.items ?? []

    const resultList: Result[] = []

    for (const aiItem of aiItems) {
      const match = products.find(p =>
        p.name.toLowerCase().includes(aiItem.name.toLowerCase()) ||
        aiItem.name.toLowerCase().includes(p.name.toLowerCase())
      )
      if (match) {
        addItem(match, aiItem.quantity)
        resultList.push({ name: match.name, status: 'added' })
      } else {
        resultList.push({ name: aiItem.name, status: 'notfound' })
      }
    }

    setResults(resultList)
    setLoading(false)
    setText('')
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-green-100 p-4 mb-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-[#1a5c2a]/10 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a5c2a" strokeWidth="2.5"><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
        </div>
        <p className="text-sm font-bold text-[#1a5c2a]">Commande par voix ou texte</p>
        <span className="text-[10px] bg-[#f5c842] text-gray-800 font-bold px-2 py-0.5 rounded-full">IA</span>
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Ex: 2kg de tomates, 1 litre de lait, du pain..."
          className="flex-1 bg-green-50/60 border border-green-100 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-green-300 transition"
        />

        {/* Micro */}
        <button
          onClick={listening ? stopVoice : startVoice}
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition ${
            listening ? 'bg-red-500 text-white animate-pulse' : 'bg-green-100 text-[#1a5c2a] hover:bg-green-200'
          }`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
        </button>

        {/* Envoyer */}
        <button
          onClick={handleSubmit}
          disabled={loading || !text.trim()}
          className="px-4 h-10 bg-[#1a5c2a] hover:bg-green-800 disabled:opacity-40 text-white text-sm font-bold rounded-xl transition shrink-0"
        >
          {loading ? (
            <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          )}
        </button>
      </div>

      {/* Résultats */}
      {results.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {results.map((r, i) => (
            <div key={i} className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg ${
              r.status === 'added' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-500'
            }`}>
              {r.status === 'added' ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              )}
              {r.name} — {r.status === 'added' ? 'ajouté au panier' : 'introuvable dans le catalogue'}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
