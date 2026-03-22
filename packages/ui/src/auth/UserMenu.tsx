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

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [isOpen]);

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
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          flex items-center gap-2 px-4 py-2 border-2 transition-all duration-200
          text-[10px] font-mono font-black uppercase tracking-widest
          ${isOpen
            ? "border-ink bg-background shadow-wire"
            : "border-ink/20 text-dust hover:border-ink hover:text-ink"
          }
        `}
      >
        <div className={`w-2 h-2 border border-ink ${isOpen ? 'bg-teal-primary' : 'bg-ink/20'}`} />
        <span className="max-w-[100px] truncate">{user?.username || user?.email}</span>
        <span className="text-[8px] opacity-40 ml-1">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && typeof document !== "undefined" && createPortal(
        <div
          ref={menuRef}
          className="fixed z-[9999] w-56 bg-surface border-2 border-ink flex flex-col shadow-wire font-sans"
          style={{
            top: dropdownPos.top,
            right: dropdownPos.right,
          }}
        >
          {/* User Info */}
          <div className="px-4 py-4 border-b-2 border-ink/10 flex items-center gap-3 bg-background/50">
            <div className="w-8 h-8 border-2 border-ink flex items-center justify-center text-sm shadow-[2px_2px_0px_0px_rgba(19,21,22,1)]">
              👤
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-mono font-bold text-dust uppercase truncate tracking-tighter">
                {user?.email}
              </span>
              <span className="text-xs font-black text-ink truncate uppercase">
                {user?.username || 'Student'}
              </span>
            </div>
          </div>

          {/* Links */}
          <Link
            href={`/progress?userId=${user?.sub}`}
            onClick={() => setIsOpen(false)}
            className="w-full px-4 py-3 text-xs font-bold text-dust hover:bg-background hover:text-ink transition-colors border-b border-ink/5 flex items-center gap-3 group uppercase"
          >
            <span className="w-1.5 h-1.5 border border-ink opacity-0 group-hover:opacity-100 bg-teal-primary" />
            My Progress
          </Link>

          {/* Logout */}
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="w-full px-4 py-3 text-xs font-bold text-dust hover:bg-red-500/5 hover:text-red-500 transition-colors flex items-center gap-3 group disabled:opacity-40 uppercase"
          >
            <span className="w-1.5 h-1.5 border border-ink opacity-0 group-hover:opacity-100 bg-red-500" />
            {mutation.isPending ? "Signing Out..." : "Sign Out"}
          </button>
        </div>,
        document.body
      )}
    </div>
  );
}
