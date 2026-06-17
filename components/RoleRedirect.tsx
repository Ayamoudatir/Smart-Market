'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

const ROLE_HOME: Record<string, string> = {
  admin: '/admin/dashboard',
  manager: '/manager/dashboard',
  preparateur: '/preparateur/dashboard',
  livreur: '/livreur/dashboard',
  client: '/catalogue',
}

export default function RoleRedirect() {
  const { user, role, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (user && role && ROLE_HOME[role]) {
      router.replace(ROLE_HOME[role])
    }
  }, [user, role, loading, router])

  return null
}
