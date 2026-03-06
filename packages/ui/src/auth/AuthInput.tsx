export function AuthInput({ label, type, placeholder }: { label: string, type: string, placeholder: string }) {
  return (
    <div className="flex flex-col gap-1 mb-4">
      <label className="text-[10px] uppercase font-bold text-text-secondary tracking-wider pl-1">{label}</label>
      <div className="relative group">
        <input
          type={type}
          placeholder={placeholder}
          className="
          w-full bg-surface-950 border border-surface-700 text-text-primary text-xs font-mono p-3
          focus:outline-none focus:border-teal-glow focus:ring-1 focus:ring-teal-glow/50
          placeholder:text-surface-700 transition-all duration-300
        "
        />
        {/* Corner Decor */}
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-surface-600 group-focus-within:border-teal-glow transition-colors" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-surface-600 group-focus-within:border-teal-glow transition-colors" />
      </div>
    </div>
  )
}
