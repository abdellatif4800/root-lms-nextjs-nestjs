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
    <div ref={ref} className="relative h-2 w-full bg-surface-800 overflow-hidden">
      {/* Tick marks */}
      {[25, 50, 75].map((tick) => (
        <div
          key={tick}
          className="absolute top-0 bottom-0 w-px bg-surface-700 z-10"
          style={{ left: `${tick}%` }}
        />
      ))}
      {/* Fill */}
      <div
        className="absolute inset-y-0 left-0 transition-all duration-1000 ease-out"
        style={{
          width: `${width}%`,
          background: percentage === 100
            ? "var(--emerald-glow)"
            : "var(--teal-glow)",
          boxShadow: percentage === 100
            ? "0 0 12px rgba(16,185,129,0.7), 0 0 24px rgba(16,185,129,0.3)"
            : "0 0 12px rgba(45,212,191,0.7), 0 0 24px rgba(45,212,191,0.3)",
        }}
      />
      {/* Animated scan sweep */}
      {width > 0 && width < 100 && (
        <div
          className="absolute inset-y-0 w-8 pointer-events-none"
          style={{
            left: `${width}%`,
            background: "linear-gradient(90deg, rgba(45,212,191,0.5) 0%, transparent 100%)",
            animation: "progressPulse 2s ease-in-out infinite",
          }}
        />
      )}
    </div>
  );
}

function UnitBadge({ unit, index }: { unit: any; index: number }) {
  return (
    <div
      className="
        group/unit relative flex items-center gap-2
        border border-surface-700 bg-surface-900/50
        px-3 py-1.5
        text-[10px] font-terminal text-text-secondary
        hover:border-teal-glow/60 hover:text-text-primary
        hover:bg-surface-800/80
        transition-all duration-200 cursor-default
        opacity-0 animate-[fadeSlideIn_0.3s_ease_forwards]
      "
      style={{
        animationDelay: `${index * 40}ms`,
        clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))",
      }}
    >
      <span className="text-teal-glow/40 group-hover/unit:text-teal-glow transition-colors font-bold text-[9px]">›</span>
      <span className="uppercase tracking-wider leading-none">{unit.unitTitle}</span>
    </div>
  );
}

