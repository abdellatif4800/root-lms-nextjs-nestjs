"use client"

import { useState } from "react"
import { useDispatch, toggleAuthModal, useAppDispatch, useAppSelector, RootState } from "@repo/reduxSetup"
import { LoginForm } from "./LoginForm"
import { RegisterForm } from "./RegisterForm"

export function AuthComponent({ isPublic }: { isPublic: boolean }) {
  const dispatch = useAppDispatch()
  const [isLogin, setIsLogin] = useState(true)
  const { isRequired } = useAppSelector((state: RootState) => state.authSlice);

  return (
    // 1. Added p-4 sm:p-0 so the modal has breathing room on mobile edges
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-950/80 backdrop-blur-sm p-4 sm:p-0">

      {/* Modal Container */}
      {/* 2. Added w-full, max-h-[95dvh] to handle mobile sizing and browser UI bars */}
      <div
        className="relative bg-surface-900 w-full max-w-md max-h-[95dvh] border border-surface-800 flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        style={{ boxShadow: '8px 8px 0px var(--surface-800)' }}
      >
        {/* Scanline Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] z-10 opacity-50" />

        {/* --- Header --- */}
        {/* 3. Added sm:px-4 and px-3 to adjust spacing on tiny screens */}
        <div className="h-12 border-b border-surface-800 bg-surface-950/50 flex items-center justify-between px-3 sm:px-4 shrink-0 relative z-20">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className={`shrink-0 w-2 h-2 rounded-full ${isLogin ? 'bg-teal-glow shadow-[0_0_8px_var(--teal-glow)]' : 'bg-purple-glow shadow-[0_0_8px_var(--purple-glow)]'} animate-pulse`} />
            <span className="font-digital text-xs sm:text-sm tracking-widest text-text-primary truncate">
              {isLogin ? 'AUTH_SEQUENCE_V1' : 'NEW_USER_PROTOCOL'}
            </span>
          </div>
          {(isPublic || !isRequired) &&
            <button
              onClick={() => dispatch(toggleAuthModal())}
              className="text-text-secondary hover:text-red-500 font-mono text-xs transition-colors shrink-0 ml-2"
            >
              [ X ]
            </button>}
        </div>

        {/* --- Tabs (Login / Register) --- */}
        {/* 4. Shrunk the font slightly on mobile (text-[10px] sm:text-xs) to prevent wrap */}
        <div className="flex border-b border-surface-800 relative z-20 shrink-0">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${isLogin
              ? 'bg-surface-900 text-teal-glow border-b-2 border-teal-glow'
              : 'bg-surface-950 text-text-secondary hover:text-white border-b-2 border-transparent'
              }`}
          >
            Login_Seq
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${!isLogin
              ? 'bg-surface-900 text-purple-glow border-b-2 border-purple-glow'
              : 'bg-surface-950 text-text-secondary hover:text-white border-b-2 border-transparent'
              }`}
          >
            Register_Seq
          </button>
        </div>

        {/* --- Form Body --- */}
        {/* 5. Scaled padding (p-5 sm:p-8) and added overflow-y-auto for internal scrolling */}
        <div className="p-5 sm:p-8 relative z-20 flex-1 bg-surface-900/50 overflow-y-auto custom-scrollbar">
          {isLogin ? (
            <LoginForm />
          ) : (
            <RegisterForm />
          )}
        </div>

      </div>
    </div>
  )
}
