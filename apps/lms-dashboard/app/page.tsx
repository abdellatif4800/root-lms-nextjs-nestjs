"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useQuery, getSystemStats } from "@repo/gql";

// ─── SVG Icons ────────────────────────────────────────────────────────────────
function BookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
      <path d="M8 7h6" /><path d="M8 11h8" />
    </svg>
  );
}
function MapIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
      <path d="M3 17l4-8 4 4 4-6 4 10" /><path d="M3 21h18" />
    </svg>
  );
}
function CheckIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
function EditIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}
function ListIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}
function ClipboardIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { label: "New Tutorial", href: "/tutorials/tutorialEditor?editOrCreate=create", color: "teal", icon: BookIcon },
  { label: "New Roadmap", href: "/roadmaps/roadmapEditor?editOrCreate=create", color: "ink", icon: MapIcon },
  { label: "View Published", href: "/tutorials/list", color: "ink", icon: ListIcon },
];

// ─── Color helpers ─────────────────────────────────────────────────────────────
const COLOR_MAP: Record<string, {
  text: string;
  border: string;
  shadow: string;
  bg: string;
  accent: string;
}> = {
  teal: {
    text: "text-teal-primary",
    border: "border-teal-primary",
    shadow: "shadow-wire-teal",
    bg: "bg-teal-primary/5",
    accent: "bg-teal-primary",
  },
  ink: {
    text: "text-ink",
    border: "border-ink",
    shadow: "shadow-wire",
    bg: "bg-ink/5",
    accent: "bg-ink",
  },
  dust: {
    text: "text-dust",
    border: "border-ink",
    shadow: "shadow-wire",
    bg: "bg-surface",
    accent: "bg-dust",
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
  const c = COLOR_MAP[stat.color] || COLOR_MAP.ink;
  const Icon = stat.icon;

  return (
    <div
      className={`
        group relative flex flex-col gap-3 p-5
        wire-card
        ${stat.color === 'teal' ? 'border-teal-primary shadow-wire-teal hover:shadow-[6px_6px_0px_0px_rgba(13,148,136,1)]' : ''}
        transition-all duration-300
        opacity-0 animate-[fadeSlideIn_0.4s_ease_forwards]
      `}
      style={{ animationDelay: `${200 + index * 80}ms` }}
    >
      {/* Drafting Corner Decor */}
      <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 ${c.border} opacity-20 group-hover:opacity-100 transition-opacity`} />
      
      <div className="flex items-start justify-between relative z-10">
        <span className="text-[9px] font-mono font-black uppercase tracking-[0.2em] text-dust">
          {"//"} {stat.label}
        </span>
        <span className={`${c.text} opacity-60 group-hover:opacity-100 transition-opacity`}>
          <Icon size={14} />
        </span>
      </div>

      <div className="relative z-10 flex items-baseline gap-1 mt-1">
        <span className={`text-4xl font-mono font-black leading-none ${c.text}`}>
          <AnimatedCounter target={stat.value} duration={1400} />
        </span>
        <span className="text-[10px] font-mono font-black text-dust uppercase">
          {stat.suffix}
        </span>
      </div>

      {/* Progress Line */}
      <div className="mt-4 h-1.5 w-full bg-ink/5 relative overflow-hidden border border-ink/10">
        <div 
          className={`absolute inset-0 ${c.accent} origin-left transition-transform duration-1000 ease-out`}
          style={{ transform: `scaleX(${stat.value > 0 ? 1 : 0})` }}
        />
      </div>
    </div>
  );
}

// ─── Quick Actions ────────────────────────────────────────────────────────────
function QuickActions() {
  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex items-center gap-3 opacity-0 animate-[fadeSlideIn_0.3s_ease_forwards]"
        style={{ animationDelay: "600ms" }}
      >
        <div className="w-1 h-5 bg-teal-primary" />
        <span className="text-[10px] font-mono font-black text-ink uppercase tracking-[0.3em]">
          QUICK_COMMANDS
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {QUICK_ACTIONS.map((action, i) => {
          const isTeal = action.color === 'teal';
          const Icon = action.icon;
          return (
            <Link
              key={i}
              href={action.href}
              className={`
                ${isTeal ? 'btn-wire-teal' : 'btn-wire'}
                group flex items-center gap-4 px-6 py-4 text-[11px]
                opacity-0 animate-[fadeSlideIn_0.3s_ease_forwards]
              `}
              style={{ animationDelay: `${650 + i * 80}ms` }}
            >
              <Icon size={18} />
              <span className="tracking-widest">{action.label}</span>
              <span className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                →
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Page() {
  const { data: systemStats, isLoading } = useQuery({
    queryKey: ["systemStats"],
    queryFn: getSystemStats,
  });

  const STATS = [
    { label: "Tutorials", value: systemStats?.tutorials.total ?? 0, suffix: "Units", color: "teal", icon: BookIcon },
    { label: "Roadmaps", value: systemStats?.roadmapsCount ?? 0, suffix: "Maps", color: "ink", icon: MapIcon },
    { label: "Quizzes", value: systemStats?.quizzesCount ?? 0, suffix: "Tests", color: "ink", icon: ClipboardIcon },
    { label: "Published", value: systemStats?.tutorials.published ?? 0, suffix: "Live", color: "teal", icon: CheckIcon },
    { label: "Drafts", value: systemStats?.tutorials.draft ?? 0, suffix: "Pending", color: "dust", icon: EditIcon },
  ];

  return (
    <div className="h-full w-full overflow-y-auto custom-scrollbar bg-surface/30">
      <div className="max-w-7xl mx-auto p-6 sm:p-10 flex flex-col gap-10">

        {/* ── HEADER ── */}
        <div className="flex flex-col gap-2 border-b-2 border-ink pb-6">
          <h1 className="text-3xl font-mono font-black text-ink tracking-tighter uppercase">
            System_Diagnostics
          </h1>
          <div className="flex items-center gap-4 text-[10px] font-mono font-bold text-dust uppercase tracking-widest">
            <span>Terminal: DASH_01</span>
            <span className="w-1 h-1 bg-ink rounded-full" />
            <span>Status: Ready</span>
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-5 gap-6">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>

        {/* ── QUICK ACTIONS ── */}
        <div className="mt-4">
          <QuickActions />
        </div>

      </div>
    </div>
  );
}
