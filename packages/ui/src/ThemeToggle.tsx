"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="
        relative overflow-hidden group
        bg-surface-900 border border-surface-800
        text-text-secondary
        text-[9px] font-digital font-bold uppercase tracking-widest
        px-2 sm:px-4 py-2
        hover:border-purple-glow hover:text-purple-glow
        transition-colors duration-200
        active:translate-x-[1px] active:translate-y-[1px]
        [box-shadow:3px_3px_0px_var(--surface-800)]
        [clip-path:polygon(0_0,calc(100%-6px)_0,100%_6px,100%_100%,6px_100%,0_calc(100%-6px))]
      "
    >
      {/* Sweep fill on hover */}
      <span className="absolute inset-0 bg-purple-glow/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-200 z-0" />
      <span className="relative z-10 flex items-center gap-2">
        {/* Icon — always visible */}
        {isDark ? (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
        {/* Label — hidden on mobile */}
        <span className="hidden sm:inline">
          {isDark ? "LIGHT_MODE" : "DARK_MODE"}
        </span>
      </span>
    </button>
  );
}
