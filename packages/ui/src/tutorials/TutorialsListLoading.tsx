export default function TutorialsListLoading() {
  return (
    <>
      {/* Fake header skeleton — matches real TutorialsHeader layout */}
      <div className="shrink-0 z-10 bg-surface-900/80 backdrop-blur-sm border-b border-surface-800 px-6 py-4 flex items-center justify-between gap-6">
        {/* Left: accent bar + title */}
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-surface-800 animate-pulse" />
          <div className="flex flex-col gap-1.5">
            <div className="h-2 w-24 bg-surface-800 animate-pulse" />
            <div className="h-4 w-36 bg-surface-800 animate-pulse" />
          </div>
        </div>
        {/* Right: badge + divider + button */}
        <div className="flex items-center gap-6">
          <div className="h-7 w-24 bg-surface-800 animate-pulse border border-surface-700" />
          <div className="h-8 w-px bg-surface-800" />
          <div className="h-8 w-28 bg-surface-800 animate-pulse" />
        </div>
      </div>

      {/* Card grid skeleton */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-surface-950 p-5">
        {/* Scanline */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025] z-0"
          style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)" }}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 relative z-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} delay={i * 60} />
          ))}
        </div>
      </div>
    </>
  );
}

function SkeletonCard({ delay }: { delay: number }) {
  return (
    <div
      className="h-[340px] flex flex-col bg-surface-900 border border-surface-800 overflow-hidden opacity-0 animate-[fadeSlideIn_0.4s_ease_forwards]"
      style={{
        boxShadow: "4px 4px 0px var(--surface-800)",
        clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Thumbnail area */}
      <div className="relative h-36 w-full bg-surface-800 border-b border-surface-800 shrink-0 overflow-hidden">
        {/* Shimmer sweep */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-surface-700/40 to-transparent"
          style={{ animationDelay: `${delay}ms` }} />
        {/* Level badge placeholder */}
        <div className="absolute top-0 right-0 w-16 h-5 bg-surface-700/50" />
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 gap-3 overflow-hidden">
        {/* Category dot + line */}
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-surface-700" />
          <div className="h-2 w-16 bg-surface-800 animate-pulse rounded-none" style={{ animationDelay: `${delay + 100}ms` }} />
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <div className="h-3 w-full bg-surface-800 animate-pulse" style={{ animationDelay: `${delay + 150}ms` }} />
          <div className="h-3 w-3/4 bg-surface-800 animate-pulse" style={{ animationDelay: `${delay + 200}ms` }} />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1 flex-1">
          <div className="h-2.5 w-full bg-surface-800/70 animate-pulse" style={{ animationDelay: `${delay + 250}ms` }} />
          <div className="h-2.5 w-5/6 bg-surface-800/70 animate-pulse" style={{ animationDelay: `${delay + 300}ms` }} />
        </div>

        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-surface-800 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="h-2 w-10 bg-surface-800 animate-pulse" style={{ animationDelay: `${delay + 350}ms` }} />
            <div className="h-2.5 w-20 bg-surface-800 animate-pulse" style={{ animationDelay: `${delay + 400}ms` }} />
          </div>
          <div
            className="h-7 w-16 bg-surface-800 animate-pulse"
            style={{
              clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
              animationDelay: `${delay + 450}ms`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
