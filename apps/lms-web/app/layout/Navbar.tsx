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
    { label: "Lessons", href: "/tutorials/list" },
    { label: "Paths", href: "/roadmaps" },
    { label: "Progress", href: `/progress?userId=${user?.sub}` },
    { label: "Pricing", href: `/pricing` },
  ];

  return (
    <nav className="w-full max-w-7xl mx-auto flex flex-col font-mono tracking-tighter px-4 py-3">

      {/* ── Main row ── */}
      <div className="flex flex-row items-center justify-between">

        {/* Logo */}
        <Link href="/" className="group flex items-center shrink-0 border-2 border-ink px-3 py-1 bg-surface hover:bg-ink hover:text-background transition-colors shadow-[2px_2px_0px_0px_rgba(19,21,22,1)]">
          <span className="text-xl font-black">
            LMS.v1
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-10">
          {navItems.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                className={`
                  relative text-xs font-bold uppercase tracking-widest transition-all duration-200
                  ${isActive ? "text-teal-primary" : "text-dust hover:text-ink"}
                `}
              >
                {label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-teal-primary" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-row items-center gap-4">
          <ThemeToggle />

          {isAuth ? (
            <UserMenu />
          ) : (
            <button
              className="btn-wire-teal text-[10px] px-6 py-2 shadow-[2px_2px_0px_0px_rgba(19,21,22,1)]"
              onClick={() => dispatch(toggleAuthModal())}
            >
              Log_In
            </button>
          )}

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden border-2 border-ink bg-surface text-ink p-2"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" /></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile nav drawer ── */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 border-2 border-ink bg-surface flex flex-col divide-y-2 divide-ink">
          {navItems.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  px-6 py-4 text-xs font-bold uppercase tracking-widest
                  ${isActive ? "text-teal-primary bg-background" : "text-dust"}
                `}
              >
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};
