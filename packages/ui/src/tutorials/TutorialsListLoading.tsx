export default function TutorialsListLoading() {
  return (
    <div className="flex flex-col flex-1">
      {/* Header Skeleton */}
      <div className="shrink-0 border-b-2 border-ink px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border-2 border-ink animate-pulse" />
          <div className="space-y-2">
            <div className="h-6 w-48 bg-ink/10 animate-pulse" />
            <div className="h-2 w-32 bg-ink/5 animate-pulse" />
          </div>
        </div>
        <div className="h-10 w-32 bg-ink/10 animate-pulse border-2 border-ink" />
      </div>

      {/* Grid Skeleton */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="wire-card h-72 animate-pulse border-ink/10">
               <div className="h-32 bg-ink/5 border-b-2 border-ink/5" />
               <div className="p-6 space-y-4">
                  <div className="h-4 w-3/4 bg-ink/10" />
                  <div className="h-2 w-full bg-ink/5" />
                  <div className="h-2 w-2/3 bg-ink/5" />
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
