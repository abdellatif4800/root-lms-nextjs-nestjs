import React from "react";

export function AuthInput({
  label,
  type,
  placeholder,
  value,
  onChange
}: {
  label: string,
  type: string,
  placeholder: string,
  value: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="flex flex-col gap-1.5 mb-5 text-ink">
      <label className="text-[10px] uppercase font-black tracking-widest pl-1 opacity-70">{label}</label>
      <div className="relative group">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="
          w-full bg-background border-2 border-ink text-ink text-sm font-bold p-3
          focus:outline-none focus:ring-2 focus:ring-teal-primary/20
          placeholder:text-dust/40 transition-all duration-300
        "
        />
        {/* Simple Drafting Corner */}
        <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t-2 border-r-2 border-ink opacity-20 group-focus-within:opacity-100 transition-opacity" />
      </div>
    </div>
  )
}
