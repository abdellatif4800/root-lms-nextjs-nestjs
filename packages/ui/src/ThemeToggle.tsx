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
        px-4 py-2
        hover:border-purple-glow hover:text-purple-glow
        transition-colors duration-200
        active:translate-x-[1px] active:translate-y-[1px]
      "
      style={{
        boxShadow: "3px 3px 0px var(--surface-800)",
        clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))"
      }}
    >
      {/* Sweep fill on hover */}
      <span className="absolute inset-0 bg-purple-glow/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-200 z-0" />

      <span className="relative z-10 flex items-center gap-2">
        {/* Icon */}
        {isDark ? (
          /* Sun */
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
        ) : (
          /* Moon */
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
        {isDark ? "LIGHT_MODE" : "DARK_MODE"}
      </span>
    </button>
  );
}

// "use client";
//
// import { useTheme } from "next-themes";
// import { useEffect, useState } from "react";
//
// export function ThemeToggle() {
//   const { theme, setTheme } = useTheme();
//   const [mounted, setMounted] = useState(false);
//
//   // Prevent hydration mismatch
//   useEffect(() => {
//     setMounted(true);
//   }, []);
//
//   if (!mounted) return null;
//
//   return (
//     <button
//       onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//       className="
//         relative overflow-hidden group
//         bg-surface-900 border border-surface-800
//       text-text-primary  
//       text-[10px] font-bold uppercase tracking-widest
//         px-4 py-2
//         hover:border-purple-glow hover:text-purple-glow transition-all
//       "
//       style={{ boxShadow: "3px 3px 0px var(--surface-800)" }}
//     >
//       <span className="relative z-10 flex items-center gap-2">
//         [{theme === "dark" ? "LIGHT_MODE" : "DARK_MODE"}]
//       </span>
//     </button>
//   );
// }
