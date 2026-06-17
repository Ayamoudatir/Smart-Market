type Props = { status: string }

const MAP: Record<string, { label: string; cls: string }> = {
  en_stock:       { label: 'En stock',     cls: 'bg-green-100 text-green-700' },
  bas:            { label: 'Bas',          cls: 'bg-yellow-100 text-yellow-700' },
  rupture:        { label: 'Rupture',      cls: 'bg-red-100 text-red-700' },
  en_attente:     { label: 'En attente',   cls: 'bg-gray-100 text-gray-700' },
  en_preparation: { label: 'En préparation', cls: 'bg-blue-100 text-blue-700' },
  prete:          { label: 'Prête',        cls: 'bg-green-100 text-green-700' },
  en_livraison:   { label: 'En livraison', cls: 'bg-orange-100 text-orange-700' },
  livree:         { label: 'Livrée',       cls: 'bg-green-200 text-green-800' },
  annulee:        { label: 'Annulée',      cls: 'bg-red-100 text-red-700' },
  assignee:       { label: 'Assignée',     cls: 'bg-blue-100 text-blue-700' },
  en_cours:       { label: 'En cours',     cls: 'bg-orange-100 text-orange-700' },
}

export default function StatusBadge({ status }: Props) {
  const s = MAP[status] ?? { label: status, cls: 'bg-gray-100 text-gray-700' }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {s.label}
    </span>
  )
}
