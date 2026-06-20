'use client'
import { useEffect, useState } from 'react'
import { getAllUsers, updateUserRole } from '@/lib/firestore'
import { useAuth } from '@/contexts/AuthContext'
import type { User, UserRole } from '@/types'
import PageHeader from '@/components/layout/PageHeader'

const ROLES: UserRole[] = ['client', 'preparateur', 'livreur', 'manager', 'admin']

const ROLE_CONFIG: Record<UserRole, { label: string; color: string }> = {
  client:      { label: 'Client',      color: 'bg-gray-100 text-gray-600' },
  preparateur: { label: 'Préparateur', color: 'bg-blue-100 text-blue-700' },
  livreur:     { label: 'Livreur',     color: 'bg-orange-100 text-orange-700' },
  manager:     { label: 'Manager',     color: 'bg-purple-100 text-purple-700' },
  admin:       { label: 'Admin',       color: 'bg-red-100 text-red-700' },
}

export default function AdminUsers() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all')
  const [saving, setSaving] = useState<string | null>(null)
  const [changed, setChanged] = useState<string | null>(null)

  useEffect(() => {
    getAllUsers().then(u => { setUsers(u); setLoading(false) })
  }, [])

  async function handleRoleChange(uid: string, newRole: UserRole, currentRole: UserRole) {
    if (newRole === currentRole) return
    if (uid === currentUser?.uid) {
      alert("Vous ne pouvez pas modifier votre propre rôle.")
      return
    }
    setSaving(uid)
    await updateUserRole(uid, newRole)
    setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role: newRole } : u))
    setSaving(null)
    setChanged(uid)
    setTimeout(() => setChanged(null), 2000)
  }

  const filtered = users.filter(u => {
    const matchSearch = !search ||
      `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    const matchRole = filterRole === 'all' || u.role === filterRole
    return matchSearch && matchRole
  })

  if (loading) return <div className="flex items-center justify-center py-20 text-green-800/40">Chargement…</div>

  return (
    <div>
      <PageHeader title="Utilisateurs" sub={`${users.length} comptes enregistrés`} />

      {/* Stats par rôle */}
      <div className="flex gap-3 flex-wrap mb-6">
        {(['all', ...ROLES] as const).map(r => {
          const count = r === 'all' ? users.length : users.filter(u => u.role === r).length
          const cfg = r === 'all' ? null : ROLE_CONFIG[r]
          return (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition border ${
                filterRole === r
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-600 border-green-100 hover:bg-green-50/50'
              }`}
            >
              {r === 'all' ? 'Tous' : cfg!.label}
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                filterRole === r ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-green-100 rounded-xl px-4 py-2.5 mb-4 max-w-sm">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-800/40"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un utilisateur…"
          className="flex-1 outline-none text-sm text-gray-700 placeholder:text-green-800/40"
        />
      </div>

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-green-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-green-100">
                <th className="text-left text-xs font-semibold text-green-800/40 uppercase tracking-wide px-5 py-3">Utilisateur</th>
                <th className="text-left text-xs font-semibold text-green-800/40 uppercase tracking-wide px-5 py-3">Email</th>
                <th className="text-left text-xs font-semibold text-green-800/40 uppercase tracking-wide px-5 py-3">Rôle actuel</th>
                <th className="text-left text-xs font-semibold text-green-800/40 uppercase tracking-wide px-5 py-3">Changer le rôle</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const isSelf = u.uid === currentUser?.uid
                const isChanged = changed === u.uid
                const isSaving = saving === u.uid
                const cfg = ROLE_CONFIG[u.role] ?? { label: u.role ?? 'Inconnu', color: 'bg-gray-100 text-gray-500' }
                return (
                  <tr key={u.uid} className={`border-b border-gray-50 transition ${isChanged ? 'bg-green-50' : 'hover:bg-green-50/50'}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold shrink-0">
                          {u.firstName?.[0]?.toUpperCase() ?? u.email?.[0]?.toUpperCase() ?? 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {u.firstName} {u.lastName}
                            {isSelf && <span className="ml-2 text-xs text-green-800/40">(vous)</span>}
                          </p>
                          {u.phone && <p className="text-xs text-green-800/40">{u.phone}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">{u.email}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {isSaving ? (
                        <span className="text-xs text-green-800/40">Enregistrement…</span>
                      ) : isChanged ? (
                        <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                          Mis à jour
                        </span>
                      ) : (
                        <select
                          value={u.role}
                          disabled={isSelf}
                          onChange={e => handleRoleChange(u.uid, e.target.value as UserRole, u.role)}
                          className="border border-green-100 rounded-xl px-3 py-1.5 text-xs text-gray-700 outline-none focus:border-green-500 bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {ROLES.map(r => (
                            <option key={r} value={r}>{ROLE_CONFIG[r].label}</option>
                          ))}
                        </select>
                      )}
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-10 text-center text-sm text-green-800/40">Aucun utilisateur trouvé</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
