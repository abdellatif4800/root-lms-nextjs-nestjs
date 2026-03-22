import React from "react";

export function InputField({ type = "text", name, placeholder, value, onChange, className = "" }: any) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className} text-ink`}>
      <label className="text-[10px] uppercase font-black tracking-widest pl-1 opacity-70">
        {placeholder}
      </label>
      <div className="relative group">
        {type === 'textarea' ? (
          <textarea
            name={name}
            placeholder={`ENTER_${placeholder.toUpperCase()}...`}
            value={value}
            onChange={onChange}
            rows={4}
            className="
            w-full bg-background border-2 border-ink text-ink text-sm font-bold p-3
            focus:outline-none focus:ring-2 focus:ring-teal-primary/20
            placeholder:text-dust/40 transition-all duration-300 resize-none leading-relaxed
          "
          />
        ) : (
          <input
            type={type}
            name={name}
            placeholder={`ENTER_${placeholder.toUpperCase()}...`}
            value={value}
            onChange={onChange}
            className="
            w-full bg-background border-2 border-ink text-ink text-sm font-bold p-3
            focus:outline-none focus:ring-2 focus:ring-teal-primary/20
            placeholder:text-dust/40 transition-all duration-300
          "
          />
        )}
        {/* Drafting Corner Accent */}
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-ink opacity-20 group-focus-within:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-ink opacity-20 group-focus-within:opacity-100 transition-opacity" />
      </div>
    </div>
  )
}
