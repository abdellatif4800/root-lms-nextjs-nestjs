"use client";
import { usePathname } from "next/navigation";
import { UserMenu, ThemeToggle } from "@repo/ui";
import { RootState, toggleAuthModal, useAppDispatch, useAppSelector } from "@repo/reduxSetup";

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

  const openSidebar = () => {
    window.dispatchEvent(new CustomEvent("sidebar:open"));
  };

  return (
    <header className="h-14 shrink-0 bg-surface-900/80 border border-surface-800 border-b-2 border-b-teal-glow relative flex items-center justify-between px-3 lg:px-5 backdrop-blur-sm shadow-card">

      {/* Scanline */}
      <div className="scanline-overlay opacity-[0.03]" />

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l border-teal-glow/50 pointer-events-none z-10" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-surface-700 pointer-events-none z-10" />

      {/* ── LEFT ── */}
      <div className="relative z-20 flex items-center gap-2.5 min-w-0">

        {/* Hamburger — mobile only */}
        <button
          onClick={openSidebar}
          className="lg:hidden shrink-0 text-text-secondary hover:text-teal-glow transition-colors duration-200 mr-1"
          aria-label="Open menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>

        <div className="w-0.5 h-5 bg-teal-glow shrink-0 shadow-glow-teal-sm" />

        <div className="flex items-center gap-1.5 leading-none min-w-0">
          <span className="hidden sm:block text-[10px] font-digital font-black text-teal-glow uppercase tracking-wider shrink-0 text-glow-teal">
            {section}
          </span>
          <span className="hidden sm:block text-surface-700 text-[10px] shrink-0">/</span>
          <span className="text-[10px] font-digital font-black text-text-primary uppercase tracking-wider truncate max-w-[160px] sm:max-w-none">
            {page}
          </span>
        </div>
      </div>

      {/* ── RIGHT ── */}
      <div className="relative z-20 flex items-center gap-2 lg:gap-4 shrink-0">

        {/* Status pill — desktop only */}
        <div className="hidden lg:flex items-center gap-2 border border-surface-700 px-2.5 py-1 [clip-path:polygon(0_0,calc(100%-5px)_0,100%_5px,100%_100%,5px_100%,0_calc(100%-5px))]">
          <span className="w-1.5 h-1.5 bg-emerald-glow animate-pulse shadow-glow-emerald-sm" />
          <span className="text-[8px] font-terminal uppercase tracking-[0.2em] text-text-secondary">
            <span className="text-emerald-glow font-bold">ONLINE</span>
          </span>
        </div>

        <div className="hidden lg:block h-4 w-px bg-surface-700" />

        <ThemeToggle />

        <div className="h-4 w-px bg-surface-700" />

        {isAuth ? (
          <UserMenu />
        ) : (
          <button
            type="button"
            className="relative group overflow-hidden bg-transparent border border-emerald-glow/60 text-emerald-glow text-[9px] font-digital font-black uppercase tracking-[0.2em] px-2.5 sm:px-4 py-1.5 hover:text-black transition-colors duration-200 active:scale-95 [clip-path:polygon(0_0,calc(100%-6px)_0,100%_6px,100%_100%,6px_100%,0_calc(100%-6px))]"
            onClick={() => dispatch(toggleAuthModal())}
          >
            <span className="absolute inset-0 bg-emerald-glow -translate-x-full group-hover:translate-x-0 transition-transform duration-200 z-0" />
            <span className="relative z-10 sm:hidden">LOGIN</span>
            <span className="relative z-10 hidden sm:inline">_INIT_LOGIN</span>
          </button>
        )}
      </div>
    </header>
  );
};
