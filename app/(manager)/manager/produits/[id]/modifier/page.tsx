'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getProduct, updateProduct } from '@/lib/firestore'
import type { Product } from '@/types'
import PageHeader from '@/components/layout/PageHeader'
import ImageUploader from '@/components/manager/ImageUploader'

const CATEGORIES = ['Légumes', 'Fruits', 'Épicerie', 'Boulangerie', 'Fruits secs', 'Viandes', 'Poissons', 'Laitiers']
const UNITS = ['kg', 'g', 'L', 'botte', 'u', 'boîte']

function computeStatus(qty: number, threshold: number) {
  if (qty === 0) return 'rupture'
  if (qty <= threshold) return 'bas'
  return 'en_stock'
}

export default function ModifierProduit() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [form, setForm] = useState({
    name: '', categoryName: CATEGORIES[0], price: '',
    unit: UNITS[0], quantity: '', alertThreshold: '5', description: '',
  })
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getProduct(id).then(p => {
      if (!p) return
      setForm({
        name: p.name,
        categoryName: p.categoryName,
        price: String(p.price),
        unit: p.unit,
        quantity: String(p.quantity),
        alertThreshold: String(p.alertThreshold),
        description: p.description ?? '',
      })
      setImages(p.images ?? [])
      setLoading(false)
    })
  }, [id])

  function set(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [k]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const qty = Number(form.quantity)
      const threshold = Number(form.alertThreshold)
      await updateProduct(id, {
        name: form.name,
        categoryId: form.categoryName.toLowerCase().replace(/[éèê]/g, 'e').replace(/\s+/g, '_'),
        categoryName: form.categoryName,
        price: Number(form.price),
        unit: form.unit,
        quantity: qty,
        alertThreshold: threshold,
        images,
        description: form.description,
        status: computeStatus(qty, threshold),
      })
      router.push('/manager/produits')
    } catch {
      setError('Erreur lors de la mise à jour.')
      setSaving(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center h-full text-gray-400">Chargement…</div>

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Modifier le produit"
        sub={form.name}
        action={
          <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700">
            ← Retour
          </button>
        }
      />

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Photo du produit</label>
            <ImageUploader value={images} onChange={setImages} productName={form.name} />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom du produit</label>
            <input
              required value={form.name} onChange={set('name')}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Catégorie</label>
            <select value={form.categoryName} onChange={set('categoryName')}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-500 bg-white">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Unité</label>
            <select value={form.unit} onChange={set('unit')}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-500 bg-white">
              {UNITS.map(u => <option key={u}>{u}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Prix (dh)</label>
            <input
              required type="number" min="0" step="0.5"
              value={form.price} onChange={set('price')}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantité en stock</label>
            <input
              required type="number" min="0"
              value={form.quantity} onChange={set('quantity')}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Seuil d'alerte</label>
            <input
              type="number" min="0"
              value={form.alertThreshold} onChange={set('alertThreshold')}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              value={form.description} onChange={set('description')} rows={3}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 resize-none"
            />
          </div>
        </div>

        {/* Aperçu statut */}
        <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between text-sm">
          <span className="text-gray-500">Statut calculé automatiquement</span>
          <span className={`font-semibold px-2.5 py-1 rounded-full text-xs ${
            computeStatus(Number(form.quantity), Number(form.alertThreshold)) === 'en_stock'
              ? 'bg-green-100 text-green-700'
              : computeStatus(Number(form.quantity), Number(form.alertThreshold)) === 'bas'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {computeStatus(Number(form.quantity), Number(form.alertThreshold)) === 'en_stock' ? '● En stock'
              : computeStatus(Number(form.quantity), Number(form.alertThreshold)) === 'bas' ? '● Bas'
              : '● Rupture'}
          </span>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => router.back()}
            className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-xl hover:bg-gray-50 transition text-sm">
            Annuler
          </button>
          <button type="submit" disabled={saving}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition text-sm">
            {saving ? 'Enregistrement…' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </div>
  )
}
