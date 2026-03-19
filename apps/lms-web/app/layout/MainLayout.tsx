"use client";
import { usePathname } from "next/navigation";
import MainLayoutClient from "./MainLayoutClient";
import { Navbar } from "./Navbar";
import { Orbitron, JetBrains_Mono } from "next/font/google";

const digitalFont = Orbitron({ subsets: ["latin"], variable: "--font-digital" });
const terminalFont = JetBrains_Mono({ subsets: ["latin"], variable: "--font-terminal" });

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className={`
      ${digitalFont.variable} ${terminalFont.variable}
      h-screen w-full bg-surface-950 flex flex-col items-center
      p-2 sm:p-4 md:p-6 overflow-hidden font-terminal text-gray-300 relative
    `}>

      {/* z-0 — background effects (non-interactive) */}
      <div className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          backgroundImage: "linear-gradient(var(--teal-glow) 1px, transparent 1px), linear-gradient(90deg, var(--teal-glow) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: "var(--grid-opacity)",
          animation: "layoutGridScroll 25s linear infinite",
        }}
      />
      <div className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: "radial-gradient(circle, var(--teal-glow) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: "var(--grid-dot-opacity)",
          animation: "layoutGridScroll 25s linear infinite",
        }}
      />
      <div className="pointer-events-none fixed inset-0 z-0 transition-all duration-300"
        style={{ background: "radial-gradient(ellipse at center, transparent 50%, var(--vignette-color) 100%)" }}
      />
      <div className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)",
          opacity: "var(--scanline-opacity)",
        }}
      />

      <MainLayoutClient>
        {/* z-30 — navbar sits above main content */}
        {pathname !== "/" &&
          (pathname === "/tutorials/list" || !pathname.startsWith("/tutorials/")) && (
            <div className="w-full flex justify-center mb-3 sm:mb-6 shrink-0 relative z-30">
              <div
                className="w-[95%] lg:w-[90%] max-w-7xl pb-3 sm:pb-4 border-b border-surface-800 flex items-center justify-center"
                style={{ borderImage: "linear-gradient(90deg, transparent, var(--nav-border), transparent) 1" }}
              >
                <Navbar />
              </div>
            </div>
          )}

        {/* z-10 — main page content */}
        <main className="w-full lg:w-[98%] flex-1 overflow-hidden custom-scrollbar relative z-10">
          <div className="relative z-10 h-full">
            {children}
          </div>
        </main>
      </MainLayoutClient>

      {/* Portal dropdowns (UserMenu, Filter, Sidebar overlays) render at z-[9999] via createPortal into document.body — no changes needed here */}
    </div>
  );
};
