"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import "@repo/ui/styles.css";
import { useQuery, getSystemStats, getTutorials } from "@repo/gql";
import { TutorialCard } from "@repo/ui";

export default function Home() {
  const [text, setText] = useState("");
  const [showCards, setShowCards] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const fullText = "> ./ ROOT_LMS...";

  const { data: systemStats } = useQuery({
    queryKey: ["systemStats"],
    queryFn: getSystemStats,
  });

  const { data: paidTutorials } = useQuery({
    queryKey: ["paidTutorials"],
    queryFn: () => getTutorials({ isPaid: true, publish: true }),
  });

  // Typewriter
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(interval);
        setTimeout(() => setShowCards(true), 300);
      }
    }, 80);
    return () => clearInterval(interval);
  }, []);

  // Random glitch bursts on the title
  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 150);
      }
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="h-screen w-full home-root overflow-hidden p-0" style={{ background: "transparent" }}>

      {/* Ambient glow orbs */}
      <div className="home-orb home-orb-teal" />
      <div className="home-orb home-orb-emerald" />

      <div className="home-content h-full w-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex flex-col items-center py-12 px-4 sm:px-6">

        {/* Header */}
        <div className="home-header w-full">
          <div className="home-title-wrap">
            <h1 className={`home-title text-center${glitch ? " is-glitch" : ""}`}>
              <span className="inline sm:hidden">
                {text.slice(0, 11)}
                {text.length > 11 && <br />}
                {text.slice(11)}
              </span>
              <span className="hidden sm:inline">
                {text}
              </span>
              <span className="home-cursor" />
            </h1>
          </div>
        </div>

        {/* Main Navigation Cards */}
        <div className={`home-cards-grid grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto mt-12 ${showCards ? " opacity-100 translate-y-0" : " opacity-0 translate-y-4"} transition-all duration-700 ease-out`}>

          {/* Free Tutorials */}
          <Link href="/tutorials/list?filter=free" className="no-underline">
            <div className="home-card home-card-teal">
              <div className="home-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                  <path d="M8 7h6" /><path d="M8 11h8" />
                </svg>
              </div>
              <h2 className="home-card-title">Free Tutorials</h2>
              <p className="home-card-desc">Open Source<br />Knowledge Base</p>
              <div className="home-card-progress">
                <div className="home-card-progress-fill" />
              </div>
              <button className="home-card-btn">Initialize_Access</button>
            </div>
          </Link>

          {/* Roadmaps */}
          <Link href="/roadmaps" className="no-underline">
            <div className="home-card home-card-emerald">
              <div className="home-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 17l4-8 4 4 4-6 4 10" />
                  <path d="M3 21h18" />
                </svg>
              </div>
              <h2 className="home-card-title">Roadmaps</h2>
              <p className="home-card-desc">System Career<br />Paths</p>
              <div className="home-card-progress">
                <div className="home-card-progress-fill" />
              </div>
              <button className="home-card-btn">Execute_Path</button>
            </div>
          </Link>

          {/* Paid Tutorials Card */}
          <Link href="/tutorials/list?filter=paid" className="no-underline">
            <div className="home-card group" style={{ '--card-accent': 'var(--purple-glow)' } as any}>
              <div className="home-card-icon" style={{ color: 'var(--purple-glow)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <h2 className="home-card-title group-hover:text-purple-glow">Premium Tutorials</h2>
              <p className="home-card-desc">Advanced Core<br />Architectures</p>
              <div className="home-card-progress">
                <div className="home-card-progress-fill" style={{ background: 'var(--purple-glow)' }} />
              </div>
              <button className="home-card-btn" style={{ borderColor: 'var(--purple-glow)', color: 'var(--purple-glow)' }}>Decrypt_Premium</button>
            </div>
          </Link>

        </div>

        {/* Stats Section - 3 Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl mt-16 px-4">
          <div className="bg-surface-900/40 border border-surface-800 p-6 flex flex-col items-center gap-2 backdrop-blur-md relative overflow-hidden [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%-12px))] group hover:border-teal-glow/50 transition-colors">
            <div className="absolute top-0 left-0 w-1 h-full bg-teal-glow/20" />
            <span className="text-3xl font-digital text-teal-glow text-glow-teal">{systemStats?.tutorials?.total ?? '---'}</span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-text-secondary opacity-60 font-terminal">{"//"} Modules_Total</span>
          </div>

          <div className="bg-surface-900/40 border border-surface-800 p-6 flex flex-col items-center gap-2 backdrop-blur-md relative overflow-hidden [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%-12px))] group hover:border-emerald-glow/50 transition-colors">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-glow/20" />
            <span className="text-3xl font-digital text-emerald-glow text-glow-emerald">{systemStats?.roadmapsCount ?? '---'}</span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-text-secondary opacity-60 font-terminal">{"//"} Active_Roadmaps</span>
          </div>

          <div className="bg-surface-900/40 border border-surface-800 p-6 flex flex-col items-center gap-2 backdrop-blur-md relative overflow-hidden [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%-12px))] group hover:border-purple-glow/50 transition-colors">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-glow/20" />
            <span className="text-3xl font-digital text-purple-glow text-glow-purple">{systemStats?.quizzesCount ?? '---'}</span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-text-secondary opacity-60 font-terminal">{"//"} Verified_Quizzes</span>
          </div>
        </div>

        {/* Paid Tutorials Section */}
        {paidTutorials && paidTutorials.length > 0 && (
          <div id="paid-tutorials" className="mt-24 w-full max-w-7xl mx-auto pb-24">
            <div className="flex items-center gap-4 mb-12 px-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-purple-glow/30" />
              <h2 className="text-2xl font-digital uppercase tracking-[0.2em] text-purple-glow flex items-center gap-3">
                <span className="text-sm opacity-50">#</span> PREMIUM_RESOURCES
              </h2>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-purple-glow/30" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-4">
              {paidTutorials.map((tutorial: any) => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
