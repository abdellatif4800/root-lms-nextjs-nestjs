"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─── Mock Data (replace with real queries) ───────────────────────────────────
const STATS = [
  { label: "Tutorials", value: 248, suffix: "", color: "teal", icon: BookIcon },
  { label: "Roadmaps", value: 12, suffix: "", color: "emerald", icon: MapIcon },
  { label: "Published", value: 194, suffix: "", color: "purple", icon: CheckIcon },
  { label: "Drafts", value: 54, suffix: "", color: "teal", icon: EditIcon },
];

const ACTIVITY_LOG = [
  { time: "00:04:12", type: "PUBLISH", msg: "Tutorial 'React Hooks Deep Dive' set to LIVE", color: "emerald" },
  { time: "00:11:37", type: "CREATE", msg: "New roadmap 'Full Stack 2025' initialized", color: "teal" },
  { time: "00:23:09", type: "EDIT", msg: "Unit 'CSS Grid Mastery' content updated", color: "purple" },
  { time: "00:31:55", type: "ENROLL", msg: "User #4821 enrolled in 'TypeScript Fundamentals'", color: "emerald" },
  { time: "00:44:02", type: "DRAFT", msg: "Tutorial 'Web3 Basics' moved to DRAFT", color: "teal" },
  { time: "01:02:18", type: "DELETE", msg: "Roadmap node 'Legacy PHP' removed from path", color: "red" },
  { time: "01:15:44", type: "ENROLL", msg: "User #5032 enrolled in 'Node.js Advanced'", color: "emerald" },
  { time: "01:28:30", type: "PUBLISH", msg: "Tutorial 'Docker Essentials' set to LIVE", color: "emerald" },
];

const TOP_TUTORIALS = [
  { title: "React Hooks Deep Dive", enrollments: 1842, completion: 78, category: "Frontend" },
  { title: "TypeScript Fundamentals", enrollments: 1503, completion: 65, category: "Language" },
  { title: "Node.js Advanced Patterns", enrollments: 1290, completion: 54, category: "Backend" },
  { title: "Docker Essentials", enrollments: 987, completion: 82, category: "DevOps" },
  { title: "CSS Grid Mastery", enrollments: 854, completion: 91, category: "Frontend" },
];

const QUICK_ACTIONS = [
  { label: "New Tutorial", href: "/tutorials/tutorialEditor?editOrCreate=create", color: "teal", icon: BookIcon },
  { label: "New Roadmap", href: "/roadmaps/roadmapEditor?editOrCreate=create", color: "emerald", icon: MapIcon },
  { label: "View Published", href: "/tutorials/list", color: "purple", icon: ListIcon },
];

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

// ─── Color helpers ────────────────────────────────────────────────────────────
const COLOR_MAP: Record<string, { css: string; shadow: string; bg: string }> = {
  teal: { css: "var(--teal-glow)", shadow: "var(--shadow-teal)", bg: "rgba(45,212,191,0.06)" },
  emerald: { css: "var(--emerald-glow)", shadow: "var(--shadow-emerald)", bg: "rgba(16,185,129,0.06)" },
  purple: { css: "var(--purple-glow)", shadow: "var(--shadow-purple)", bg: "rgba(168,85,247,0.06)" },
  red: { css: "#f87171", shadow: "rgba(248,113,113,0.3)", bg: "rgba(248,113,113,0.06)" },
};

// ─── Boot Sequence ────────────────────────────────────────────────────────────
const BOOT_LINES = [
  { text: "> INITIALIZING ADMIN PANEL...", delay: 0 },
  { text: "> LOADING MODULE REGISTRY...", delay: 300 },
  { text: "> AUTHENTICATING ROOT ACCESS...", delay: 600 },
  { text: "> SYNCING CONTENT DATABASE...", delay: 900 },
  { text: "> ALL SYSTEMS NOMINAL. ACCESS GRANTED.", delay: 1200, accent: true },
];

