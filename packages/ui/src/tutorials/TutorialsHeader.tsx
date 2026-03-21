"use client";

export function TutorialsHeader({ hasMore, loadMore, tutorialsLength, onOpenFilter, filters }: any) {
  const activeFilters = Object.entries(filters || {}).filter(([key, value]) => {
    if (key === 'publish' && value === true) return false;
    if (value === undefined || value === null) return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
  });

  return (
    <header className="shrink-0 z-10 bg-surface border-b-2 border-ink px-6 py-6 flex flex-col gap-6 shadow-wire">

      {/* Top Row */}
      <div className="flex items-center justify-between gap-4 w-full py-2">
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={onOpenFilter}
            className="btn-wire p-2.5 shadow-[2px_2px_0px_0px_rgba(19,21,22,1)]"
            aria-label="Open filters"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
            </svg>
          </button>

          <div className="flex flex-col min-w-0">
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter text-teal-primary leading-none truncate">
              Lessons
            </h1>
            <span className="text-[10px] font-mono text-dust uppercase font-bold mt-1 opacity-60">
              {tutorialsLength} lessons found
            </span>
          </div>
        </div>

        {/* Load more */}
        <div className="flex items-center gap-4">
          {hasMore && (
            <button onClick={loadMore} className="btn-wire-teal px-6 py-2.5 text-xs">
              See more lessons
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Tape */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 py-4 border-t-2 border-ink/5">
          <span className="text-[10px] font-mono font-bold text-dust uppercase tracking-widest mr-2">
            Applied:
          </span>
          {activeFilters.map(([key, value]: [string, any]) => {
            let displayValue = Array.isArray(value) ? value.join(' + ') : String(value);
            if (key === 'isPaid') displayValue = value === true ? 'PAID' : 'FREE';
            if (key === 'tutorialName') displayValue = `"${value}"`;

            return (
              <span key={key} className="badge-tape flex items-center gap-2 border border-background/20">
                <span className="opacity-40">{key === 'tutorialName' ? 'Search' : key}:</span>
                {displayValue}
              </span>
            );
          })}
        </div>
      )}
    </header>
  );
}
