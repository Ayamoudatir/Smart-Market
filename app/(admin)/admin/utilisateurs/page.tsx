'use client'
import { useEffect, useState } from 'react'
import { getAllUsers, updateUserRole } from '@/lib/firestore'
import type { User, UserRole } from '@/types'
import PageHeader from '@/components/layout/PageHeader'

const ROLES: UserRole[] = ['admin', 'manager', 'preparateur', 'livreur', 'client']

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllUsers().then(u => { setUsers(u); setLoading(false) })
  }, [])

  async function handleRoleChange(uid: string, role: UserRole) {
    await updateUserRole(uid, role)
    setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role } : u))
  }

  if (loading) return <div className="flex items-center justify-center h-full text-gray-400">Chargement…</div>

  return (
    <div>
      <PageHeader title="Utilisateurs" sub={`${users.length} comptes enregistrés`} />
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-100">
              {['Utilisateur', 'Email', 'Téléphone', 'Rôle', 'Actions'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.uid} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold shrink-0">
                      {u.firstName?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{u.firstName} {u.lastName}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-gray-500">{u.email}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{u.phone ?? '—'}</td>
                <td className="px-5 py-4">
                  <span className="text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full capitalize">{u.role}</span>
                </td>
                <td className="px-5 py-4">
                  <select value={u.role} onChange={e => handleRoleChange(u.uid, e.target.value as UserRole)}
                    className="border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-600 outline-none focus:border-green-500 bg-white">
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>
    </div>
  )
}
