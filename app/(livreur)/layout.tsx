import Sidebar from '@/components/layout/Sidebar'

const NAV = [
  {
    label: 'Mes livraisons', href: '/livreur/dashboard',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
  },
]

export default function LivreurLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role="livreur" roleLabel="Livreur" items={NAV} />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-16 md:pt-8">{children}</main>
    </div>
  )
}
