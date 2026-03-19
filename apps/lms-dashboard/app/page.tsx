"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useQuery, getSystemStats } from "@repo/gql";

// ─── SVG Icons ────────────────────────────────────────────────────────────────
function BookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
      <path d="M8 7h6" /><path d="M8 11h8" />
    </svg>
  );
}
function MapIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
      <path d="M3 17l4-8 4 4 4-6 4 10" /><path d="M3 21h18" />
    </svg>
  );
}
function CheckIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
function EditIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}
function ListIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}
function ClipboardIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { label: "New Tutorial", href: "/tutorials/tutorialEditor?editOrCreate=create", color: "teal", icon: BookIcon },
  { label: "New Roadmap", href: "/roadmaps/roadmapEditor?editOrCreate=create", color: "emerald", icon: MapIcon },
  { label: "View Published", href: "/tutorials/list", color: "purple", icon: ListIcon },
];

// ─── Color helpers ─────────────────────────────────────────────────────────────
const COLOR_MAP: Record<string, {
  text: string;
  border: string;
  hoverBorder: string;
  shadow: string;
  bg: string;
  gradientBg: string;
  accentBar: string;
}> = {
  teal: {
    text: "text-teal-glow",
    border: "border-teal-glow/50",
    hoverBorder: "hover:border-teal-glow/50",
    shadow: "shadow-glow-teal",
    bg: "bg-teal-glow/5",
    gradientBg: "[background:linear-gradient(135deg,rgba(45,212,191,0.06)_0%,transparent_60%)]",
    accentBar: "bg-teal-glow shadow-glow-teal-sm",
  },
  emerald: {
    text: "text-emerald-glow",
    border: "border-emerald-glow/50",
    hoverBorder: "hover:border-emerald-glow/50",
    shadow: "shadow-glow-emerald",
    bg: "bg-emerald-glow/5",
    gradientBg: "[background:linear-gradient(135deg,rgba(16,185,129,0.06)_0%,transparent_60%)]",
    accentBar: "bg-emerald-glow shadow-glow-emerald-sm",
  },
  purple: {
    text: "text-purple-glow",
    border: "border-purple-glow/50",
    hoverBorder: "hover:border-purple-glow/50",
    shadow: "shadow-glow-purple",
    bg: "bg-purple-glow/5",
    gradientBg: "[background:linear-gradient(135deg,rgba(168,85,247,0.06)_0%,transparent_60%)]",
    accentBar: "bg-purple-glow shadow-glow-purple-sm",
  },
};

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const start = performance.now();
        const initialCount = count;
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setCount(Math.floor(initialCount + ease * (target - initialCount)));
          if (p < 1) {
            animationFrameId = requestAnimationFrame(tick);
          } else {
            setCount(target);
          }
        };
        animationFrameId = requestAnimationFrame(tick);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    if (ref.current) observer.observe(ref.current);

    return () => {
      observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [target, duration]);

  return <span ref={ref}>{count}</span>;
}

