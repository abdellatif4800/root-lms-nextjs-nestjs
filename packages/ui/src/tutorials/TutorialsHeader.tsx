"use client";
export function TutorialsHeader({ hasMore, loadMore, tutorialsLength }: any) {
  return (
    <header className="
      shrink-0 z-10
      bg-surface-900 backdrop-blur-sm
      border-b border-surface-800
      px-6 py-4
      flex flex-row items-center justify-between gap-6
      custom-shadow
    "
    >

      {/* Left — Title */}
      <div className="flex items-center gap-3">
        {/* Accent bar */}
        <span className="block w-1 h-8 bg-teal-glow shadow-[0_0_8px_rgba(45,212,191,0.6)]" />
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] font-terminal tracking-[0.3em] text-text-secondary uppercase opacity-60">
            // SYS://ROOT_LMS
          </span>
          <h1 className="text-lg font-digital font-black uppercase tracking-[0.1em] text-text-primary text-glow-teal leading-none">
            Tutorial_Library
          </h1>
        </div>
      </div>

      {/* Right — Count + Action */}
      <div className="flex items-center gap-6">

        {/* Count badge */}
        <div className="flex items-center gap-2 border border-surface-700 px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-glow shadow-[0_0_6px_#10b981] animate-pulse" />
          <span className="text-[10px] font-terminal uppercase tracking-[0.2em] text-text-secondary">
            <span className="text-emerald-glow font-bold text-sm">{tutorialsLength}</span>
            <span className="ml-1 opacity-60">records</span>
          </span>
        </div>

        {/* Divider */}
        <span className="h-8 w-px bg-surface-700" />

        {/* Load more / end of data */}
        {hasMore ? (
          <button
            onClick={loadMore}
            className="
              group relative
              px-6 py-2
              bg-surface-950 border border-teal-glow/40
              text-teal-glow text-[10px] font-digital font-black uppercase tracking-[0.2em]
              hover:bg-teal-glow hover:text-black
              transition-all duration-200
              active:scale-95
              shadow-[0_0_10px_rgba(45,212,191,0.08)]
              hover:shadow-[0_0_20px_rgba(45,212,191,0.35)]
              overflow-hidden
            "
            style={{
              clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))"
            }}
          >
            {/* Sweep fill */}
            <span className="
              absolute inset-0 bg-teal-glow
              translate-x-[-100%] group-hover:translate-x-0
              transition-transform duration-300 z-0
            " />
            <span className="relative z-10 flex items-center gap-2">
              <span className="opacity-50 group-hover:opacity-100 transition-opacity">[+]</span>
              LOAD_MORE
              <span className="opacity-50 group-hover:opacity-100 transition-opacity">[+]</span>
            </span>
          </button>
        ) : (
          <div className="flex items-center gap-2 text-[10px] font-terminal uppercase tracking-[0.25em] text-text-secondary opacity-40">
            <span className="w-1 h-1 bg-text-secondary" />
            END_OF_DATA
            <span className="w-1 h-1 bg-text-secondary" />
          </div>
        )}
      </div>
    </header>
  );
}

// // TutorialsHeader
//
// "use client";
//
// export function TutorialsHeader({ hasMore, loadMore, tutorialsLength }: any) {
//   return (
//     <header className="p-3 border-b border-surface-800 shrink-0 bg-surface-900/50 backdrop-blur-sm z-10 flex flex-row sm:flex-row justify-between items-center sm:items-center gap-4">
//       <h1 className="text-xl font-digital font-black uppercase tracking-[0.1em] text-text-primary">
//         Tutorial Library
//       </h1>
//       {hasMore ? (
//         <button
//           onClick={loadMore}
//           className="
//                 group relative px-8 py-3 
//                 bg-surface-950 border border-teal-glow/50 
//                 text-teal-glow text-xs font-black uppercase tracking-[0.2em] font-digital
//                 hover:bg-teal-glow hover:text-black 
//                 transition-all duration-300
//                 active:scale-95
//                 shadow-[0_0_10px_rgba(45,212,191,0.1)]
//                 hover:shadow-[0_0_20px_rgba(45,212,191,0.4)]
//               "
//         >
//           <span className="mr-2 opacity-50 group-hover:opacity-100">[+]</span>
//           LOAD_MORE
//           <span className="ml-2 opacity-50 group-hover:opacity-100">[+]</span>
//         </button>
//       ) : (
//         <div className="text-[10px] font-bold text-secondary uppercase tracking-widest opacity-50">
//           // END_OF_DATA //
//         </div>
//       )}
//
//       <div className="flex justify-between items-center mt-2">
//         <p className="text-xs font-bold text-secondary uppercase tracking-widest">
//           <span className="text-emerald-glow">{tutorialsLength}</span> Tutorials
//           Found
//         </p>
//       </div>
//     </header>
//   );
// }
