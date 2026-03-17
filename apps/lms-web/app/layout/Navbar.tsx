"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle, UserMenu } from "@repo/ui";
import { toggleAuthModal, RootState, logout, useAppDispatch, useAppSelector } from "@repo/reduxSetup";

export const Navbar = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user, isAuth } = useAppSelector((state: RootState) => state.authSlice);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Tutorials", href: "/tutorials/list" },
    { label: "Roadmaps", href: "/roadmaps" },
    { label: "My Progress", href: `/progress?userId=${user?.sub}` },
    { label: "Pricing", href: `/pricing` },
  ];

  return (
    <nav className="p-2 w-full flex flex-col font-digital tracking-widest">

      {/* ── Main row ── */}
      <div className="flex flex-row items-center justify-between">

        {/* Logo */}
        <Link href="/" className="group flex items-center shrink-0">
          <span className="text-teal-glow text-lg sm:text-xl font-black group-hover:text-emerald-glow transition-colors duration-200">
            {">"} ./
          </span>
          <span className="text-text-primary text-lg sm:text-xl font-black ml-2 group-hover:text-teal-glow transition-colors duration-200">
            Root_LMS
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-10">
          {navItems.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                className={`
                  relative text-xs font-bold uppercase tracking-widest transition-all duration-200
                  ${isActive ? "text-purple-glow" : "text-text-secondary hover:text-text-primary"}
                `}
                style={isActive ? { textShadow: "0 0 8px var(--shadow-purple)" } : undefined}
              >
                {isActive && <span className="mr-1 animate-pulse">_</span>}
                {label}
                {isActive && (
                  <span
                    className="absolute -bottom-1 left-0 w-full h-[2px] bg-purple-glow"
                    style={{ boxShadow: "0 0 6px var(--shadow-purple)" }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-row items-center gap-2 sm:gap-4">
          <ThemeToggle />

          {isAuth ? (
            <UserMenu />
          ) : (
            <button
              className="
                relative overflow-hidden group/login
                bg-emerald-glow text-surface-950
                text-[9px] sm:text-[10px] font-digital font-black uppercase tracking-wider
                px-3 sm:px-6 py-1.5 sm:py-2
                hover:text-black transition-colors duration-200
                active:translate-y-[2px] active:translate-x-[2px]
                [clip-path:polygon(0_0,calc(100%-6px)_0,100%_6px,100%_100%,6px_100%,0_calc(100%-6px))]
                [box-shadow:4px_4px_0px_var(--shadow-emerald)]
              "
              onClick={() => dispatch(toggleAuthModal())}
            >
              <span className="absolute inset-0 bg-white -translate-x-full group-hover/login:translate-x-0 transition-transform duration-200 z-0" />
              <span className="relative z-10 sm:hidden">LOGIN</span>
              <span className="relative z-10 hidden sm:inline">_INIT_LOGIN</span>
            </button>
          )}

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden border border-surface-700 bg-surface-900 text-text-secondary hover:text-teal-glow hover:border-teal-glow transition-colors duration-200 p-1.5"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile nav drawer ── */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 border-t border-surface-800 pt-3 flex flex-col gap-1">
          {navItems.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 text-xs font-bold uppercase tracking-widest
                  border-l-2 transition-all duration-200
                  ${isActive
                    ? "border-purple-glow text-purple-glow bg-surface-800/50"
                    : "border-transparent text-text-secondary hover:text-text-primary hover:border-surface-600 hover:bg-surface-900"}
                `}
                style={isActive ? { textShadow: "0 0 8px var(--shadow-purple)" } : undefined}
              >
                {isActive && <span className="animate-pulse text-purple-glow">_</span>}
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};
