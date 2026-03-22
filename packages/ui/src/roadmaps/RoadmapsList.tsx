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
    <div className="h-full w-full p-8 flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 border-2 border-ink animate-pulse" />
        <div className="h-8 w-48 bg-ink/10 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="wire-card h-64 animate-pulse border-ink/10 bg-surface/30">
             <div className="p-8 space-y-4">
                <div className="h-6 w-3/4 bg-ink/10" />
                <div className="h-3 w-full bg-ink/5" />
                <div className="h-3 w-2/3 bg-ink/5" />
                <div className="mt-auto pt-6 border-t-2 border-ink/5 h-10" />
             </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (isError) return (
    <div className="h-full w-full flex items-center justify-center p-12">
      <div className="wire-card max-w-sm w-full p-8 border-red-500/30 text-center">
        <p className="text-xs font-bold text-ink uppercase">
          Failed to load study paths.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-full w-full flex flex-col font-sans">
      <div className="p-8 max-w-7xl mx-auto w-full">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="flex flex-col">
            <span className="badge-tape w-fit mb-2">Curriculum Overviews</span>
            <h1 className="text-4xl font-black text-ink uppercase tracking-tighter leading-none">
              Study Paths
            </h1>
          </div>
          <div className="flex items-center gap-3 border-2 border-ink px-4 py-2 bg-surface shadow-wire">
            <div className="w-2 h-2 bg-teal-primary animate-pulse" />
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-ink">
              {roadmaps?.length ?? 0} Paths Available
            </span>
          </div>
        </div>

        {/* Grid */}
        {roadmaps?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 border-2 border-ink border-dashed">
            <span className="text-xs font-bold text-dust uppercase tracking-widest">
              No paths have been published yet.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roadmaps?.map((roadmap: any, i: number) => (
              <div
                key={roadmap.id || i}
                onClick={() => {
                  if (isPublic) {
                    router.push(`/roadmaps/${roadmap.id}`)
                  } else {
                    router.push(`/roadmaps/roadmapEditor?editOrCreate=edit&roadmapId=${roadmap.id}`)
                  }
                }}
                className="wire-card group cursor-pointer flex flex-col h-full hover:border-teal-primary hover:shadow-wire-teal transition-all"
              >
                <div className="p-8 flex flex-col gap-4 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-xl font-black text-ink uppercase tracking-tighter leading-tight group-hover:text-teal-primary transition-colors">
                      {roadmap.title}
                    </h2>
                    <span className="badge-tape whitespace-nowrap">
                      {roadmap.nodes?.length ?? 0} Steps
                    </span>
                  </div>

                  {roadmap.description && (
                    <p className="text-xs text-dust font-medium leading-relaxed line-clamp-3">
                      {roadmap.description}
                    </p>
                  )}

                  <div className="mt-auto pt-6 border-t-2 border-dashed border-ink/5 flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-dust uppercase tracking-widest">
                      {roadmap.edges?.length ?? 0} Links
                    </span>
                    <span className="btn-wire text-[10px] px-4 py-1.5 uppercase font-black tracking-widest group-hover:bg-teal-primary group-hover:text-background transition-colors">
                      {isPublic ? 'View Path →' : 'Edit Path'}
                    </span>
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
