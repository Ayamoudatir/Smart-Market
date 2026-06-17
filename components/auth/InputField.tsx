"use client";

import { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode;
};

export default function InputField({ icon, className, ...props }: Props) {
  return (
    <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-3 bg-white focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition">
      {icon && <span className="text-green-500 shrink-0">{icon}</span>}
      <input
        className="flex-1 outline-none text-sm text-gray-800 placeholder:text-gray-400 bg-transparent"
        {...props}
      />
    </div>
  );
}
