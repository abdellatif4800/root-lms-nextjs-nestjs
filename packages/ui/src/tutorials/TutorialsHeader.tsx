"use client";

export function TutorialsHeader({ hasMore, loadMore, tutorialsLength, onOpenFilter, filters }: any) {
  const activeFilters = Object.entries(filters || {}).filter(([key, value]) => {
    if (key === 'publish' && value === true) return false; // Default
    if (value === undefined || value === null) return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
  });

  return (
    <header className="
      shrink-0 z-10
      bg-surface-900 backdrop-blur-sm
      border-b border-surface-800
      px-3 sm:px-6 py-4 sm:py-6
      flex flex-col gap-4 sm:gap-6
      custom-shadow
    ">

      {/* Top Row — filter toggle + Title + Count */}
      <div className="flex items-center justify-between gap-4 w-full">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Filter toggle button — always shown, opens overlay */}
          <button
            onClick={onOpenFilter}
            className="shrink-0 border border-surface-700 bg-surface-900 text-text-secondary hover:text-purple-glow hover:border-purple-glow transition-colors duration-200 p-2.5"
            aria-label="Open filters"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
            </svg>
          </button>

          {/* Accent bar */}
          <span className="hidden sm:block w-1.5 h-10 bg-teal-glow shadow-glow-teal shrink-0" />

          <div className="flex flex-col gap-1 min-w-0">
            <span className="hidden sm:block text-[10px] font-terminal tracking-[0.4em] text-text-secondary uppercase opacity-60">
              // SYS://ROOT_LMS
            </span>
            <h1 className="text-lg sm:text-2xl font-digital font-black uppercase tracking-[0.15em] text-text-primary text-glow-teal leading-none truncate">
              Tutorial_Library
            </h1>
          </div>
        </div>

        {/* Right — Count + Load more */}
        <div className="flex items-center gap-3 sm:gap-6 shrink-0">
          {/* Count badge */}
          <div className="flex items-center gap-2 sm:gap-3 border border-surface-700 px-3 py-1.5 sm:py-2">
            <span className="w-2 h-2 rounded-full bg-emerald-glow shadow-glow-emerald-sm animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-terminal uppercase tracking-[0.2em] text-text-secondary">
              <span className="text-emerald-glow font-bold text-sm sm:text-lg">{tutorialsLength}</span>
              <span className="ml-1 opacity-60 hidden sm:inline">records</span>
            </span>
          </div>

          {/* Load more */}
          {hasMore && (
            <button
              onClick={loadMore}
              className="
                group relative overflow-hidden
                px-4 sm:px-8 py-2 sm:py-2.5
                bg-surface-950 border border-teal-glow/40
                text-teal-glow text-[10px] sm:text-[12px] font-digital font-black uppercase tracking-[0.25em]
                hover:bg-teal-glow hover:text-black
                transition-all duration-200 active:scale-95
                [clip-path:polygon(0_0,calc(100%-8px)_0,100%_8px,100%_100%,8px_100%,0_calc(100%-8px))]
              "
            >
              <span className="absolute inset-0 bg-teal-glow -translate-x-full group-hover:translate-x-0 transition-transform duration-300 z-0" />
              <span className="relative z-10 flex items-center gap-2">
                <span className="hidden sm:inline">LOAD_MORE</span>
                <span className="sm:hidden">MORE</span>
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Row — Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 py-2 border-t border-surface-800/50">
          <span className="text-[9px] font-terminal text-text-secondary uppercase tracking-[0.2em] opacity-40 mr-1">
            Active_Filters:
          </span>
          {activeFilters.map(([key, value]: [string, any]) => {
            let displayValue = Array.isArray(value) ? value.join(' + ') : String(value);
            if (key === 'isPaid') {
              displayValue = value === true ? 'PAID' : 'FREE';
            }
            
            return (
              <span 
                key={key} 
                className="text-[9px] sm:text-[11px] font-digital font-black bg-purple-glow/15 text-purple-glow border border-purple-glow/40 px-3 py-1 uppercase tracking-wider shadow-glow-purple-sm flex items-center gap-2"
              >
                <span className="opacity-50 text-[8px]">{key}::</span>
                {displayValue}
              </span>
            );
          })}
        </div>
      )}
    </header>
  );
}