function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines(i + 1);
        if (i === BOOT_LINES.length - 1) {
          setTimeout(() => { setDone(true); setTimeout(onComplete, 400); }, 600);
        }
      }, line.delay);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`flex flex-col gap-1.5 transition-opacity duration-400 ${done ? "opacity-0" : "opacity-100"}`}>
      {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
        <div
          key={i}
          className="flex items-center gap-2 opacity-0 animate-[fadeSlideIn_0.2s_ease_forwards]"
        >
          <span
            className="text-[11px] font-terminal"
            style={{ color: line.accent ? "var(--emerald-glow)" : "var(--text-secondary)" }}
          >
            {line.text}
          </span>
          {i === visibleLines - 1 && !done && (
            <span className="inline-block w-2 h-3 bg-teal-glow animate-[homeBlink_1s_step-end_infinite]" />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setCount(Math.floor(ease * target));
          if (p < 1) requestAnimationFrame(tick);
          else setCount(target);
        };
        requestAnimationFrame(tick);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}</span>;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ stat, index }: { stat: typeof STATS[0]; index: number }) {
  const c = COLOR_MAP[stat.color];
  const Icon = stat.icon;

  return (
    <div
      className="
        group relative flex flex-col gap-3 p-5
        bg-surface-900 border border-surface-800
        hover:border-opacity-60 transition-all duration-300
        hover:-translate-y-1
        opacity-0 animate-[fadeSlideIn_0.4s_ease_forwards]
      "
      style={{
        animationDelay: `${1600 + index * 80}ms`,
        boxShadow: "4px 4px 0px var(--surface-800)",
        clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
        borderColor: "var(--surface-800)",
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = c.css)}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--surface-800)")}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${c.bg} 0%, transparent 60%)` }} />

      {/* Bottom accent bar */}
      <div className="absolute bottom-0 left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left"
        style={{ background: c.css, boxShadow: `0 0 8px ${c.shadow}` }} />

      {/* Top row */}
      <div className="flex items-start justify-between relative z-10">
        <span className="text-[8px] font-terminal uppercase tracking-[0.3em] text-text-secondary opacity-50">
          {"//"} {stat.label}
        </span>
        <span style={{ color: c.css, opacity: 0.7 }}>
          <Icon size={14} />
        </span>
      </div>

      {/* Value */}
      <div className="relative z-10">
        <span
          className="text-3xl font-digital font-black leading-none"
          style={{ color: c.css, textShadow: `0 0 16px ${c.shadow}` }}
        >
          <AnimatedCounter target={stat.value} duration={1400} />
          {stat.suffix}
        </span>
      </div>

      {/* Label */}
      <span className="text-[9px] font-digital font-black text-text-secondary uppercase tracking-wider relative z-10">
        {stat.label}
      </span>

      {/* Corner bracket */}
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r transition-colors duration-300 border-surface-700 group-hover:opacity-100"
        style={{ borderColor: "inherit" }} />
    </div>
  );
}

