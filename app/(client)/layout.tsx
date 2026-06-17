'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { logoutUser } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const { totalItems } = useCart()
  const router = useRouter()

  async function handleLogout() {
    document.cookie = 'userRole=; max-age=0; path=/'
    await logoutUser()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/catalogue" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center overflow-hidden p-1">
              <Image src="/assets/kenzi_logo.png" alt="" width={1536} height={1024} className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-gray-900">Kenzi Market</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link href="/catalogue" className="text-sm text-gray-600 hover:text-gray-900">Catalogue</Link>
            <Link href="/commandes" className="text-sm text-gray-600 hover:text-gray-900">Mes commandes</Link>
            <Link href="/panier" className="relative">
              <span className="text-sm font-medium text-gray-700">Panier</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-3 bg-green-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{totalItems}</span>
              )}
            </Link>
            {user && (
              <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-gray-600">Déconnexion</button>
            )}
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
