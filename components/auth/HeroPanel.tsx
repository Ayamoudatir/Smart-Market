import Image from "next/image";

type Props = {
  title: string;
  subtitle: string;
  features: string[];
};

export default function HeroPanel({ title, subtitle, features }: Props) {
  return (
    <div className="hidden md:flex flex-col justify-between w-[45%] shrink-0 p-12 relative overflow-hidden">
      {/* Image de fond avec flou */}
      <Image
        src="/assets/kenzi_market_heropage.png"
        alt=""
        fill
        priority
        className="object-cover object-center scale-105"
        style={{ filter: 'blur(3px)' }}
      />
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/55 z-0" />

      {/* Logo seul, agrandi */}
      <div className="relative z-10">
        <Image
          src="/assets/kenzi_logo.png"
          alt="Kenzi Market"
          width={110}
          height={110}
          className="object-contain drop-shadow-xl"
        />
      </div>

      <div className="relative z-10 space-y-5">
        <h1 className="text-white text-4xl font-bold leading-tight">{title}</h1>
        <p className="text-white/70 text-base leading-relaxed">{subtitle}</p>
        <ul className="space-y-3 mt-2">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-3 text-white text-sm">
              <span className="w-6 h-6 rounded-full bg-[#f5c842] flex items-center justify-center shrink-0">
                <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                  <path d="M1 4.5l3 3L10 1" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
