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
      p-4 md:p-6 overflow-hidden font-terminal text-gray-300 relative
    `}>

      {/* Grid lines */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          backgroundImage:
            "linear-gradient(var(--teal-glow) 1px, transparent 1px), linear-gradient(90deg, var(--teal-glow) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: "var(--grid-opacity)",
          animation: "layoutGridScroll 25s linear infinite",
        }}
      />

      {/* Grid intersection dots — slightly more visible than lines */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: "radial-gradient(circle, var(--teal-glow) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: "var(--grid-dot-opacity)",
          animation: "layoutGridScroll 25s linear infinite",
        }}
      />

      {/* Radial vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-all duration-300"
        style={{ background: "radial-gradient(ellipse at center, transparent 50%, var(--vignette-color) 100%)" }}
      />

      {/* Scanlines */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)",
          opacity: "var(--scanline-opacity)",
        }}
      />

      <MainLayoutClient>
        {pathname !== "/" &&
          (pathname === "/tutorials/list" || !pathname.startsWith("/tutorials/")) && (
            <div className="w-full flex justify-center mb-6 shrink-0 relative z-20">
              <div
                className="w-full lg:w-[70%] pb-4 border-b border-surface-800 flex items-center justify-center"
                style={{ borderImage: "linear-gradient(90deg, transparent, var(--nav-border), transparent) 1" }}
              >
                <Navbar />
              </div>
            </div>
          )}

        <main className="w-full lg:w-[98%] flex-1 overflow-hidden custom-scrollbar relative z-20 ">
          {/* style={{ */}
          {/*   background: "linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.08) 50%), linear-gradient(90deg, rgba(255,0,0,0.015), rgba(0,255,0,0.008), rgba(0,0,255,0.015))", */}
          {/*   backgroundSize: "100% 2px, 3px 100%", */}
          {/* }} */}
          <div
            className="pointer-events-none absolute z-10"
          />
          <div className="relative z-20 h-full">
            {children}
          </div>
        </main>
      </MainLayoutClient>

    </div>
  );
};
