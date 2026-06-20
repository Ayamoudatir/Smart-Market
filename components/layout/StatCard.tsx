type Props = {
  label: string
  value: string | number
  sub?: string
  color?: 'green' | 'yellow' | 'red' | 'blue' | 'gray'
  icon?: React.ReactNode
}

const palette = {
  green:  { glow: '#1a5c2a', accent: '#1a5c2a', iconBg: '#dcfce7', iconText: '#15803d', bar: '#22c55e' },
  yellow: { glow: '#ca8a04', accent: '#ca8a04', iconBg: '#fef9c3', iconText: '#a16207', bar: '#eab308' },
  red:    { glow: '#dc2626', accent: '#dc2626', iconBg: '#fee2e2', iconText: '#dc2626', bar: '#ef4444' },
  blue:   { glow: '#1d4ed8', accent: '#1d4ed8', iconBg: '#dbeafe', iconText: '#1d4ed8', bar: '#3b82f6' },
  gray:   { glow: '#374151', accent: '#374151', iconBg: '#f3f4f6', iconText: '#374151', bar: '#6b7280' },
}

export default function StatCard({ label, value, sub, color = 'gray', icon }: Props) {
  const p = palette[color]
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white shadow-sm group">
      {/* Glow blob */}
      <div
        className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-10 blur-2xl pointer-events-none transition-opacity group-hover:opacity-20"
        style={{ background: p.glow }}
      />

      {/* Left accent bar */}
      <div className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full" style={{ background: p.bar }} />

      <div className="px-5 pt-4 pb-5 pl-6">
        {/* Top row */}
        <div className="flex items-start justify-between mb-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
          {icon && (
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: p.iconBg, color: p.iconText }}>
              {icon}
            </div>
          )}
        </div>

        {/* Value */}
        <p className="text-4xl font-black tracking-tight leading-none" style={{ color: p.accent }}>
          {value}
        </p>

        {/* Sub */}
        {sub && <p className="text-xs text-gray-400 mt-2 font-medium">{sub}</p>}
      </div>

      {/* Bottom shimmer line */}
      <div className="absolute bottom-0 left-6 right-0 h-px opacity-30" style={{ background: `linear-gradient(to right, ${p.bar}, transparent)` }} />
    </div>
  )
}
