"use client"

import { useState } from "react"
import { toggleAuthModal, useAppDispatch, useAppSelector, RootState } from "@repo/reduxSetup"
import { LoginForm } from "./LoginForm"
import { RegisterForm } from "./RegisterForm"

export function AuthComponent({ isPublic }: { isPublic: boolean }) {
  const dispatch = useAppDispatch()
  const [isLogin, setIsLogin] = useState(true)
  const { isRequired } = useAppSelector((state: RootState) => state.authSlice);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4">

      {/* Modal Container */}
      <div
        className="relative bg-surface w-full max-w-md max-h-[95dvh] border-2 border-ink flex flex-col overflow-hidden shadow-wire"
      >
        {/* --- Header --- */}
        <div className="h-14 border-b-2 border-ink flex items-center justify-between px-6 shrink-0 relative z-20">
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 border-2 border-ink ${isLogin ? 'bg-teal-primary shadow-[2px_2px_0px_0px_rgba(19,21,22,1)]' : 'bg-ink'}`} />
            <h2 className="font-black text-sm uppercase tracking-tighter text-ink">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
          </div>
          {(isPublic && !isRequired) &&
            <button
              onClick={() => dispatch(toggleAuthModal())}
              className="w-8 h-8 border-2 border-ink flex items-center justify-center hover:bg-ink hover:text-background transition-colors shadow-[2px_2px_0px_0px_rgba(19,21,22,1)] active:translate-y-0.5 active:shadow-none"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          }
        </div>

        {/* --- Tabs --- */}
        <div className="flex border-b-2 border-ink relative z-20 shrink-0">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${isLogin
              ? 'bg-background text-ink'
              : 'bg-surface text-dust hover:text-ink border-l-2 border-ink'
              }`}
          >
            Login
          </button>
          {isPublic && (
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${!isLogin
                ? 'bg-background text-ink'
                : 'bg-surface text-dust hover:text-ink border-l-2 border-ink'
                }`}
            >
              Register
            </button>
          )}
        </div>

        {/* --- Form Body --- */}
        <div className="p-8 relative z-20 flex-1 bg-background overflow-y-auto custom-scrollbar font-sans">
          {isLogin ? (
            <LoginForm isPublic={isPublic} />
          ) : (
            <RegisterForm />
          )}
        </div>

        {/* Footer annotation */}
        <div className="p-3 border-t-2 border-ink/5 text-center bg-surface/30">
           <span className="font-mono text-[8px] uppercase text-dust opacity-40 font-bold">Secure Access Protocol V1.0</span>
        </div>

      </div>
    </div>
  )
}
