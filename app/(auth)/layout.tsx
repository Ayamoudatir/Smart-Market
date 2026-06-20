import Image from 'next/image'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4">
      <Image
        src="/assets/kenzi_market_heropage.png"
        alt=""
        fill
        priority
        className="object-cover object-center"
        style={{ filter: 'blur(2px)', transform: 'scale(1.05)' }}
      />
      <div className="absolute inset-0 bg-black/55" />
      {children}
    </div>
  )
}
