"use client";
import { usePathname } from "next/navigation";
import { UserMenu, ThemeToggle } from "@repo/ui";
import { RootState, toggleAuthModal, useAppDispatch, useAppSelector } from "@repo/reduxSetup";

// Derive a readable page name from the pathname
function getPageLabel(pathname: string): { section: string; page: string } {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return { section: "SYS_ADMIN", page: "Dashboard" };
  const section = parts[0].toUpperCase();
  const page = parts[parts.length - 1]
    .replace(/([A-Z])/g, "_$1")
    .replace(/-/g, "_")
    .toUpperCase();
  return { section, page };
}

export const Navbar = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user, isAuth } = useAppSelector((state: RootState) => state.authSlice);
  const { section, page } = getPageLabel(pathname);

  return (
    <header
      className="h-14 shrink-0 bg-surface-900/80 border border-surface-800 border-b-2 border-b-teal-glow relative flex items-center justify-between px-5 backdrop-blur-sm"
      style={{ boxShadow: "4px 4px 0px var(--surface-800)" }}
    >
      {/* Scanline */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] z-0"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)"
        }}
      />

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l border-teal-glow/50 pointer-events-none z-10" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-surface-700 pointer-events-none z-ROOT10" />

      {/* ── LEFT: Breadcrumb ── */}
      <div className="relative z-20 flex items-center gap-2.5">
        {/* Teal left accent bar */}
        <div className="w-0.5 h-5 bg-teal-glow" style={{ boxShadow: "0 0 6px var(--shadow-teal)" }} />

        <div className="flex flex-col gap-0">
          {/* Breadcrumb path */}
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className="text-[10px] font-digital font-black text-teal-glow uppercase tracking-wider"
              style={{ textShadow: "0 0 8px var(--shadow-teal)" }}
            >
              {section}
            </span>
            <span className="text-surface-700 text-[10px]">/</span>
            <span className="text-[10px] font-digital font-black text-text-primary uppercase tracking-wider">
              {page}
            </span>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Actions ── */}
      <div className="relative z-20 flex items-center gap-4">

        {/* Status */}
        <div className="hidden md:flex items-center gap-2 border border-surface-700 px-2.5 py-1"
          style={{ clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))" }}
        >
          <span className="w-1.5 h-1.5 bg-emerald-glow animate-pulse" style={{ boxShadow: "0 0 5px var(--shadow-emerald)" }} />
          <span className="text-[8px] font-terminal uppercase tracking-[0.2em] text-text-secondary">
            <span className="text-emerald-glow font-bold">ONLINE</span>
          </span>
        </div>

        <div className="h-4 w-px bg-surface-700" />

        {/* Theme Toggle */}
        <ThemeToggle />

        <div className="h-4 w-px bg-surface-700" />

        {/* Auth */}
        {isAuth ? (
          <UserMenu />
        ) : (
          <button
            type="button"
            className="
              relative group overflow-hidden
              bg-transparent border border-emerald-glow/60
              text-emerald-glow text-[9px] font-digital font-black uppercase tracking-[0.2em]
              px-4 py-1.5
              hover:text-black transition-colors duration-200 active:scale-95
            "
            style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}
            onClick={() => dispatch(toggleAuthModal())}
          >
            <span className="absolute inset-0 bg-emerald-glow translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-200 z-0" />
            <span className="relative z-10">_INIT_LOGIN</span>
          </button>
        )}
      </div>
    </header>
  );
};


// "use client";
// import { usePathname } from "next/navigation";
// import { useState, useRef, useEffect } from "react";
// import { UserMenu, ThemeToggle } from "@repo/ui"; // Adjust path if necessary
// import { RootState, toggleAuthModal, useAppDispatch, useAppSelector } from "@repo/reduxSetup";
//
//
// export const Navbar = () => {
//   const pathname = usePathname();
//   const dispatch = useAppDispatch()
//   const { user, isAuth } = useAppSelector((state: RootState) => state.authSlice)
//
//   return (
//
//     <header
//       className="
//             h-16 mb-4 shrink-0
//             bg-surface-900 
//             border border-surface-800 
//             border-b-2 border-b-teal-glow
//             relative flex items-center justify-between px-6
//           "
//       style={{ boxShadow: '4px 4px 0px var(--surface-800)' }}
//     >
//       {/* Header Scanline Overlay */}
//       <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] z-10 opacity-50" />
//
//       {/* Left: Breadcrumbs / Title (Z-20 to sit above scanlines) */}
//       <div className="relative z-20 flex items-center gap-2">
//         <span className="text-purple-glow font-digital text-sm tracking-wider">SYS_ADMIN</span>
//         <span className="text-surface-700">/</span>
//         <span className="text-white text-xs font-bold uppercase tracking-widest">Dashboard</span>
//       </div>
//
//       {/* Right: Actions (Theme Toggle, User Profile) */}
//       <div className="relative z-20 flex items-center gap-6">
//         {/* Status Indicator */}
//         <div className="hidden md:flex items-center gap-2 text-[10px] font-mono uppercase">
//           <span className="text-text-secondary">Sys_Status:</span>
//           <span className="text-emerald-glow animate-pulse">Online</span>
//         </div>
//
//         <div className="h-4 w-[1px] bg-surface-700"></div>
//
//         {/* Theme Toggle Button */}
//         <ThemeToggle />
//
//         {/* Simple User Badge */}
//         {
//           isAuth ? (
//             < UserMenu />
//           ) : (
//             <button
//               type="button"
//               className="bg-emerald-glow text-surface-950 text-[10px] font-black uppercase px-5 py-1.5 hover:bg-white hover:text-black transition-all active:translate-y-[1px]"
//               style={{ boxShadow: '3px 3px 0px rgba(16, 185, 129, 0.2)' }}
//               onClick={() => dispatch(toggleAuthModal())}
//             >
//               _INIT_LOGIN
//             </button>
//           )
//         }
//       </div>
//     </header>
//
//   );
// };
//
