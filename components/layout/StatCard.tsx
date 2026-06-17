type Props = {
  label: string
  value: string | number
  sub?: string
  color?: 'green' | 'yellow' | 'red' | 'blue' | 'gray'
  icon?: React.ReactNode
}

const colors = {
  green: 'bg-green-50 border-green-200 text-green-700',
  yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  red: 'bg-red-50 border-red-200 text-red-700',
  blue: 'bg-blue-50 border-blue-200 text-blue-700',
  gray: 'bg-gray-50 border-gray-200 text-gray-700',
}

export default function StatCard({ label, value, sub, color = 'gray', icon }: Props) {
  return (
    <div className={`rounded-2xl border p-5 ${colors[color]}`}>
      {icon && <div className="mb-3 opacity-70">{icon}</div>}
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm font-medium mt-1">{label}</p>
      {sub && <p className="text-xs opacity-60 mt-1">{sub}</p>}
    </div>
  )
}
