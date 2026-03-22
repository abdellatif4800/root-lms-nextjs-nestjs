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
    <div className="min-h-full w-full relative font-sans text-ink">

      {/* Drafting Lines - Vertical */}
      {/* <div className="absolute inset-0 z-0 pointer-events-none border-x-2 border-ink/5 mx-auto max-w-7xl h-full" /> */}

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 flex flex-col items-center gap-12 sm:gap-20">

        {/* Hero Section */}
        <header className="w-full flex flex-col items-center gap-6 pt-12 text-center relative">

          <div className="inline-block border-2 border-ink px-4 py-1 font-mono text-xs uppercase tracking-[0.2em] bg-surface/50 rotate-[-1deg] translate-x-4">
            Welcome to the Library
          </div>

          <div className="relative">
            <h1 className="text-5xl sm:text-8xl font-black tracking-tighter leading-none [letter-spacing:-0.05em] uppercase text-teal-primary">
              <span className=" mr-2">&gt;./</span>
              Root_lms
            </h1>
            <div className="absolute -right-8 -top-4 w-12 h-12 border-2 border-dashed border-teal-primary rounded-full opacity-40 animate-spin-slow hidden sm:block" />
          </div>

          <p className="max-w-xl text-lg text-dust font-medium leading-relaxed font-sans">
            A simple space designed for you to grow your skills. <br className="hidden sm:block" />
            Pick a course, start a lesson, and track your progress.
          </p>

          {/* Weird "Sketch" arrow utility */}
          <div className="hidden lg:block absolute left-20 bottom-0 text-teal-primary rotate-[-45deg] opacity-60">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
            <span className="font-mono text-[10px] uppercase">Start_Browsing</span>
          </div>
        </header>

        {/* Main Navigation - "Weird Wireframe" Grid */}
        <section className={`grid grid-cols-1 md:grid-cols-3 gap-8 w-full transition-all duration-700 ease-out ${showCards ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

          {/* Card: Free Lessons */}
          <Link href="/tutorials/list?filter=free" className="wire-card group p-8 flex flex-col items-start gap-8 relative overflow-hidden">
            {/* Draft annotations */}
            <div className="absolute top-0 right-0 border-l-2 border-b-2 border-ink px-3 py-1 font-mono text-[8px] opacity-20 group-hover:opacity-100 transition-opacity">
              Manual_01.pdf
            </div>

            <div className="w-16 h-16 border-2 border-dashed border-ink flex items-center justify-center text-teal-primary group-hover:border-teal-primary transition-colors">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" /></svg>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase">Free Lessons</h2>
              <p className="text-sm text-dust leading-snug">Public courses for everyone. Jump in and start learning right away.</p>
            </div>

            <div className="mt-auto w-full flex items-center justify-between">
              <span className="btn-wire text-xs px-4 py-2">View Lessons</span>
              <span className="font-mono text-xs opacity-30">FREE_CONTENT</span>
            </div>
          </Link>

          {/* Card: Learning Paths */}
          <Link href="/roadmaps" className="wire-card group p-8 flex flex-col items-start gap-8 border-teal-primary/20 shadow-wire-teal hover:border-ink hover:shadow-wire">
            <div className="absolute top-0 right-0 border-l-2 border-b-2 border-teal-primary px-3 py-1 font-mono text-[8px] text-teal-primary opacity-40">
              Guide_Book
            </div>

            <div className="w-16 h-16 border-2 border-ink flex items-center justify-center text-teal-primary bg-background/50 group-hover:bg-teal-primary group-hover:text-background transition-all">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 17l4-8 4 4 4-6 4 10" /></svg>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase">Study Paths</h2>
              <p className="text-sm text-dust leading-snug">Step-by-step guides to help you reach your goals from start to finish.</p>
            </div>

            <div className="mt-auto w-full flex items-center justify-between">
              <span className="btn-wire-teal text-xs px-4 py-2">See Paths</span>
              <span className="font-mono text-xs opacity-30 text-teal-primary">GUIDED_STUDY</span>
            </div>
          </Link>

          {/* Card: Expert Courses */}
          <Link href="/tutorials/list?filter=paid" className="wire-card group p-8 flex flex-col items-start gap-8 relative overflow-hidden">
            {/* Diagonal stripe "Draft" texture in corner */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-teal-primary opacity-5 rotate-45 pointer-events-none" />

            <div className="w-16 h-16 border-2 border-ink flex items-center justify-center text-teal-primary group-hover:border-teal-primary transition-colors">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase">Premium</h2>
              <p className="text-sm text-dust leading-snug">Expert-led courses and advanced material for professional growth.</p>
            </div>

            <div className="mt-auto w-full flex items-center justify-between">
              <span className="btn-wire text-xs px-4 py-2">See Premium</span>
              <span className="font-mono text-xs opacity-30">PRO_CONTENT</span>
            </div>
          </Link>
        </section>

        {/* Stats Section - Modular Grid */}
        <section className="w-full grid grid-cols-1 sm:grid-cols-3 gap-0 border-2 border-ink bg-surface shadow-wire">
          <div className="flex flex-col gap-1 p-8 border-r-2 border-b-2 sm:border-b-0 border-ink">
            <span className="text-4xl font-mono font-black">{systemStats?.tutorials?.total ?? '00'}</span>
            <span className="text-[10px] font-mono font-bold text-dust uppercase tracking-widest">Lessons Available</span>
          </div>
          <div className="flex flex-col gap-1 p-8 border-r-2 border-b-2 sm:border-b-0 border-ink">
            <span className="text-4xl font-mono font-black">{systemStats?.roadmapsCount ?? '00'}</span>
            <span className="text-[10px] font-mono font-bold text-dust uppercase tracking-widest">Study Paths</span>
          </div>
          <div className="flex flex-col gap-1 p-8">
            <span className="text-4xl font-mono font-black">{systemStats?.quizzesCount ?? '00'}</span>
            <span className="text-[10px] font-mono font-bold text-dust uppercase tracking-widest">Quizzes Passed</span>
          </div>
        </section>

        {/* Premium Resources Feed */}
        {paidTutorials && paidTutorials.length > 0 && (
          <section className="w-full pb-20">
            <div className="flex items-center gap-6 mb-12">
              <h2 className="text-2xl font-black uppercase whitespace-nowrap">Latest Lessons</h2>
              <div className="flex-1 h-px bg-ink/20" />
              <div className="font-mono text-[10px] text-dust border border-ink px-2 py-1">COLLECTION_V1</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {paidTutorials.slice(0, 5).map((tutorial: any) => (
                <div key={tutorial.id} className="relative transition-transform hover:-translate-y-2">
                  <TutorialCard tutorial={tutorial} />
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
