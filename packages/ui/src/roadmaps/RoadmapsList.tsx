"use client";
import { useQuery } from "@tanstack/react-query";
import { getRoadmaps } from "@repo/gql";
import { useRouter } from "next/navigation";

export function RoadmapsList({ isPublic }: { isPublic: boolean }) {
  const router = useRouter();
  const { data: roadmaps, isLoading, isError } = useQuery({
    queryKey: ['roadmaps'],
    queryFn: getRoadmaps,
  });

  if (isLoading) return (
    <div className="h-full w-full p-6">
      {/* Header skeleton */}
      <div className="mb-6 flex items-center gap-3">
        <div className="w-1 h-6 bg-teal-glow/30 animate-pulse" />
        <div className="h-5 w-36 bg-surface-800 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface-900 border border-surface-800 p-6 flex flex-col gap-3 opacity-0 animate-[fadeSlideIn_0.3s_ease_forwards]"
            style={{
              animationDelay: `${i * 60}ms`,
              boxShadow: "4px 4px 0px var(--surface-800)",
              clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))"
            }}
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-32 bg-surface-800 animate-pulse" />
              <div className="h-5 w-14 bg-surface-800 animate-pulse" />
            </div>
            <div className="h-3 w-full bg-surface-800/60 animate-pulse" />
            <div className="h-3 w-3/4 bg-surface-800/60 animate-pulse" />
            <div className="mt-auto pt-3 border-t border-surface-800 flex justify-between">
              <div className="h-3 w-20 bg-surface-800 animate-pulse" />
              <div className="h-3 w-12 bg-surface-800 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (isError) return (
    <div className="h-full w-full flex items-center justify-center p-8">
      <div
        className="border border-red-500/30 bg-red-500/5 px-6 py-4 max-w-sm w-full"
        style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}
      >
        <p className="text-[10px] font-terminal text-red-400 uppercase tracking-wider">
          <span className="opacity-50 mr-2">{">"}</span>
          Failed to load roadmaps
        </p>
      </div>
    </div>
  );

  return (
    <div className="h-full w-full overflow-y-auto custom-scrollbar">
      <div className="p-6">

        {/* Page header */}
        <div className="flex items-center justify-between mb-6 bg-surface-900 h-15 p-5 custom-shadow"
        >
          <div className="flex items-center gap-3">
            <span className="block w-0.5 h-6 bg-teal-glow"
              style={{ boxShadow: "0 0 6px var(--shadow-teal)" }} />
            <div>
              <p className="text-[8px] font-terminal text-text-secondary uppercase tracking-[0.3em] opacity-50">
                // SYS://ROADMAPS
              </p>
              <h1 className="text-base font-digital font-black text-text-primary uppercase tracking-wider leading-none">
                Career_Paths
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 border border-surface-700 px-3 py-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-glow animate-pulse"
              style={{ boxShadow: "0 0 4px var(--shadow-emerald)" }} />
            <span className="text-[9px] font-terminal uppercase tracking-[0.2em] text-text-secondary">
              <span className="text-emerald-glow font-bold">{roadmaps?.length ?? 0}</span>
              <span className="ml-1 opacity-60">available</span>
            </span>
          </div>
        </div>

        {/* Grid */}
        {roadmaps?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <span className="text-[9px] font-terminal text-text-secondary uppercase tracking-[0.3em] opacity-40">
              // NO_ROADMAPS_FOUND
            </span>
            <span className="text-teal-glow/20 font-digital animate-pulse text-sm">_</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roadmaps?.map((roadmap: any, i: number) => (
              <div key={roadmap.id || i} className="relative group">
                <div
                  className="absolute inset-0 transition-transform duration-300"
                  style={{
                    backgroundColor: "var(--surface-700)", // The "shadow" is actually a solid shape behind
                    clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                    transform: "translate(6px, 6px)" // This creates the offset
                  }}
                />

                <div
                  className="
                  group relative flex flex-col gap-4
                  bg-surface-900 border border-surface-800
                  hover:border-teal-glow/60 hover:bg-surface-800
                  cursor-pointer transition-all duration-200
                  hover:-translate-y-1
                  opacity-0 animate-[fadeSlideIn_0.35s_ease_forwards]
                "
                  style={{
                    animationDelay: `${i * 60}ms`,
                    boxShadow: "4px 4px 0px var(--surface-800)",
                    clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))"
                  }}
                  onClick={() => {
                    if (isPublic) {
                      router.push(`/roadmaps/${roadmap.id}`)
                    } else {
                      router.push(`/roadmaps/roadmapEditor?editOrCreate=edit&roadmapId=${roadmap.id}`)

                    }

                  }
                  }
                >
                  {/* Hover bottom accent bar */}
                  <div className="
                  absolute bottom-0 left-0 right-0 h-0.5
                  bg-teal-glow scale-x-0 group-hover:scale-x-100
                  transition-transform duration-300 origin-left
                " style={{ boxShadow: "0 0 8px var(--shadow-teal)" }} />

                  {/* Hover inset glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                    style={{ background: "linear-gradient(135deg, rgba(45,212,191,0.04) 0%, transparent 60%)" }} />

                  <div className="relative p-5 flex flex-col gap-3 flex-1">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-sm font-digital font-black text-text-primary uppercase tracking-wider leading-snug group-hover:text-teal-glow transition-colors duration-200 line-clamp-2">
                        {roadmap.title}
                      </h2>
                      <span
                        className="shrink-0 text-[8px] font-terminal text-teal-glow border border-teal-glow/30 px-2 py-0.5 uppercase tracking-wider"
                        style={{ clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))" }}
                      >
                        {roadmap.nodes?.length ?? 0} nodes
                      </span>
                    </div>

                    {/* Description */}
                    {roadmap.description && (
                      <p className="text-[11px] font-terminal text-text-secondary leading-relaxed line-clamp-2 opacity-70">
                        <span className="text-teal-glow/40 mr-1">{">"}</span>
                        {roadmap.description}
                      </p>
                    )}

                    {/* Footer */}
                    <div className="mt-auto pt-3 border-t border-surface-800 flex items-center justify-between">
                      <span className="text-[9px] font-terminal text-text-secondary uppercase tracking-wider opacity-50">
                        {roadmap.edges?.length ?? 0} connections
                      </span>
                      <span className="
                      relative overflow-hidden group/btn
                      text-[9px] font-digital font-black text-emerald-glow uppercase tracking-wider
                      flex items-center gap-1.5
                      transition-all duration-200
                    ">
                        {isPublic ? 'Execute_Path' : 'Edit'}
                        <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

