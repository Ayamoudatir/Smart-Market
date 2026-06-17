export type UserRole = 'admin' | 'manager' | 'preparateur' | 'livreur' | 'client'

export type User = {
  uid: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  role: UserRole
  createdAt: Date
}

export type Category = {
  id: string
  name: string
  slug: string
  icon: string
}

export type ProductStatus = 'en_stock' | 'bas' | 'rupture'

export type Product = {
  id: string
  name: string
  categoryId: string
  categoryName: string
  price: number
  unit: string
  quantity: number
  alertThreshold: number
  images: string[]
  status: ProductStatus
  description?: string
  createdAt: Date
  updatedAt: Date
}

export type OrderStatus = 'en_attente' | 'en_preparation' | 'prete' | 'en_livraison' | 'livree' | 'annulee'

export type OrderItem = {
  productId: string
  name: string
  quantity: number
  unit: string
  price: number
  image?: string
}

export type Order = {
  id: string
  clientId: string
  clientName: string
  clientPhone?: string
  clientAddress: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  preparedBy?: string
  deliveredBy?: string
  createdAt: Date
  updatedAt: Date
}

export type InventoryMovement = {
  id: string
  productId: string
  productName: string
  type: 'in' | 'out'
  quantity: number
  reason: string
  by: string
  date: Date
}

export type Delivery = {
  id: string
  orderId: string
  deliveryPersonId: string
  status: 'assignee' | 'en_cours' | 'livree'
  address: string
  assignedAt: Date
  deliveredAt?: Date
}

export type ActivityLog = {
  id: string
  userId: string
  userName: string
  action: string
  target: string
  metadata?: Record<string, unknown>
  timestamp: Date
}
