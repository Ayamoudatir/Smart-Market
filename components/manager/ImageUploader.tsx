'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { uploadProductImage } from '@/lib/storage'

type Props = {
  value: string[]
  onChange: (urls: string[]) => void
  productName: string
}

export default function ImageUploader({ value, onChange, productName }: Props) {
  const [progress, setProgress] = useState<number | null>(null)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('Fichier non supporté.'); return }
    if (file.size > 5 * 1024 * 1024) { setError('Image trop lourde (max 5 Mo).'); return }

    setError('')
    setProgress(0)
    try {
      const url = await uploadProductImage(file, productName || 'produit', pct => setProgress(pct))
      onChange([url]) // on garde 1 image principale
    } catch {
      setError("Erreur lors de l'upload.")
    } finally {
      setProgress(null)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  function handleRemove() {
    onChange([])
  }

  const preview = value[0]

  return (
    <div className="space-y-3">
      {/* Preview */}
      {preview ? (
        <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200 group">
          <Image src={preview} alt="Aperçu" fill className="object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      ) : (
        /* Drop zone */
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-green-500 hover:bg-green-50 transition group"
        >
          {progress !== null ? (
            <div className="w-full px-8 space-y-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Upload en cours…</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-green-100 flex items-center justify-center transition">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400 group-hover:text-green-600">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <p className="text-sm text-gray-500 group-hover:text-green-700">Cliquer pour uploader une photo</p>
              <p className="text-xs text-gray-400">JPG, PNG, WebP — max 5 Mo</p>
            </>
          )}
        </button>
      )}

      {/* Bouton changer si image déjà présente */}
      {preview && progress === null && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Changer la photo
        </button>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  )
}
