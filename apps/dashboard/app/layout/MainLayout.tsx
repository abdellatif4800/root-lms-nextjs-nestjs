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
      h-screen w-full bg-surface-950 flex overflow-hidden font-terminal text-text-primary relative
      gap-0 lg:gap-3 p-0 lg:p-3
    `}>

      {/* ── Global animated grid bg ── */}
      <div className="pointer-events-none fixed inset-0 z-0 [background-image:linear-gradient(var(--teal-glow)_1px,transparent_1px),linear-gradient(90deg,var(--teal-glow)_1px,transparent_1px)] [background-size:40px_40px] opacity-[var(--grid-opacity)] [animation:layoutGridScroll_20s_linear_infinite]" />

      {/* ── Radial vignette ── */}
      <div className="pointer-events-none fixed inset-0 z-0 [background:radial-gradient(ellipse_at_center,transparent_30%,var(--vignette-color)_100%)]" />

      {/* ── Ambient orb teal ── */}
      <div className="pointer-events-none fixed z-0 w-[500px] h-[500px] -top-[180px] -left-[180px] rounded-full blur-[100px] [background:radial-gradient(circle,var(--shadow-teal)_0%,transparent_70%)] [animation:homeOrbFloat_16s_ease-in-out_infinite]" />

      {/* ── Ambient orb purple ── */}
      <div className="pointer-events-none fixed z-0 w-[400px] h-[400px] -bottom-[140px] -right-[140px] rounded-full blur-[90px] [background:radial-gradient(circle,var(--shadow-purple)_0%,transparent_70%)] [animation:homeOrbFloat_20s_ease-in-out_infinite_reverse]" />

      <MainLayoutClient>
        {/*
          Sidebar behaviour:
          - lg+  : in-flow, collapsible, shrinks/expands the layout
          - <lg  : fixed overlay, does NOT affect layout width at all
        */}
        <Sidebar />

        {/* ── RIGHT COLUMN — always takes full width on mobile ── */}
        <div className="flex-1 flex flex-col min-w-0 relative z-10 gap-0 lg:gap-3">

          {/* NAVBAR */}
          <Navbar />

          {/* MAIN CONTENT */}
          <main className="flex-1 overflow-hidden relative">
            <div className="h-full w-full border border-surface-800 border-t-2 border-t-purple-glow relative overflow-hidden flex flex-col backdrop-blur-[2px] [box-shadow:4px_4px_0px_var(--surface-800),0_0_0_1px_rgba(168,85,247,0.08)]">

              {/* Top-right corner bracket */}
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r border-purple-glow/40 z-30 pointer-events-none" />
              {/* Bottom-left corner bracket */}
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-surface-700 z-30 pointer-events-none" />

              {/* Scanline */}
              <div className="scanline-overlay opacity-[0.03]" />

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
                    <span className="w-1 h-1 bg-emerald-glow animate-pulse inline-block shadow-glow-emerald-sm" />
                    <span className="text-emerald-glow">NOMINAL</span>
                  </span>
                </div>
                <span className="hidden sm:block text-[8px] font-terminal opacity-20 uppercase tracking-wider">v4.0.2_STABLE</span>
              </div>
            </div>
          </main>

        </div>
      </MainLayoutClient>
    </div>
  )
}
