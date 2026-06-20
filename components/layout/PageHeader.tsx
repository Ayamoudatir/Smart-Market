type Props = {
  title: string
  sub?: string
  action?: React.ReactNode
}

export default function PageHeader({ title, sub, action }: Props) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1a5c2a]">{title}</h1>
        {sub && <p className="text-sm text-green-800/50 mt-1">{sub}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
