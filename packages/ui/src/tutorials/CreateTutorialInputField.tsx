export function InputField({ type = "text", name, placeholder, value, onChange, className = "" }: any) {
  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      <label className="text-[9px] uppercase font-bold text-teal-glow/70 tracking-widest pl-1 mb-0.5">
        {placeholder}
      </label>
      {type === 'textarea' ? (
        <textarea
          name={name}
          placeholder={`ENTER_${placeholder.toUpperCase()}...`}
          value={value}
          onChange={onChange}
          rows={3}
          className="
          bg-surface-950 border border-surface-700 text-text-primary text-xs font-mono p-3
          focus:outline-none focus:border-purple-glow focus:ring-1 focus:ring-purple-glow/50
          placeholder:text-surface-700 transition-all duration-300 resize-none leading-relaxed
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
          bg-surface-950 border border-surface-700 text-text-primary text-xs font-mono p-3
          focus:outline-none focus:border-purple-glow focus:ring-1 focus:ring-purple-glow/50
          placeholder:text-surface-700 transition-all duration-300
        "
        />
      )}
    </div>
  )

}