// ─── Activity Log ─────────────────────────────────────────────────────────────
function ActivityLog() {
  const [items, setItems] = useState<typeof ACTIVITY_LOG>([]);

  useEffect(() => {
    // Stagger items appearing like a live feed
    ACTIVITY_LOG.forEach((item, i) => {
      setTimeout(() => setItems(prev => [...prev, item]), 1800 + i * 180);
    });
  }, []);

  return (
    <div
      className="flex flex-col bg-surface-900 border border-surface-800 opacity-0 animate-[fadeSlideIn_0.4s_ease_forwards]"
      style={{
        animationDelay: "1700ms",
        boxShadow: "4px 4px 0px var(--surface-800)",
        clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-surface-800">
        <div className="flex items-center gap-3">
          <div className="w-0.5 h-4 bg-teal-glow" style={{ boxShadow: "0 0 6px var(--shadow-teal)" }} />
          <span className="text-[8px] font-terminal text-text-secondary uppercase tracking-[0.3em] opacity-50">
            {"// ACTIVITY_LOG"}
          </span>
          <span className="text-[10px] font-digital font-black text-text-primary uppercase tracking-wider">
            Recent_Events
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-emerald-glow animate-pulse" style={{ boxShadow: "0 0 4px var(--shadow-emerald)" }} />
          <span className="text-[8px] font-terminal text-emerald-glow uppercase tracking-wider">LIVE</span>
        </div>
      </div>

      {/* Log entries */}
      <div className="flex flex-col divide-y divide-surface-800/50 overflow-y-auto custom-scrollbar max-h-[340px]">
        {items.map((item, i) => {
          const c = COLOR_MAP[item.color] ?? COLOR_MAP.teal;
          return (
            <div
              key={i}
              className="flex items-start gap-3 px-5 py-2.5 hover:bg-surface-800/30 transition-colors duration-150 opacity-0 animate-[fadeSlideIn_0.25s_ease_forwards]"
            >
              {/* Type badge */}
              <span
                className="shrink-0 text-[7px] font-digital font-black uppercase tracking-wider px-1.5 py-0.5 border mt-0.5"
                style={{
                  color: c.css,
                  borderColor: c.css,
                  background: c.bg,
                  clipPath: "polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))",
                }}
              >
                {item.type}
              </span>
              {/* Message */}
              <span className="flex-1 text-[10px] font-terminal text-text-secondary leading-relaxed">
                {item.msg}
              </span>
              {/* Timestamp */}
              <span className="shrink-0 text-[8px] font-terminal text-text-secondary opacity-30 uppercase tracking-wider tabular-nums">
                -{item.time}
              </span>
            </div>
          );
        })}
        {items.length === 0 && (
          <div className="px-5 py-6 text-[9px] font-terminal text-text-secondary opacity-30 uppercase tracking-wider">
            {"// AWAITING_EVENTS..."}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Top Tutorials ────────────────────────────────────────────────────────────
function TopTutorials() {
  return (
    <div
      className="flex flex-col bg-surface-900 border border-surface-800 opacity-0 animate-[fadeSlideIn_0.4s_ease_forwards]"
      style={{
        animationDelay: "1800ms",
        boxShadow: "4px 4px 0px var(--surface-800)",
        clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-surface-800">
        <div className="w-0.5 h-4 bg-emerald-glow" style={{ boxShadow: "0 0 6px var(--shadow-emerald)" }} />
        <span className="text-[8px] font-terminal text-text-secondary uppercase tracking-[0.3em] opacity-50">
          {"// METRICS"}
        </span>
        <span className="text-[10px] font-digital font-black text-text-primary uppercase tracking-wider">
          Top_Tutorials
        </span>
      </div>

      {/* Rows */}
      <div className="flex flex-col divide-y divide-surface-800/50">
        {TOP_TUTORIALS.map((t, i) => (
          <div
            key={i}
            className="group px-5 py-3 hover:bg-surface-800/30 transition-colors duration-150 opacity-0 animate-[fadeSlideIn_0.3s_ease_forwards]"
            style={{ animationDelay: `${1900 + i * 80}ms` }}
          >
            {/* Title row */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="shrink-0 text-[8px] font-digital font-black w-5 text-right"
                  style={{ color: "var(--teal-glow)", textShadow: "0 0 6px var(--shadow-teal)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[10px] font-digital font-black text-text-primary uppercase tracking-wider truncate group-hover:text-teal-glow transition-colors duration-200">
                  {t.title}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-3">
                <span className="text-[8px] font-terminal text-text-secondary opacity-50 uppercase tracking-wider">
                  {t.enrollments.toLocaleString()} enrolled
                </span>
                <span
                  className="text-[8px] font-digital font-black"
                  style={{ color: t.completion > 75 ? "var(--emerald-glow)" : "var(--teal-glow)" }}
                >
                  {t.completion}%
                </span>
              </div>
            </div>

            {/* Mini progress bar */}
            <div className="flex items-center gap-2 pl-7">
              <div className="flex-1 h-0.5 bg-surface-800">
                <div
                  className="h-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${t.completion}%`,
                    background: t.completion > 75 ? "var(--emerald-glow)" : "var(--teal-glow)",
                    boxShadow: `0 0 6px ${t.completion > 75 ? "var(--shadow-emerald)" : "var(--shadow-teal)"}`,
                  }}
                />
              </div>
              <span
                className="text-[7px] font-terminal uppercase tracking-wider shrink-0 border px-1.5 py-0.5"
                style={{
                  color: "var(--purple-glow)",
                  borderColor: "rgba(168,85,247,0.3)",
                  clipPath: "polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))",
                }}
              >
                {t.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Quick Actions ────────────────────────────────────────────────────────────
function QuickActions() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 opacity-0 animate-[fadeSlideIn_0.3s_ease_forwards]" style={{ animationDelay: "1650ms" }}>
        <div className="w-0.5 h-4 bg-purple-glow" style={{ boxShadow: "0 0 6px var(--shadow-purple)" }} />
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
            className="
              group relative flex items-center gap-3 px-4 py-3
              bg-surface-900 border border-surface-800
              hover:-translate-y-0.5 transition-all duration-200
              opacity-0 animate-[fadeSlideIn_0.3s_ease_forwards]
            "
            style={{
              animationDelay: `${1700 + i * 80}ms`,
              boxShadow: "3px 3px 0px var(--surface-800)",
              clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = c.css)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--surface-800)")}
          >
            {/* Slide fill */}
            <div
              className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 z-0"
              style={{ background: c.bg }}
            />
            {/* Icon */}
            <span className="relative z-10 transition-colors duration-200" style={{ color: c.css }}>
              <Icon size={15} />
            </span>
            {/* Label */}
            <span
              className="relative z-10 text-[10px] font-digital font-black uppercase tracking-wider text-text-secondary group-hover:text-text-primary transition-colors duration-200"
            >
              {action.label}
            </span>
            {/* Arrow */}
            <span
              className="relative z-10 ml-auto text-[10px] font-digital translate-x-0 group-hover:translate-x-1 transition-transform duration-200 opacity-0 group-hover:opacity-100"
              style={{ color: c.css }}
            >
              →
            </span>
          </Link>
        );
      })}
    </div>
  );
}

// ─── Live Clock ───────────────────────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState("");
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const tick = () => {
      setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
      setUptime(prev => prev + 1);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const hrs = String(Math.floor(uptime / 3600)).padStart(2, "0");
  const mins = String(Math.floor((uptime % 3600) / 60)).padStart(2, "0");
  const secs = String(uptime % 60).padStart(2, "0");

  return (
    <div className="flex items-center gap-4 text-[9px] font-terminal text-text-secondary opacity-0 animate-[fadeSlideIn_0.4s_ease_forwards]" style={{ animationDelay: "1400ms" }}>
      <div className="flex items-center gap-2">
        <span className="opacity-40 uppercase tracking-wider">SYS_TIME:</span>
        <span className="font-digital font-black text-teal-glow tabular-nums" style={{ textShadow: "0 0 8px var(--shadow-teal)" }}>
          {time}
        </span>
      </div>
      <div className="w-px h-3 bg-surface-700" />
      <div className="flex items-center gap-2">
        <span className="opacity-40 uppercase tracking-wider">SESSION_UP:</span>
        <span className="font-digital font-black text-emerald-glow tabular-nums" style={{ textShadow: "0 0 8px var(--shadow-emerald)" }}>
          {hrs}:{mins}:{secs}
        </span>
      </div>
    </div>
  );
}

// ─── Content Breakdown ────────────────────────────────────────────────────────
function ContentBreakdown() {
  const bars = [
    { label: "Published", value: 194, total: 248, color: "emerald" },
    { label: "Draft", value: 54, total: 248, color: "teal" },
    { label: "Roadmaps", value: 12, total: 20, color: "purple" },
  ];

  return (
    <div
      className="flex flex-col bg-surface-900 border border-surface-800 opacity-0 animate-[fadeSlideIn_0.4s_ease_forwards]"
      style={{
        animationDelay: "1850ms",
        boxShadow: "4px 4px 0px var(--surface-800)",
        clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
      }}
    >
      <div className="flex items-center gap-3 px-5 py-3 border-b border-surface-800">
        <div className="w-0.5 h-4 bg-purple-glow" style={{ boxShadow: "0 0 6px var(--shadow-purple)" }} />
        <span className="text-[8px] font-terminal text-text-secondary uppercase tracking-[0.3em] opacity-50">{"// DATA"}</span>
        <span className="text-[10px] font-digital font-black text-text-primary uppercase tracking-wider">Content_Matrix</span>
      </div>
      <div className="flex flex-col gap-4 p-5">
        {bars.map((bar, i) => {
          const c = COLOR_MAP[bar.color];
          const pct = Math.round((bar.value / bar.total) * 100);
          return (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-terminal text-text-secondary uppercase tracking-wider opacity-60">{bar.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-digital font-black" style={{ color: c.css }}>{bar.value}</span>
                  <span className="text-[8px] font-terminal text-text-secondary opacity-30">/ {bar.total}</span>
                </div>
              </div>
              <div className="relative h-1.5 bg-surface-800">
                <div
                  className="absolute inset-y-0 left-0 transition-all duration-1000 ease-out"
                  style={{
                    width: `${pct}%`,
                    background: c.css,
                    boxShadow: `0 0 8px ${c.shadow}`,
                    animationDelay: `${2000 + i * 200}ms`,
                  }}
                />
              </div>
              <span className="text-[7px] font-terminal text-text-secondary opacity-30 uppercase tracking-wider text-right">{pct}% utilized</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Page() {
  const [, setBooted] = useState(false);

  return (
    <div className="h-full w-full overflow-y-auto custom-scrollbar font-terminal">
      <div className="max-w-7xl mx-auto p-6 flex flex-col gap-6 pb-12">

        {/* ── TOP BAR: Title + Clock ── */}
        <div className="flex items-start justify-between gap-4 opacity-0 animate-[fadeSlideIn_0.4s_ease_forwards]" style={{ animationDelay: "100ms" }}>
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-terminal text-text-secondary uppercase tracking-[0.35em] opacity-40">
              {"// SYS://ADMIN/DASHBOARD"}
            </span>
            <h1 className="text-xl font-digital font-black text-text-primary uppercase tracking-wider leading-none">
              System_Overview
            </h1>
          </div>
          <LiveClock />
        </div>

        {/* ── BOOT SEQUENCE ── */}
        <div
          className="bg-surface-900 border border-surface-800 p-5 opacity-0 animate-[fadeSlideIn_0.4s_ease_forwards]"
          style={{
            animationDelay: "200ms",
            boxShadow: "4px 4px 0px var(--surface-800)",
            clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 bg-teal-glow animate-pulse" style={{ boxShadow: "0 0 4px var(--shadow-teal)" }} />
            <span className="text-[8px] font-terminal text-text-secondary uppercase tracking-[0.3em] opacity-50">
              {"// TERMINAL_INIT"}
            </span>
          </div>
          <BootSequence onComplete={() => setBooted(true)} />
        </div>

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>

        {/* ── QUICK ACTIONS + CONTENT BREAKDOWN ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <QuickActions />
          </div>
          <div className="lg:col-span-2">
            <ContentBreakdown />
          </div>
        </div>

        {/* ── ACTIVITY LOG + TOP TUTORIALS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ActivityLog />
          <TopTutorials />
        </div>

      </div>
    </div>
  );
}
