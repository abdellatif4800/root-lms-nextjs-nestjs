"use client";
import { setRedirect, setRequired, toggleAuthModal, useDispatch } from "@repo/reduxSetup";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

function AnimatedBar({ percentage }: { percentage: number }) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setTimeout(() => setWidth(percentage), 100);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [percentage]);

  return (
    <div ref={ref} className="relative h-4 w-full bg-background border-2 border-ink p-[2px] overflow-hidden">
      <div
        className="h-full bg-teal-primary transition-all duration-1000 ease-out"
        style={{ width: `${width}%` }}
      />
      {/* Grid lines on top of the bar */}
      <div className="absolute inset-0 flex justify-between pointer-events-none px-4">
         <div className="w-px h-full bg-ink/10" />
         <div className="w-px h-full bg-ink/10" />
         <div className="w-px h-full bg-ink/10" />
      </div>
    </div>
  );
}

function UnitBadge({ unit }: { unit: any; index: number }) {
  return (
    <div className="badge-tape flex items-center gap-2 border border-ink/20">
      <span className="opacity-40">Section:</span>
      <span className="font-bold">{unit.unitTitle}</span>
    </div>
  );
}

function QuizProgressCard({ item }: { item: any; index: number }) {
  const isComplete = item.isCompleted || item.score >= (item.quiz?.passMark || 70);

  return (
    <div className={`wire-card flex flex-col gap-4 p-8 ${isComplete ? 'border-teal-primary shadow-wire-teal' : ''}`}>
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <span className={`text-[10px] font-mono font-black uppercase tracking-widest ${isComplete ? 'text-teal-primary' : 'text-dust'}`}>
            {isComplete ? "Passed" : "Needs Review"}
          </span>
          <h3 className="text-lg font-black text-ink uppercase tracking-tighter leading-tight truncate max-w-[200px]">
            {item.quiz?.title || "Assessment"}
          </h3>
        </div>
        <div className="flex flex-col items-end">
          <span className={`text-3xl font-black ${isComplete ? 'text-teal-primary' : 'text-ink'}`}>
            {item.score}%
          </span>
          <span className="text-[8px] font-mono font-bold text-dust uppercase">Score</span>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t-2 border-dashed border-ink/5 flex justify-between items-center">
        <span className="text-[9px] font-mono font-bold text-dust uppercase">
          {new Date(item.updatedAt).toLocaleDateString()}
        </span>
        <Link
          href={`/quizzes/${item.quizId}`}
          className="btn-wire text-[10px] px-4 py-1.5"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
}

export function ProgressPageContent({ unitProgressByUser, quizProgressByUser }: any) {
  const [activeTab, setActiveTab] = useState<"tutorials" | "quizzes">("tutorials");
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId")

  useEffect(() => {
    if (!userId) {
      dispatch(toggleAuthModal())
      dispatch(setRequired())
      dispatch(setRedirect('user-progress-page'))
    }
  }, [userId, dispatch]);

  const tutorialsData = unitProgressByUser
    ? (Array.isArray(unitProgressByUser) ? unitProgressByUser : [unitProgressByUser])
    : [];

  const quizzesData = quizProgressByUser
    ? (Array.isArray(quizProgressByUser) ? quizProgressByUser : [quizProgressByUser])
    : [];

  const totalTutorialsCompleted = tutorialsData.filter((item: any) => item?.isCompleted).length;
  const avgProgress = tutorialsData.length > 0
    ? Math.round(tutorialsData.reduce((acc: number, item: any) => acc + (item?.percentage || 0), 0) / tutorialsData.length)
    : 0;

  return (
    <div className="min-h-full w-full flex flex-col font-sans">
      
      {/* ── Header ── */}
      <div className="relative z-10 shrink-0 border-b-2 border-ink bg-surface shadow-wire px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">

          <div className="flex items-center gap-10">
            <div className="flex flex-col">
              <span className="badge-tape w-fit mb-2">Student Dashboard</span>
              <h1 className="text-3xl font-black text-ink uppercase tracking-tighter leading-none">
                My Progress
              </h1>
            </div>

            <div className="flex border-2 border-ink bg-background p-1 shadow-[2px_2px_0px_0px_rgba(19,21,22,1)]">
              <button
                onClick={() => setActiveTab("tutorials")}
                className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "tutorials" ? "bg-ink text-background" : "text-dust hover:text-ink"}`}
              >
                Lessons
              </button>
              <button
                onClick={() => setActiveTab("quizzes")}
                className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "quizzes" ? "bg-ink text-background" : "text-dust hover:text-ink"}`}
              >
                Quizzes
              </button>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-teal-primary leading-none">
                {avgProgress}%
              </span>
              <span className="text-[8px] font-mono font-bold text-dust uppercase tracking-widest">Avg Completion</span>
            </div>
            
            <div className="w-px h-10 bg-ink/10" />

            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-ink leading-none">
                {totalTutorialsCompleted}/{tutorialsData.length}
              </span>
              <span className="text-[8px] font-mono font-bold text-dust uppercase tracking-widest">Finished</span>
            </div>

            <div className="w-px h-10 bg-ink/10" />

            <div className="flex items-center gap-2 border-2 border-ink px-4 py-2 bg-background/50">
              <div className="w-2 h-2 bg-teal-primary shadow-[1px_1px_0px_0px_rgba(19,21,22,1)] animate-pulse" />
              <span className="text-[10px] font-mono font-black text-ink uppercase">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex-1 p-8">
        <div className="max-w-7xl mx-auto pb-20">
          {activeTab === "tutorials" ? (
            <div className="flex flex-col gap-8">
              {tutorialsData.map((item: any, i: number) => {
                const isComplete = item.isCompleted || item.percentage === 100;

                return (
                  <div
                    key={item.id}
                    className={`wire-card flex flex-col md:flex-row ${isComplete ? 'border-teal-primary shadow-wire-teal' : ''}`}
                  >
                    <div className="p-10 flex-1 flex flex-col gap-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 border border-ink ${isComplete ? 'bg-ink' : 'bg-teal-primary'}`} />
                            <span className={`text-[10px] font-mono font-black uppercase tracking-widest ${isComplete ? 'text-ink' : 'text-teal-primary'}`}>
                              {isComplete ? "Lesson Completed" : "Currently Learning"}
                            </span>
                          </div>
                          <h3 className="text-2xl font-black text-ink uppercase tracking-tighter leading-tight group-hover:text-teal-primary transition-colors">
                            {item.tutorial.tutorialName}
                          </h3>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`text-4xl font-black leading-none ${isComplete ? 'text-ink' : 'text-teal-primary'}`}>
                            {Math.floor(item.percentage)}%
                          </span>
                          <span className="text-[10px] font-mono font-bold text-dust uppercase">Progress</span>
                        </div>
                      </div>

                      <AnimatedBar percentage={item.percentage} />

                      {item.tutorial.units?.length > 0 && (
                        <div className="flex flex-col gap-3">
                          <span className="text-[10px] font-mono font-black text-dust uppercase tracking-widest">Recent Sections</span>
                          <div className="flex flex-wrap gap-2">
                            {item.tutorial.units.slice(0, 5).map((unit: any, idx: number) => (
                              <UnitBadge key={unit.id} unit={unit} index={idx} />
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-6 border-t-2 border-dashed border-ink/5">
                        <div className="flex items-center gap-6">
                          <div className="flex flex-col">
                            <span className="text-[8px] font-mono font-bold text-dust uppercase">Ref ID</span>
                            <span className="text-[10px] font-mono font-black text-ink truncate max-w-[100px]">{item.tutorial.id?.slice(0, 8)}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[8px] font-mono font-bold text-dust uppercase">Sections</span>
                            <span className="text-[10px] font-mono font-black text-ink">{item.tutorial.units?.length ?? 0}</span>
                          </div>
                        </div>
                        <Link href={{ pathname: `/tutorials/${item.tutorial.id}` }} className={isComplete ? 'btn-wire' : 'btn-wire-teal'}>
                          <span className="px-4 uppercase font-black text-[10px] tracking-widest">
                            {isComplete ? "Review Content" : "Continue Learning →"}
                          </span>
                        </Link>
                      </div>
                    </div>
                    {/* Index marker */}
                    <div className="hidden md:flex w-16 border-l-2 border-ink bg-surface items-center justify-center font-mono font-black text-ink/10 text-4xl select-none">
                       {String(i + 1).padStart(2, "0")}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {quizzesData.map((item: any, i: number) => (
                <QuizProgressCard key={item.id} item={item} index={i} />
              ))}
              {quizzesData.length === 0 && (
                <div className="col-span-full py-24 text-center border-2 border-ink border-dashed rounded-none">
                  <span className="text-xs font-bold text-dust uppercase tracking-widest">
                    No assessment history found.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="relative z-10 shrink-0 h-10 bg-surface border-t-2 border-ink px-8 flex items-center justify-between text-[10px] font-mono font-bold text-dust">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="opacity-50">STATUS:</span>
            <span className="text-ink uppercase flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-teal-primary animate-pulse" />
              SYSTEM_READY
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="opacity-50">VER:</span>
            <span className="text-ink">4.0.2</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="uppercase tracking-widest">
            {new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }).toUpperCase()}
          </span>
        </div>
      </div>

    </div>
  );
}
