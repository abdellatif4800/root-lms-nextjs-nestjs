"use client";
import { usePathname } from "next/navigation";
import MainLayoutClient from "./MainLayoutClient";
import { Navbar } from "./Navbar";
import { Inter, JetBrains_Mono } from "next/font/google";

const sansFont = Inter({ subsets: ["latin"], variable: "--font-sans" });
const monoFont = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isTutorialView = pathname.startsWith("/tutorials/") && pathname !== "/tutorials/list";
  const isQuizPage = pathname.startsWith("/quizzes/");

  // Combine conditions for views that need to touch the screen edges (no padding)
  const isFullScreenView = isTutorialView || isQuizPage;

  // Show normal navbar if not on Home, not in Tutorial view, and not on a Quiz page
  const showNavbar = !isHome && !isTutorialView && !isQuizPage;

  return (
    <div className={`
      ${sansFont.variable} ${monoFont.variable}
      h-screen w-full flex flex-col items-center
      ${isFullScreenView ? "p-0" : "p-2 sm:p-4 md:p-6"} overflow-hidden font-sans text-ink relative
    `}>

      {/* Blueprint Drawing Grid */}
      <div className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          backgroundImage: "linear-gradient(rgba(13,148,136,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(13,148,136,0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Texture for "Parchment/Paper" feel */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.03] mix-blend-multiply"
        style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cardboard.png')" }}
      />

      <MainLayoutClient>
        {/* Standard Navbar */}
        {showNavbar && (
          <div className="w-full flex justify-center mb-3 sm:mb-6 shrink-0 relative z-30">
            <div className="w-[95%] lg:w-[90%] max-w-7xl pb-3 sm:pb-4 border-b-2 border-ink">
              <Navbar />
            </div>
          </div>
        )}


        {/* Main page content area */}
        <main className={`w-full flex-1 flex flex-col ${isFullScreenView ? "overflow-hidden" : "overflow-y-auto custom-scrollbar"} relative z-10 scroll-smooth`}>

          {/* - Full-screen views (Tutorials/Quizzes) get 'flex-1 overflow-hidden' to lock tightly to the screen.
            - Home and other pages get 'min-h-full' to stretch to the bottom, but grow and scroll if content is taller. 
          */}
          <div className={`relative z-10 flex flex-col ${isFullScreenView ? "flex-1 overflow-hidden" : "min-h-full"}`}>
            {children}
          </div>

        </main>
      </MainLayoutClient>
    </div>
  );
};
