import Image from "next/image";

type Props = {
  title: string;
  subtitle: string;
  features: string[];
};

export default function HeroPanel({ title, subtitle, features }: Props) {
  return (
    <div className="hidden md:flex flex-col justify-between w-[45%] shrink-0 p-12 bg-green-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/40 z-0" />

      <div className="relative z-10 flex items-center gap-3">
        <Image
          src="/assets/kenzi_logo.png"
          alt="Kenzi Market"
          width={48}
          height={32}
          className="object-contain"
        />
        <span className="text-white font-bold text-xl">Kenzi Market</span>
      </div>

      <div className="relative z-10 space-y-5">
        <h1 className="text-white text-4xl font-bold leading-tight">{title}</h1>
        <p className="text-green-100 text-base leading-relaxed">{subtitle}</p>
        <ul className="space-y-3 mt-2">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-3 text-white text-sm">
              <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                  <path d="M1 4.5l3 3L10 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
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
