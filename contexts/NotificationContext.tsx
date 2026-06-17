'use client'

import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { subscribeOrders } from '@/lib/firestore'
import type { Order, OrderStatus } from '@/types'

export type Toast = {
  id: string
  message: string
  type: 'info' | 'success' | 'warning'
}

type NotificationContextType = {
  unreadOrders: number
  unreadDeliveries: number
  toasts: Toast[]
  dismissToast: (id: string) => void
  markOrdersRead: () => void
  markDeliveriesRead: () => void
}

const Ctx = createContext<NotificationContextType>({
  unreadOrders: 0,
  unreadDeliveries: 0,
  toasts: [],
  dismissToast: () => {},
  markOrdersRead: () => {},
  markDeliveriesRead: () => {},
})

export function useNotifications() { return useContext(Ctx) }

const STATUS_LABEL: Record<OrderStatus, string> = {
  en_attente: 'En attente',
  en_preparation: 'En préparation',
  prete: 'Prête',
  en_livraison: 'En livraison',
  livree: 'Livrée',
  annulee: 'Annulée',
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { role, loading } = useAuth()

  const [toasts, setToasts] = useState<Toast[]>([])
  const [unreadOrders, setUnreadOrders] = useState(0)
  const [unreadDeliveries, setUnreadDeliveries] = useState(0)

  const knownOrders = useRef<Map<string, OrderStatus>>(new Map())
  const isFirstSnapshot = useRef(true)
  // On capture le role dans un ref pour l'utiliser dans le callback sans le mettre en dépendance
  const roleRef = useRef(role)
  useEffect(() => { roleRef.current = role }, [role])

  const addToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev.slice(-3), { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000)
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const markOrdersRead = useCallback(() => setUnreadOrders(0), [])
  const markDeliveriesRead = useCallback(() => setUnreadDeliveries(0), [])

  useEffect(() => {
    if (loading || !role || role === 'client') return

    // Reset à chaque changement de role
    knownOrders.current = new Map()
    isFirstSnapshot.current = true

    const unsub = subscribeOrders((orders: Order[]) => {
      const r = roleRef.current

      if (isFirstSnapshot.current) {
        // Premier appel : mémoriser l'état existant sans notifier
        orders.forEach(o => knownOrders.current.set(o.id, o.status))
        isFirstSnapshot.current = false
        return
      }

      let newOrderCount = 0
      let newDeliveryCount = 0

      orders.forEach(o => {
        const prev = knownOrders.current.get(o.id)

        if (prev === undefined) {
          // Toute nouvelle commande
          knownOrders.current.set(o.id, o.status)

          if (r === 'manager' || r === 'admin') {
            newOrderCount++
            addToast(`Nouvelle commande #${o.id.slice(-6).toUpperCase()} — ${o.total} dh`, 'info')
          }
          if (r === 'preparateur') {
            // Le préparateur voit les nouvelles commandes en_attente
            newOrderCount++
            addToast(`Nouvelle commande #${o.id.slice(-6).toUpperCase()} à préparer`, 'warning')
          }
        } else if (prev !== o.status) {
          // Changement de statut
          knownOrders.current.set(o.id, o.status)

          if (r === 'livreur' && o.status === 'prete') {
            newDeliveryCount++
            addToast(`Commande #${o.id.slice(-6).toUpperCase()} prête à livrer !`, 'success')
          }
          if (r === 'manager' || r === 'admin') {
            addToast(`Commande #${o.id.slice(-6).toUpperCase()} → ${STATUS_LABEL[o.status]}`, 'info')
          }
          if (r === 'preparateur' && o.status === 'en_preparation') {
            newOrderCount++
            addToast(`Commande #${o.id.slice(-6).toUpperCase()} en préparation`, 'warning')
          }
        }
      })

      if (newOrderCount > 0) setUnreadOrders(prev => prev + newOrderCount)
      if (newDeliveryCount > 0) setUnreadDeliveries(prev => prev + newDeliveryCount)
    })

    return unsub
  }, [role, loading, addToast])

  return (
    <Ctx.Provider value={{ unreadOrders, unreadDeliveries, toasts, dismissToast, markOrdersRead, markDeliveriesRead }}>
      {children}
    </Ctx.Provider>
  )
}