// ─── Types ────────────────────────────────────────────────────────────────────
type Stat = {
  label: string;
  value: number;
  suffix: string;
  color: string;
  icon: (props: { size?: number }) => React.JSX.Element;
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ stat, index }: { stat: Stat; index: number }) {
  const c = COLOR_MAP[stat.color];
  const Icon = stat.icon;

  return (
    <div
      className={`
        group relative flex flex-col gap-3 p-4 sm:p-5
        bg-surface-900 border border-surface-800
        ${c.hoverBorder}
        transition-all duration-300 hover:-translate-y-1
        shadow-card
        [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%-12px))]
        opacity-0 animate-[fadeSlideIn_0.4s_ease_forwards]
      `}
      style={{ animationDelay: `${1600 + index * 80}ms` }}
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${c.gradientBg}`} />
      <div className={`absolute bottom-0 left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${c.accentBar}`} />

      <div className="flex items-start justify-between relative z-10">
        <span className="text-[8px] font-terminal uppercase tracking-[0.3em] text-text-secondary opacity-50">
          {"//"} {stat.label}
        </span>
        <span className={`${c.text} opacity-70`}>
          <Icon size={14} />
        </span>
      </div>

      <div className="relative z-10">
        <span className={`text-2xl sm:text-3xl font-digital font-black leading-none ${c.text} text-glow-teal`}>
          <AnimatedCounter target={stat.value} duration={1400} />
          {stat.suffix}
        </span>
      </div>

      <span className="text-[9px] font-digital font-black text-text-secondary uppercase tracking-wider relative z-10">
        {stat.label}
      </span>

      <div className={`absolute top-0 right-0 w-4 h-4 border-t border-r transition-colors duration-300 ${c.border}`} />
    </div>
  );
}

// ─── Quick Actions ────────────────────────────────────────────────────────────
function QuickActions() {
  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex items-center gap-2 opacity-0 animate-[fadeSlideIn_0.3s_ease_forwards]"
        style={{ animationDelay: "1650ms" }}
      >
        <div className="w-0.5 h-4 bg-purple-glow shadow-glow-purple-sm" />
        <span className="text-[8px] font-terminal text-text-secondary uppercase tracking-[0.3em] opacity-50">
          {"// QUICK_ACTIONS"}
        </span>
      </div>

      {QUICK_ACTIONS.map((action, i) => {
        const c = COLOR_MAP[action.color];
        const Icon = action.icon;
        return (
          <Link
            key={i}
            href={action.href}
            className={`
              group relative flex items-center gap-3 px-4 py-3
              bg-surface-900 border border-surface-800
              ${c.hoverBorder}
              hover:-translate-y-0.5 transition-all duration-200
              shadow-card
              [clip-path:polygon(0_0,calc(100%-8px)_0,100%_8px,100%_100%,8px_100%,0_calc(100%-8px))]
              opacity-0 animate-[fadeSlideIn_0.3s_ease_forwards]
            `}
            style={{ animationDelay: `${1700 + i * 80}ms` }}
          >
            <div className={`absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 z-0 ${c.bg}`} />
            <span className={`relative z-10 transition-colors duration-200 ${c.text}`}>
              <Icon size={15} />
            </span>
            <span className="relative z-10 text-[10px] font-digital font-black uppercase tracking-wider text-text-secondary group-hover:text-text-primary transition-colors duration-200">
              {action.label}
            </span>
            <span className={`relative z-10 ml-auto text-[10px] font-digital translate-x-0 group-hover:translate-x-1 transition-all duration-200 opacity-0 group-hover:opacity-100 ${c.text}`}>
              →
            </span>
          </Link>
        );
      })}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Page() {
  const { data: systemStats, isLoading } = useQuery({
    queryKey: ["systemStats"],
    queryFn: getSystemStats,
  });

  console.log("System Stats:", systemStats);

  const STATS = [
    { label: "Tutorials", value: systemStats?.tutorials.total ?? 0, suffix: "", color: "teal", icon: BookIcon },
    { label: "Roadmaps", value: systemStats?.roadmapsCount ?? 0, suffix: "", color: "emerald", icon: MapIcon },
    { label: "Quizzes", value: systemStats?.quizzesCount ?? 0, suffix: "", color: "purple", icon: ClipboardIcon },
    { label: "Published", value: systemStats?.tutorials.published ?? 0, suffix: "", color: "emerald", icon: CheckIcon },
    { label: "Drafts", value: systemStats?.tutorials.draft ?? 0, suffix: "", color: "teal", icon: EditIcon },
  ];

  return (
    <div className="h-full w-full overflow-y-auto custom-scrollbar font-terminal">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 pb-12">

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>

        {/* ── QUICK ACTIONS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <QuickActions />
          </div>
        </div>

      </div>
    </div>
  );
}
