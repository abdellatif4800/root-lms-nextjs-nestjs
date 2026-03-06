// TutorialsList
"use client";
import { TutorialCard } from "./TutorialCard";

export function TutorialsList({ tutorials }: any) {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar relative "
    >


      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 relative z-10 p-5 ">
        {tutorials.map((tutorial: any, i: number) => (
          <div
            key={tutorial.id}
            className="opacity-0 animate-[fadeSlideIn_0.35s_ease_forwards]"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <TutorialCard tutorial={tutorial} />
          </div>
        ))}
      </div>

      {/* Empty state */}
      {tutorials.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
          <span className="text-[10px] font-terminal text-text-secondary uppercase tracking-[0.3em] opacity-40">
            // NO_RECORDS_FOUND
          </span>
          <span className="text-xs font-digital text-teal-glow opacity-20 animate-pulse">_</span>
        </div>
      )}
    </div>
  );
}