export function ProgressPageContent({ unitProgressByUser }: any) {
  const dispatch = useDispatch();

  const searchParams = useSearchParams();
  const userId = searchParams.get("userId")

  useEffect(() => {
    if (userId === undefined) {
      dispatch(toggleAuthModal())
      dispatch(setRequired())
      dispatch(setRedirect('user-progress-page'))
    }
  }, []);

  const data = unitProgressByUser
    ? (Array.isArray(unitProgressByUser) ? unitProgressByUser : [unitProgressByUser])
    : [];

  const totalCompleted = data.filter((item: any) => item?.isCompleted).length;

  const avgProgress = data.length > 0
    ? Math.round(data.reduce((acc: number, item: any) => acc + (item?.percentage || 0), 0) / data.length)
    : 0;

  return (
    <div className="h-[calc(100vh-80px)] w-full flex flex-col font-terminal overflow-hidden">
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "linear-gradient(var(--teal-glow) 1px, transparent 1px), linear-gradient(90deg, var(--teal-glow) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: "var(--grid-opacity)",
        }}
      />
      {/* Vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 40%, var(--vignette-color) 100%)" }}
      />

      {/* ── PAGE HEADER ── */}
      <div className="relative z-10 shrink-0 border-b border-surface-800 bg-surface-900/80 backdrop-blur-sm px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">

          {/* Title block */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-[8px] font-terminal text-text-secondary uppercase tracking-[0.35em] opacity-50">
                // SYS://NEURAL_PROGRESS
              </span>
              <h1 className="text-base font-digital font-black text-text-primary uppercase tracking-wider leading-none">
                Training_Matrix
              </h1>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-6">
            {/* Avg progress */}
            <div className="flex flex-col items-center gap-0.5">
              <span
                className="text-xl font-digital font-black text-teal-glow"
                style={{ textShadow: "0 0 10px var(--shadow-teal)" }}
              >
                {avgProgress}%
              </span>
              <span className="text-[8px] font-terminal text-text-secondary uppercase tracking-[0.2em] opacity-50">
                Avg_Load
              </span>
            </div>

            <div className="w-px h-8 bg-surface-700" />

            {/* Completed */}
            <div className="flex flex-col items-center gap-0.5">
              <span
                className="text-xl font-digital font-black text-emerald-glow"
                style={{ textShadow: "0 0 10px var(--shadow-emerald)" }}
              >
                {totalCompleted}/{data.length}
              </span>
              <span className="text-[8px] font-terminal text-text-secondary uppercase tracking-[0.2em] opacity-50">
                Decrypted
              </span>
            </div>

            <div className="w-px h-8 bg-surface-700" />

            {/* Status indicator */}
            <div className="flex items-center gap-2 border border-surface-700 px-3 py-1.5">
              <span
                className="w-1.5 h-1.5 bg-emerald-glow animate-pulse"
                style={{ boxShadow: "0 0 5px var(--shadow-emerald)" }}
              />
              <span className="text-[9px] font-terminal text-text-secondary uppercase tracking-[0.2em]">
                <span className="text-emerald-glow font-bold">ONLINE</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── SCROLLABLE CONTENT ── */}
      <div className="relative z-10 flex-1 min-h-0 overflow-y-auto custom-scrollbar p-8">
        <div className="flex flex-col gap-5 max-w-7xl mx-auto pb-12">
          {data.map((item: any, i: number) => {
            const isComplete = item.isCompleted || item.percentage === 100;
            const accentColor = isComplete ? "var(--emerald-glow)" : "var(--teal-glow)";
            const shadowColor = isComplete ? "var(--shadow-emerald)" : "var(--shadow-teal)";

            return (
              <div
                key={item.id}
                className="
                  group relative
                  bg-surface-900 border border-surface-800
                  hover:border-teal-glow/50 hover:bg-surface-800/60
                  transition-all duration-300
                  opacity-0 animate-[fadeSlideIn_0.4s_ease_forwards]
                "
                style={{
                  animationDelay: `${i * 80}ms`,
                  boxShadow: "4px 4px 0px var(--surface-800)",
                  clipPath: "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))",
                }}
              >
                {/* Hover inset glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: "linear-gradient(135deg, rgba(45,212,191,0.035) 0%, transparent 55%)" }}
                />

                {/* Left accent bar */}
                <div
                  className="absolute top-0 left-0 bottom-0 w-0.5"
                  style={{
                    background: accentColor,
                    boxShadow: `0 0 8px ${shadowColor}`,
                    opacity: isComplete ? 1 : 0.5,
                  }}
                />

                {/* Bottom sweep bar */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left"
                  style={{ background: accentColor, boxShadow: `0 0 8px ${shadowColor}` }}
                />

                <div className="p-10 flex flex-col gap-4">

                  {/* ── Header Row ── */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      {/* Status tag */}
                      <div className="flex items-center gap-2">
                        <span
                          className="w-1 h-1"
                          style={{
                            background: accentColor,
                            boxShadow: `0 0 5px ${shadowColor}`,
                            animation: !isComplete ? "homeStatusPulse 2s ease-in-out infinite" : undefined,
                          }}
                        />
                        <span
                          className="text-[8px] font-terminal uppercase tracking-[0.3em] font-bold"
                          style={{ color: accentColor }}
                        >
                          {isComplete ? "Fully_Decrypted" : "In_Progress"}
                        </span>
                      </div>
                      {/* Title */}
                      <h3
                        className="text-sm font-digital font-black text-text-primary uppercase tracking-wide leading-snug group-hover:text-teal-glow transition-colors duration-200 truncate"
                      >
                        {item.tutorial.tutorialName}
                      </h3>
                    </div>

                    {/* Percentage readout */}
                    <div className="shrink-0 flex flex-col items-end gap-0.5">
                      <span
                        className="text-2xl font-digital font-black leading-none"
                        style={{
                          color: accentColor,
                          textShadow: `0 0 14px ${shadowColor}`,
                        }}
                      >
                        {Math.floor(item.percentage)}%
                      </span>
                      <span className="text-[7px] font-terminal text-text-secondary uppercase tracking-[0.2em] opacity-40">
                        completion
                      </span>
                    </div>
                  </div>

                  {/* ── Progress Bar ── */}
                  <div className="flex flex-col gap-1.5">
                    <AnimatedBar percentage={item.percentage} />
                    {/* Tick labels */}
                    <div className="flex justify-between text-[7px] font-terminal text-text-secondary opacity-30 uppercase tracking-wider px-px">
                      <span>0</span>
                      <span>25</span>
                      <span>50</span>
                      <span>75</span>
                      <span>100</span>
                    </div>
                  </div>

                  {/* ── Units Grid ── */}
                  {item.tutorial.units?.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <span className="text-[8px] font-terminal text-text-secondary uppercase tracking-[0.3em] opacity-40">
                        // units ({item.tutorial.units.length})
                      </span>
                      <div className="flex flex-row flex-wrap gap-2">
                        {item.tutorial.units.map((unit: any, idx: number) => (
                          <UnitBadge key={unit.id} unit={unit} index={idx} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Footer Row ── */}
                  <div className="flex items-center justify-between pt-3 border-t border-surface-800 gap-4">
                    {/* Mini stat pills */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8px] font-terminal text-text-secondary uppercase tracking-wider opacity-40">
                          Units:
                        </span>
                        <span className="text-[9px] font-digital font-black text-purple-glow">
                          {item.tutorial.units?.length ?? 0}
                        </span>
                      </div>
                      <div className="w-px h-3 bg-surface-700" />
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8px] font-terminal text-text-secondary uppercase tracking-wider opacity-40">
                          ID:
                        </span>
                        <span className="text-[9px] font-digital font-black text-text-secondary opacity-50 truncate max-w-[80px]">
                          {item.tutorial.id?.slice(0, 8)}…
                        </span>
                      </div>
                    </div>

                    {/* CTA */}
                    <Link
                      href={{ pathname: `/tutorials/${item.tutorial.id}` }}
                      className="
                        relative group/btn overflow-hidden shrink-0
                        border px-5 py-2
                        text-[9px] font-digital font-black uppercase tracking-[0.2em]
                        transition-colors duration-200 active:scale-95
                      "
                      style={{
                        borderColor: accentColor,
                        color: accentColor,
                        clipPath: "polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px))",
                      }}
                    >
                      <span
                        className="absolute inset-0 translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-200 z-0"
                        style={{ background: accentColor }}
                      />
                      <span className="relative z-10 group-hover/btn:text-black transition-colors duration-200">
                        {isComplete ? "Review_Session" : "Resume_Session"}
                        <span className="ml-1.5 group-hover/btn:translate-x-1 inline-block transition-transform duration-200">→</span>
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Corner bracket decorations */}
                <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-surface-700 group-hover:border-teal-glow/50 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-surface-700 group-hover:border-teal-glow/30 transition-colors duration-300 opacity-0 group-hover:opacity-100" />

                {/* Index number */}
                <div
                  className="absolute top-2 right-8 text-[8px] font-digital text-text-secondary opacity-15 font-black"
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── FOOTER STATUS BAR ── */}
      <div className="relative z-10 shrink-0 h-8 bg-surface-900 border-t border-surface-800 px-8 flex items-center justify-between text-[9px] font-terminal">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="text-text-secondary uppercase tracking-wider opacity-50">SYSTEM_STATUS:</span>
            <span
              className="text-emerald-glow font-bold uppercase tracking-wider flex items-center gap-1.5"
              style={{ textShadow: "0 0 6px var(--shadow-emerald)" }}
            >
              <span className="w-1 h-1 bg-emerald-glow animate-pulse inline-block" />
              READY
            </span>
          </div>
          <div className="w-px h-3 bg-surface-700" />
          <div className="flex items-center gap-2">
            <span className="text-text-secondary uppercase tracking-wider opacity-50">ACCESS_LEVEL:</span>
            <span
              className="text-purple-glow font-bold uppercase tracking-wider"
              style={{ textShadow: "0 0 6px var(--shadow-purple)" }}
            >
              ROOT
            </span>
          </div>
          <div className="w-px h-3 bg-surface-700" />
          <div className="flex items-center gap-2">
            <span className="text-text-secondary uppercase tracking-wider opacity-50">MODULES:</span>
            <span className="text-teal-glow font-bold">{data.length}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 opacity-40">
          <span className="uppercase tracking-wider">v4.0.2_STABLE</span>
          <div className="w-px h-3 bg-surface-700" />
          <span className="uppercase tracking-wider">
            {new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }).toUpperCase()}
          </span>
        </div>
      </div>

    </div>
  );
}

