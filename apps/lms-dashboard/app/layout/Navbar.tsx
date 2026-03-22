"use client";
import { usePathname } from "next/navigation";
import { UserMenu, ThemeToggle } from "@repo/ui";
import { RootState, toggleAuthModal, useAppDispatch, useAppSelector } from "@repo/reduxSetup";

function getPageLabel(pathname: string): { section: string; page: string } {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return { section: "Admin Control", page: "Dashboard Overview" };
  const section = parts[0].toUpperCase();
  const page = parts[parts.length - 1]
    .replace(/([A-Z])/g, " $1")
    .replace(/-/g, " ")
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
    <header className="h-16 shrink-0 bg-surface border-b-2 border-ink relative flex items-center justify-between px-4 lg:px-8 z-20 font-sans shadow-wire">

      {/* ── LEFT ── */}
      <div className="relative z-20 flex items-center gap-4 min-w-0">

        {/* Hamburger — mobile only */}
        <button
          onClick={openSidebar}
          className="lg:hidden shrink-0 border-2 border-ink p-1.5 hover:bg-ink hover:text-background transition-colors shadow-[2px_2px_0px_0px_rgba(19,21,22,1)]"
          aria-label="Open menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>

        <div className="flex flex-col min-w-0">
          <span className="text-[8px] font-mono font-bold text-dust uppercase tracking-widest hidden sm:block">
            {section}
          </span>
          <span className="text-sm sm:text-lg font-black text-ink uppercase tracking-tighter truncate leading-none mt-1">
            {page}
          </span>
        </div>
      </div>

      {/* ── RIGHT ── */}
      <div className="relative z-20 flex items-center gap-4 shrink-0">


        {isAuth ? (
          <UserMenu />
        ) : (
          <button
            type="button"
            className="btn-wire-teal text-[10px] px-6 py-2 shadow-[2px_2px_0px_0px_rgba(19,21,22,1)]"
            onClick={() => dispatch(toggleAuthModal())}
          >
            <span className="sm:hidden">Login</span>
            <span className="hidden sm:inline">Admin Login</span>
          </button>
        )}
      </div>
    </header>
  );
};
