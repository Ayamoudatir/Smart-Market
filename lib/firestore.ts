import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, serverTimestamp, Timestamp, setDoc
} from 'firebase/firestore'
import { db } from './firebase'
import type { Product, Order, OrderStatus, InventoryMovement, ActivityLog, User } from '@/types'

// ─── Users ───────────────────────────────────────────────────────────────────
export async function getUser(uid: string): Promise<User | null> {
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) return null
  return { uid: snap.id, ...snap.data() } as User
}

export async function getAllUsers(): Promise<User[]> {
  const snap = await getDocs(collection(db, 'users'))
  return snap.docs.map(d => ({ uid: d.id, ...d.data() } as User))
}

export async function updateUserRole(uid: string, role: string) {
  await updateDoc(doc(db, 'users', uid), { role })
}

// ─── Products ─────────────────────────────────────────────────────────────────
export async function getProducts(): Promise<Product[]> {
  const snap = await getDocs(query(collection(db, 'products'), orderBy('name')))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product))
}

export async function getProduct(id: string): Promise<Product | null> {
  const snap = await getDoc(doc(db, 'products', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Product
}

export async function addProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
  return addDoc(collection(db, 'products'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateProduct(id: string, data: Partial<Product>) {
  await updateDoc(doc(db, 'products', id), { ...data, updatedAt: serverTimestamp() })
}

export async function deleteProduct(id: string) {
  await deleteDoc(doc(db, 'products', id))
}

// ─── Orders ───────────────────────────────────────────────────────────────────
export async function getOrders(status?: OrderStatus): Promise<Order[]> {
  const q = status
    ? query(collection(db, 'orders'), where('status', '==', status), orderBy('createdAt', 'desc'))
    : query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Order))
}

export async function getOrder(id: string): Promise<Order | null> {
  const snap = await getDoc(doc(db, 'orders', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Order
}

export async function getClientOrders(clientId: string): Promise<Order[]> {
  const q = query(collection(db, 'orders'), where('clientId', '==', clientId), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Order))
}

export async function updateOrderStatus(id: string, status: OrderStatus, extra?: Record<string, unknown>) {
  await updateDoc(doc(db, 'orders', id), { status, updatedAt: serverTimestamp(), ...extra })
}

export async function createOrder(data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) {
  return addDoc(collection(db, 'orders'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

// ─── Inventory movements ──────────────────────────────────────────────────────
export async function getInventoryMovements(limitN = 50): Promise<InventoryMovement[]> {
  const q = query(collection(db, 'inventory_movements'), orderBy('date', 'desc'), limit(limitN))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as InventoryMovement))
}

export async function addInventoryMovement(data: Omit<InventoryMovement, 'id'>) {
  return addDoc(collection(db, 'inventory_movements'), data)
}

// ─── Activity logs ────────────────────────────────────────────────────────────
export async function addLog(data: Omit<ActivityLog, 'id'>) {
  return addDoc(collection(db, 'activity_logs'), data)
}

export async function getLogs(limitN = 100): Promise<ActivityLog[]> {
  const q = query(collection(db, 'activity_logs'), orderBy('timestamp', 'desc'), limit(limitN))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ActivityLog))
}
