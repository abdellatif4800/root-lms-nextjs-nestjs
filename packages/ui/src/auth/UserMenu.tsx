"use client"

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { LOGOUT, useMutation } from "@repo/gql";
import { toggleAuthModal, RootState, logout, useAppDispatch, useAppSelector, setUnAuthorized } from "@repo/reduxSetup";

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state: RootState) => state.authSlice)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const mutation = useMutation({
    mutationFn: () => LOGOUT(),
    onSuccess: async () => {
      dispatch(logout())
    },
    onError: (err) => {
      console.error("Error saving:", err);
    }
  })

  const handleLogout = async () => {
    mutation.mutate()
  }


  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-4 py-2 border transition-all duration-200
          text-[10px] font-bold uppercase tracking-wider
          ${isOpen
            ? "border-teal-glow text-teal-glow bg-surface-900 shadow-[0_0_10px_rgba(45,212,191,0.2)]"
            : "border-surface-700 text-text-secondary hover:text-text-primary hover:border-surface-600"
          }
        `}
      >
        {/* Status Dot */}
        <div className="w-2 h-2 bg-emerald-glow animate-pulse shadow-[0_0_5px_var(--emerald-glow)]" />

        {/* User Name (Fallback to 'User') */}
        <span>{user?.username || user?.email}</span>

        {/* Chevron */}
        <span className="text-[8px] opacity-60 ml-2">{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-56 bg-surface-900 border border-surface-700 z-50 flex flex-col shadow-xl"
          style={{ boxShadow: '4px 4px 0px var(--surface-800)' }}
        >

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 text-xs text-red-400 hover:bg-red-900/10 hover:text-red-300 transition-colors border-l-2 border-transparent hover:border-red-500 text-left flex items-center group"
          >
            <span className="opacity-0 group-hover:opacity-100 mr-2 text-red-500">{">"}</span>
            [Logout]
          </button>
        </div>
      )}
    </div>
  );
};
