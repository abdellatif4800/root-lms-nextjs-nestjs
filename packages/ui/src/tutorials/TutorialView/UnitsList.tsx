"use client";

import {
  getAllUnitProgressByTutorialAndUser,
  getUnitsByTutorialId,
  useQuery,
} from "@repo/gql";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { RootState, useAppSelector } from "@repo/reduxSetup";

export function UnitsList({
  firstUnit,
  onClose,
}: {
  firstUnit?: string;
  onClose?: () => void;
}) {
  const { user } = useAppSelector((state: RootState) => state.authSlice);
  const userId = user?.sub ?? "";

  const params = useParams();
  const searchParams = useSearchParams();

  const tutorialId = params.tutorialId as string;
  const unitIdParam = searchParams.get("unitId");
  const currentUnitId = unitIdParam || firstUnit;

  const { data: progressData, isLoading: progressLoading, error: progressError } = useQuery({
    queryKey: ["unitProgress", userId, tutorialId],
    queryFn: () => getAllUnitProgressByTutorialAndUser(userId, tutorialId),
    enabled: !!userId && !!tutorialId,
  });

  const { data: tutorialData, isLoading: tutorialLoading, error: tutorialError } = useQuery({
    queryKey: ["tutorialById"],
    queryFn: () => getUnitsByTutorialId(tutorialId),
    enabled: !!tutorialId,
  });

  const totalUnits = tutorialData?.units?.length || 0;
  const completedUnits = progressData?.filter((p: any) => p.isCompleted)?.length || 0;
  const progressPct = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;

  return (
    <aside className="w-80 shrink-0 flex flex-col h-full max-h-full overflow-hidden bg-surface border-r-2 border-ink shadow-wire">

      {/* ── Header ── */}
      <div className="flex flex-col gap-4 px-6 py-6 border-b-2 border-ink shrink-0 relative overflow-hidden">

        <div className="flex flex-col items-center justify-between gap-2 pt-2">
          {onClose && (
            <button
              onClick={onClose}
              className="w-full h-8 border-2 border-ink flex items-center justify-center hover:bg-ink hover:text-background transition-colors shadow-[2px_2px_0px_0px_rgba(19,21,22,1)]"
              aria-label="Close units panel"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}

          <h1 className="text-lg font-black text-ink uppercase leading-tight tracking-tighter line-clamp-2">
            {tutorialData?.tutorialName}
          </h1>
        </div>

        {!tutorialLoading && !progressLoading && (
          <div className="mt-2 flex flex-col gap-2 py-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-dust uppercase tracking-widest">
                My Progress
              </span>
              <span className="text-[10px] font-mono font-black text-teal-primary">
                {completedUnits}/{totalUnits} Lessons
              </span>
            </div>
            <div className="h-3 bg-background border-2 border-ink w-full overflow-hidden p-[1px]">
              <div
                className="h-full bg-teal-primary transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Units List ── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0 py-4">
        {tutorialLoading || progressLoading ? (
          <div className="flex flex-col gap-2 px-4 pt-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-ink/5 border-2 border-ink/5 animate-pulse"
                style={{ animationDelay: `${i * 80}ms` }} />
            ))}
          </div>
        ) : tutorialError || progressError ? (
          <p className="text-xs font-mono text-ink px-6 py-4 opacity-50 italic">Something went wrong.</p>
        ) : (
          <div className="px-4 pb-6 flex flex-col gap-1.5">
            {tutorialData?.units?.map((unit: any, index: number) => {
              const isActive = currentUnitId === unit.id;
              const progress = progressData?.find((p: any) => p.unit.id === unit.id);
              const isCompleted = progress?.isCompleted;

              return (
                <div
                  key={unit.id}
                  className={`
                    group/item border-2 transition-all duration-150
                    ${isActive
                      ? "bg-background border-ink shadow-[2px_2px_0px_0px_rgba(19,21,22,1)]"
                      : "bg-transparent border-transparent hover:border-ink/20"
                    }
                  `}
                >
                  <Link
                    href={{ pathname: `/tutorials/${tutorialId}`, query: { unitId: unit.id } }}
                    className="flex items-center gap-3 px-3 py-3 flex-1 min-w-0"
                    onClick={onClose}
                  >
                    <span className={`shrink-0 w-6 text-[10px] font-mono font-black text-right ${isActive ? "text-teal-primary" : "text-dust"}`}>
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className={`w-2 h-2 border-2 border-ink shrink-0 ${isCompleted ? "bg-ink" : isActive ? "bg-teal-primary" : "bg-transparent opacity-20"}`} />

                    <span className={`
                      text-xs font-bold uppercase truncate leading-none
                      ${isActive ? "text-ink" : isCompleted ? "text-dust line-through" : "text-dust group-hover/item:text-ink"}
                    `}>
                      {unit.unitTitle}
                    </span>

                    {isCompleted && (
                      <span className="ml-auto text-[10px] text-ink font-black">
                        DONE
                      </span>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="px-6 py-4 border-t-2 border-ink shrink-0 bg-background/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-ink flex items-center justify-center text-lg shrink-0 bg-surface shadow-[2px_2px_0px_0px_rgba(19,21,22,1)]">
            👩‍🏫
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[8px] font-mono text-dust uppercase font-bold tracking-widest">Teacher</span>
            <span className="text-xs font-black text-ink truncate uppercase">
              {tutorialData?.author?.username}
            </span>
          </div>
          <div className="badge-tape shrink-0">
            {tutorialData?.units?.length || 0} Lessons
          </div>
        </div>
      </div>
    </aside>
  );
}
