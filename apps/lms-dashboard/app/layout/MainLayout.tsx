import { Inter, JetBrains_Mono } from 'next/font/google'
import Sidebar from './Sidebar'
import MainLayoutClient from './MainLayoutClient'
import { Navbar } from './Navbar'

const sansFont = Inter({ subsets: ["latin"], variable: "--font-sans" });
const monoFont = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`
      ${sansFont.variable} ${monoFont.variable}
      h-screen w-full bg-background flex overflow-hidden font-sans text-ink relative p-3
    `}>

      {/* ── Blueprint Drawing Grid ── */}
      <div className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          backgroundImage: "linear-gradient(rgba(13,148,136,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(13,148,136,0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* ── Texture for "Parchment/Paper" feel ── */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.03] mix-blend-multiply"
        style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cardboard.png')" }}
      />

      <MainLayoutClient>
        {/*
          Sidebar behaviour:
          - lg+  : in-flow, collapsible, shrinks/expands the layout
          - <lg  : fixed overlay, does NOT affect layout width at all
        */}
        <div className='flex flex-row gap-2 w-full'>

          <Sidebar />

          {/* ── RIGHT COLUMN — always takes full width on mobile ── */}
          <div className="flex-1 flex flex-col gap-2 relative z-10">

            {/* NAVBAR */}
            <Navbar />

            {/* MAIN CONTENT */}
            <main className="flex-1 overflow-hidden relative w-full">
              <div className="h-full w-full border-2 border-ink bg-surface shadow-wire relative overflow-hidden flex flex-col">

                {/* Inner content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar relative z-20">
                  {children}
                </div>

                {/* Bottom status micro-bar */}
                <div className="shrink-0 h-8 border-t-2 border-ink bg-background/50 px-4 flex items-center justify-between z-20 font-mono text-[10px] font-bold text-dust uppercase tracking-widest">
                  <div className="flex items-center gap-4">
                    <span className="opacity-60">Control Panel</span>
                    <span className="w-px h-3 bg-ink/20" />
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-teal-primary animate-pulse inline-block" />
                      <span className="text-teal-primary">Systems Active</span>
                    </span>
                  </div>
                  <span className="hidden sm:block opacity-40">Admin_V4.0</span>
                </div>
              </div>
            </main>

          </div>
        </div>

      </MainLayoutClient>
    </div>
  )
}
