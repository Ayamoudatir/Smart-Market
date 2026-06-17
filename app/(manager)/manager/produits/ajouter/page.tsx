'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addProduct } from '@/lib/firestore'
import PageHeader from '@/components/layout/PageHeader'
import ImageUploader from '@/components/manager/ImageUploader'

const CATEGORIES = ['Légumes', 'Fruits', 'Épicerie', 'Boulangerie', 'Fruits secs', 'Viandes', 'Poissons', 'Laitiers']
const UNITS = ['kg', 'g', 'L', 'botte', 'u', 'boîte']

export default function AjouterProduit() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', categoryName: CATEGORIES[0], price: '', unit: UNITS[0], quantity: '', alertThreshold: '5', description: '' })
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [k]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const qty = Number(form.quantity)
      const threshold = Number(form.alertThreshold)
      await addProduct({
        name: form.name,
        categoryId: form.categoryName.toLowerCase().replace(/[éèê]/g, 'e').replace(/\s+/g, '_'),
        categoryName: form.categoryName,
        price: Number(form.price),
        unit: form.unit,
        quantity: qty,
        alertThreshold: threshold,
        images,
        status: qty === 0 ? 'rupture' : qty <= threshold ? 'bas' : 'en_stock',
        description: form.description,
      })
      router.push('/manager/produits')
    } catch {
      setError("Erreur lors de l'ajout du produit.")
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <PageHeader title="Ajouter un produit" sub="Renseignez les informations du produit" />
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">

          {/* Image */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Photo du produit</label>
            <ImageUploader value={images} onChange={setImages} productName={form.name} />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom du produit</label>
            <input required value={form.name} onChange={set('name')} placeholder="Tomates fraîches"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
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
            <input required type="number" min="0" step="0.5" value={form.price} onChange={set('price')} placeholder="8"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantité en stock</label>
            <input required type="number" min="0" value={form.quantity} onChange={set('quantity')} placeholder="24"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Seuil d'alerte</label>
            <input type="number" min="0" value={form.alertThreshold} onChange={set('alertThreshold')}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea value={form.description} onChange={set('description')} rows={3} placeholder="Brève description du produit…"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 resize-none" />
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => router.back()}
            className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-xl hover:bg-gray-50 transition text-sm">
            Annuler
          </button>
          <button type="submit" disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition text-sm">
            {loading ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  )
}
