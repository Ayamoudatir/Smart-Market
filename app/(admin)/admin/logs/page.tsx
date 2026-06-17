'use client'
import { useEffect, useState } from 'react'
import { getLogs } from '@/lib/firestore'
import type { ActivityLog } from '@/types'
import PageHeader from '@/components/layout/PageHeader'

export default function AdminLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLogs().then(l => { setLogs(l); setLoading(false) })
  }, [])

  if (loading) return <div className="flex items-center justify-center h-full text-gray-400">Chargement…</div>

  return (
    <div>
      <PageHeader title="Journaux d'activité" sub="Toutes les actions enregistrées" />
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-100">
              {['Utilisateur', 'Action', 'Cible', 'Date'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="px-5 py-3.5 text-sm font-medium text-gray-800">{l.userName}</td>
                <td className="px-5 py-3.5 text-sm text-gray-600">{l.action}</td>
                <td className="px-5 py-3.5 text-sm text-gray-500">{l.target}</td>
                <td className="px-5 py-3.5 text-xs text-gray-400">{l.timestamp ? new Date((l.timestamp as unknown as { seconds: number }).seconds * 1000).toLocaleString('fr-MA') : '—'}</td>
              </tr>
            ))}
            {logs.length === 0 && <tr><td colSpan={4} className="px-5 py-10 text-center text-sm text-gray-400">Aucun log</td></tr>}
          </tbody>
        </table></div>
      </div>
    </div>
  )
}
