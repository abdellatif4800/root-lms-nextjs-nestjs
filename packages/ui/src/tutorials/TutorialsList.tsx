"use client";
import { TutorialCard } from "./TutorialCard";

export function TutorialsList({ tutorials }: any) {
  return (
    <div className="relative p-6 flex-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {tutorials.map((tutorial: any) => (
          <div
            key={tutorial.id}
          >
            <TutorialCard tutorial={tutorial} />
          </div>
        ))}
      </div>

      {tutorials.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
          <span className="text-xl font-black uppercase text-ink opacity-30">
            No Records Found
          </span>
          <p className="text-xs text-dust">Try adjusting your filters to find more content.</p>
        </div>
      )}
    </div>
  );
}
