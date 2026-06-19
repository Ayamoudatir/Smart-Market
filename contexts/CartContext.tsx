'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import type { Product } from '@/types'

type CartItem = { product: Product; quantity: number }
type CartContextValue = {
  items: CartItem[]
  addItem: (product: Product, qty?: number) => void
  removeItem: (productId: string) => void
  updateQty: (productId: string, qty: number) => void
  clearCart: () => void
  total: number
  totalItems: number
}

const CartContext = createContext<CartContextValue>({
  items: [], addItem: () => {}, removeItem: () => {}, updateQty: () => {}, clearCart: () => {}, total: 0, totalItems: 0
})

const STORAGE_KEY = 'kenzi_cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Charger le panier depuis localStorage au démarrage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setItems(JSON.parse(saved))
    } catch {}
    setHydrated(true)
  }, [])

  // Sauvegarder à chaque changement
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {}
  }, [items, hydrated])

  function addItem(product: Product, qty = 1) {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i)
      return [...prev, { product, quantity: qty }]
    })
  }

  function removeItem(productId: string) {
    setItems(prev => prev.filter(i => i.product.id !== productId))
  }

  function updateQty(productId: string, qty: number) {
    if (qty <= 0) return removeItem(productId)
    setItems(prev => prev.map(i => i.product.id === productId ? { ...i, quantity: qty } : i))
  }

  function clearCart() {
    setItems([])
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }

  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0)
  const totalItems = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, totalItems }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() { return useContext(CartContext) }
