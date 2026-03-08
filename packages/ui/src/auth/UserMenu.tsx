"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { LOGOUT, useMutation } from "@repo/gql";
import { RootState, logout, useAppDispatch, useAppSelector } from "@repo/reduxSetup";

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.authSlice);

  // Position the portal dropdown under the button
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const mutation = useMutation({
    mutationFn: () => LOGOUT(),
    onSuccess: () => { dispatch(logout()); setIsOpen(false); },
    onError: (err) => { console.error("Logout error:", err); },
  });

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          flex items-center gap-2 px-4 py-2 border transition-all duration-200
          text-[10px] font-digital font-bold uppercase tracking-wider
          ${isOpen
            ? "border-teal-glow text-teal-glow bg-surface-900 shadow-[0_0_10px_rgba(45,212,191,0.2)]"
            : "border-surface-700 text-text-secondary hover:text-text-primary hover:border-surface-600"
          }
        `}
      >
        <div className="w-2 h-2 bg-emerald-glow animate-pulse shadow-[0_0_5px_var(--emerald-glow)]" />
        <span className="max-w-[100px] truncate">{user?.username || user?.email}</span>
        <span className="text-[8px] opacity-60 ml-1">{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* Portal dropdown — renders at document.body, escapes all stacking contexts */}
      {isOpen && typeof document !== "undefined" && createPortal(
        <div
          ref={menuRef}
          className="fixed z-[9999] w-56 bg-surface-900 border border-surface-700 flex flex-col shadow-xl font-digital"
          style={{
            top: dropdownPos.top,
            right: dropdownPos.right,
            boxShadow: "4px 4px 0px var(--surface-800)",
          }}
        >
          {/* User info header */}
          <div className="px-4 py-3 border-b border-surface-800 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-glow animate-pulse shadow-[0_0_4px_var(--shadow-emerald)]" />
            <span className="text-[9px] font-terminal text-text-secondary uppercase tracking-[0.2em] truncate opacity-60">
              {user?.email}
            </span>
          </div>

          {/* Progress link */}
          <Link
            href={`/progress?userId=${user?.sub}`}
            onClick={() => setIsOpen(false)}
            className="w-full px-4 py-3 text-[10px] text-text-secondary hover:bg-surface-800 hover:text-teal-glow transition-colors border-l-2 border-transparent hover:border-teal-glow text-left flex items-center gap-2 group"
          >
            <span className="opacity-0 group-hover:opacity-100 text-teal-glow transition-opacity">{">"}</span>
            My_Progress
          </Link>

          {/* Logout */}
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="w-full px-4 py-3 text-[10px] text-red-400 hover:bg-red-900/10 hover:text-red-300 transition-colors border-l-2 border-transparent hover:border-red-500 text-left flex items-center gap-2 group disabled:opacity-40"
          >
            <span className="opacity-0 group-hover:opacity-100 text-red-500 transition-opacity">{">"}</span>
            {mutation.isPending ? "Logging_Out..." : "[Logout]"}
          </button>
        </div>,
        document.body
      )}
    </div>
  );
}
