import { Orbitron, JetBrains_Mono } from 'next/font/google'
import Sidebar from './Sidebar'
import MainLayoutClient from './MainLayoutClient'
import { Navbar } from './Navbar'

const digitalFont = Orbitron({ subsets: ['latin'], variable: '--font-digital' })
const terminalFont = JetBrains_Mono({ subsets: ['latin'], variable: '--font-terminal' })

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`
      ${digitalFont.variable} ${terminalFont.variable}
      h-screen w-full bg-surface-950 flex gap-3 p-3 overflow-hidden font-terminal text-text-primary relative
    `}>

      {/* ── Global animated grid bg ── */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(var(--teal-glow) 1px, transparent 1px), linear-gradient(90deg, var(--teal-glow) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: "var(--grid-opacity)",
          animation: "layoutGridScroll 20s linear infinite",
        }}
      />
      {/* ── Radial vignette ── */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 30%, var(--vignette-color) 100%)" }}
      />
      {/* ── Ambient orbs ── */}
      <div className="pointer-events-none fixed z-0"
        style={{
          width: 500, height: 500,
          top: -180, left: -180,
          borderRadius: "50%",
          filter: "blur(100px)",
          background: "radial-gradient(circle, var(--shadow-teal) 0%, transparent 70%)",
          animation: "homeOrbFloat 16s ease-in-out infinite",
        }}
      />
      <div className="pointer-events-none fixed z-0"
        style={{
          width: 400, height: 400,
          bottom: -140, right: -140,
          borderRadius: "50%",
          filter: "blur(90px)",
          background: "radial-gradient(circle, var(--shadow-purple) 0%, transparent 70%)",
          animation: "homeOrbFloat 20s ease-in-out infinite reverse",
        }}
      />

      <MainLayoutClient>
        {/* ── SIDEBAR ── */}
        <Sidebar />

        {/* ── RIGHT COLUMN ── */}
        <div className="flex-1 flex flex-col min-w-0 relative z-10 gap-3">

          {/* NAVBAR */}
          <Navbar />

          {/* MAIN CONTENT */}
          <main className="flex-1 overflow-hidden relative">
            <div
              className="h-full w-full  border border-surface-800 border-t-2 border-t-purple-glow relative overflow-hidden flex flex-col backdrop-blur-[2px]"
              style={{ boxShadow: "4px 4px 0px var(--surface-800), 0 0 0 1px rgba(168,85,247,0.08)" }}
            >
              {/* Top-right corner bracket */}
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r border-purple-glow/40 z-30 pointer-events-none" />
              {/* Bottom-left corner bracket */}
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-surface-700 z-30 pointer-events-none" />

              {/* Scanline */}
              <div className="pointer-events-none absolute inset-0 z-10 opacity-[0.03]"
                style={{
                  background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)"
                }}
              />

              {/* Inner content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar relative z-20">
                {children}
              </div>

              {/* Bottom status micro-bar */}
              <div className="shrink-0 h-6 border-t border-surface-800 bg-surface-950/60 px-4 flex items-center justify-between z-20">
                <div className="flex items-center gap-4 text-[8px] font-terminal text-text-secondary uppercase tracking-[0.2em]">
                  <span className="opacity-40">SYS://ADMIN</span>
                  <span className="w-px h-3 bg-surface-700" />
                  <span className="flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-emerald-glow animate-pulse inline-block" style={{ boxShadow: "0 0 4px var(--shadow-emerald)" }} />
                    <span className="text-emerald-glow">NOMINAL</span>
                  </span>
                </div>
                <span className="text-[8px] font-terminal opacity-20 uppercase tracking-wider">v4.0.2_STABLE</span>
              </div>
            </div>
          </main>
        </div>
      </MainLayoutClient>
    </div>
  )
}
