"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import "@repo/ui/styles.css";
import { useQuery, getSystemStats, getTutorials } from "@repo/gql";
import { TutorialCard } from "@repo/ui";

export default function Home() {
  const [showCards, setShowCards] = useState(false);

  const { data: systemStats } = useQuery({
    queryKey: ["systemStats"],
    queryFn: getSystemStats,
  });

  const { data: paidTutorials } = useQuery({
    queryKey: ["paidTutorials"],
    queryFn: () => getTutorials({ isPaid: true, publish: true }),
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowCards(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen w-full relative font-sans text-ink overflow-auto  scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">


      <div className="relative z-10 w-full min-h-full max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 flex flex-col items-center justify-center gap-6 sm:gap-8 md:gap-10">



        {/* Hero Section */}
        <header className="w-full flex flex-col items-center gap-3 sm:gap-4 text-center relative shrink-0">
          <div className="inline-block border-2 border-ink px-3 py-0.5 sm:px-4 sm:py-1 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] bg-surface/50 rotate-[-1deg] md:translate-x-4">
            Welcome_to_the_Library
          </div>

          <div className="relative">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-none [letter-spacing:-0.05em] uppercase text-teal-primary">
              <span className=" mr-2">&gt;./</span>
              Root_lms
            </h1>
            <div className="absolute -right-8 -top-4 w-12 h-12 border-2 border-dashed border-teal-primary rounded-full opacity-40 animate-spin-slow hidden lg:block" />
          </div>

          <p className="max-w-xl text-sm sm:text-base text-dust font-medium leading-relaxed font-sans opacity-80 px-4">
            A specialized environment for skill acquisition. <br className="hidden sm:block" />
            Initialize a sequence, track telemetry, and optimize growth.
          </p>
        </header>

        {/* Main Navigation - "Weird Wireframe" Grid */}
        <section className={`grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full transition-all duration-700 ease-out shrink-0 ${showCards ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

          {/* Card: Free Lessons */}
          <Link href="/tutorials/list?filter=free" className="wire-card group p-5 sm:p-8 flex flex-col items-start gap-6 sm:gap-8 relative overflow-hidden">
            {/* Draft annotations */}
            <div className="absolute top-0 right-0 border-l-2 border-b-2 border-ink px-2 py-0.5 sm:px-3 sm:py-1 font-mono text-[7px] sm:text-[8px] opacity-20 group-hover:opacity-100 transition-opacity">
              Manual_01.pdf
            </div>

            <div className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-dashed border-ink flex items-center justify-center text-teal-primary group-hover:border-teal-primary transition-colors">
              <svg width="24" height="24" className="sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" /></svg>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <h2 className="text-xl sm:text-2xl font-black uppercase">Free Lessons</h2>
              <p className="text-xs sm:text-sm text-dust leading-snug">Public courses for everyone. Jump in and start learning right away.</p>
            </div>

            <div className="mt-auto w-full flex items-center justify-between">
              <span className="btn-wire text-[10px] sm:text-xs px-3 py-1.5 sm:px-4 sm:py-2">View Lessons</span>
              <span className="font-mono text-[10px] opacity-30">FREE_CONTENT</span>
            </div>
          </Link>

          {/* Card: Learning Paths */}
          <Link href="/roadmaps" className="wire-card group p-5 sm:p-8 flex flex-col items-start gap-6 sm:gap-8 border-teal-primary/20 shadow-wire-teal hover:border-ink hover:shadow-wire">
            <div className="absolute top-0 right-0 border-l-2 border-b-2 border-teal-primary px-2 py-0.5 sm:px-3 sm:py-1 font-mono text-[7px] sm:text-[8px] text-teal-primary opacity-40">
              Guide_Book
            </div>

            <div className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-ink flex items-center justify-center text-teal-primary bg-background/50 group-hover:bg-teal-primary group-hover:text-background transition-all">
              <svg width="24" height="24" className="sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 17l4-8 4 4 4-6 4 10" /></svg>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <h2 className="text-xl sm:text-2xl font-black uppercase">Study Paths</h2>
              <p className="text-xs sm:text-sm text-dust leading-snug">Step-by-step guides to help you reach your goals from start to finish.</p>
            </div>

            <div className="mt-auto w-full flex items-center justify-between">
              <span className="btn-wire-teal text-[10px] sm:text-xs px-3 py-1.5 sm:px-4 sm:py-2">See Paths</span>
              <span className="font-mono text-[10px] opacity-30 text-teal-primary">GUIDED_STUDY</span>
            </div>
          </Link>

          {/* Card: Expert Courses */}
          <Link href="/tutorials/list?filter=paid" className="wire-card group p-5 sm:p-8 flex flex-col items-start gap-6 sm:gap-8 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-teal-primary opacity-5 rotate-45 pointer-events-none" />

            <div className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-ink flex items-center justify-center text-teal-primary group-hover:border-teal-primary transition-colors">
              <svg width="24" height="24" className="sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <h2 className="text-xl sm:text-2xl font-black uppercase">Premium</h2>
              <p className="text-xs sm:text-sm text-dust leading-snug">Expert-led courses and advanced material for professional growth.</p>
            </div>

            <div className="mt-auto w-full flex items-center justify-between">
              <span className="btn-wire text-[10px] sm:text-xs px-3 py-1.5 sm:px-4 sm:py-2">See Premium</span>
              <span className="font-mono text-[10px] opacity-30">PRO_CONTENT</span>
            </div>
          </Link>
        </section>

        {/* Stats Section - Modular Grid */}
        <section className="w-full grid grid-cols-1 sm:grid-cols-3 gap-0 border-2 border-ink bg-surface shadow-wire shrink-0">
          <div className="flex flex-col gap-1 p-4 sm:p-6 md:p-8 border-r-2 border-b-2 sm:border-b-0 border-ink">
            <span className="text-2xl sm:text-3xl md:text-4xl font-mono font-black">{systemStats?.tutorials?.total ?? '00'}</span>
            <span className="text-[8px] sm:text-[10px] font-mono font-bold text-dust uppercase tracking-widest">Lessons Available</span>
          </div>
          <div className="flex flex-col gap-1 p-4 sm:p-6 md:p-8 border-r-2 border-b-2 sm:border-b-0 border-ink">
            <span className="text-2xl sm:text-3xl md:text-4xl font-mono font-black">{systemStats?.roadmapsCount ?? '00'}</span>
            <span className="text-[8px] sm:text-[10px] font-mono font-bold text-dust uppercase tracking-widest">Study Paths</span>
          </div>
          <div className="flex flex-col gap-1 p-4 sm:p-6 md:p-8">
            <span className="text-2xl sm:text-3xl md:text-4xl font-mono font-black">{systemStats?.quizzesCount ?? '00'}</span>
            <span className="text-[8px] sm:text-[10px] font-mono font-bold text-dust uppercase tracking-widest">Quizzes Passed</span>
          </div>
        </section>

      </div>
    </div>
  );
}
