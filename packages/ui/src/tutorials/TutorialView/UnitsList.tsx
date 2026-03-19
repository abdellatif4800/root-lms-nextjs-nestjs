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
  // ── Read userId from Redux auth state (populated at login) ──
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
    <aside className="w-80 shrink-0 flex flex-col h-full max-h-full overflow-hidden bg-surface-900 border border-surface-800 [box-shadow:4px_0_0_var(--surface-800)]">

      {/* ── Header ── */}
      <div className="flex flex-col gap-2 px-5 py-4 border-b border-surface-800 shrink-0 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-teal-glow shadow-glow-teal-sm" />

        <div className="flex items-center justify-between mb-1">
          <Link
            href={{ pathname: "/tutorials/list" }}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold font-terminal uppercase tracking-[0.25em] text-purple-glow hover:text-teal-glow transition-colors duration-150"
          >
            <span className="text-teal-glow/60">←</span>
            Return_To_Base
          </Link>

          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden text-text-secondary hover:text-teal-glow transition-colors p-0.5"
              aria-label="Close units panel"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <h1 className="text-sm font-digital font-black text-text-primary uppercase leading-snug tracking-wide line-clamp-2">
          {tutorialData?.tutorialName}
        </h1>

        {!tutorialLoading && !progressLoading && (
          <div className="mt-3 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-terminal text-text-secondary uppercase tracking-[0.2em] opacity-60">
                Progress
              </span>
              <span className="text-[8px] font-digital font-black text-teal-glow">
                {completedUnits}/{totalUnits}
              </span>
            </div>
            <div className="h-1 bg-surface-800 w-full overflow-hidden">
              <div
                className="h-full bg-teal-glow transition-all duration-500 shadow-glow-teal-sm"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Units List ── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0 py-2">
        {tutorialLoading || progressLoading ? (
          <div className="flex flex-col gap-1 px-3 pt-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 bg-surface-800 animate-pulse"
                style={{ animationDelay: `${i * 80}ms`, opacity: 1 - i * 0.15 }} />
            ))}
          </div>
        ) : tutorialError ? (
          <p className="text-[10px] font-terminal text-red-400 px-4 py-3 opacity-70">{">"} Error: {tutorialError.message}</p>
        ) : progressError ? (
          <p className="text-[10px] font-terminal text-red-400 px-4 py-3 opacity-70">{">"} Error: {progressError.message}</p>
        ) : (
          <div className="px-3 pb-4 flex flex-col gap-0.5">
            {tutorialData?.units?.map((unit: any, index: number) => {
              const isActive = currentUnitId === unit.id;
              const progress = progressData?.find((p: any) => p.unit.id === unit.id);
              const isCompleted = progress?.isCompleted;

              return (
                <div
                  key={unit.id}
                  className={`
                    group/item flex items-center gap-2 px-2 py-2 transition-all duration-150 relative
                    ${isActive
                      ? "bg-surface-800 border-l-2 border-teal-glow"
                      : "border-l-2 border-transparent hover:border-surface-700 hover:bg-surface-800/50"
                    }
                  `}
                >
                  <span className={`shrink-0 w-5 text-[8px] font-digital font-black text-right ${isActive ? "text-teal-glow" : "text-text-secondary opacity-30"}`}>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <Link
                    href={{ pathname: `/tutorials/${tutorialId}`, query: { unitId: unit.id } }}
                    className="flex items-center gap-2 flex-1 min-w-0"
                    onClick={onClose}
                  >
                    <span className={`
                      shrink-0 w-1.5 h-1.5 transition-all duration-200
                      ${isCompleted ? "bg-emerald-glow shadow-glow-emerald-sm" : isActive ? "bg-teal-glow" : "bg-surface-700 group-hover/item:bg-surface-600"}
                    `} />
                    <span className={`
                      text-[11px] font-terminal truncate leading-none
                      ${isActive ? "text-teal-glow font-bold" : isCompleted ? "text-text-secondary line-through opacity-60" : "text-text-secondary group-hover/item:text-text-primary"}
                    `}>
                      {unit.unitTitle}
                    </span>
                  </Link>

                  {/* Visual indicator — checkmark for completed units */}
                  {isCompleted && (
                    <span className="shrink-0 w-5 h-5 flex items-center justify-center text-[10px] text-emerald-glow font-bold">
                      ✓
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="px-4 py-3 border-t border-surface-800 shrink-0 bg-surface-950/40">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-surface-800 border border-surface-700 flex items-center justify-center text-xs shrink-0 [clip-path:polygon(0_0,calc(100%-5px)_0,100%_5px,100%_100%,5px_100%,0_calc(100%-5px))]">
            👾
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[7px] font-terminal text-text-secondary uppercase tracking-[0.25em] opacity-50">// instructor</span>
            <span className="text-[10px] font-digital font-black text-text-primary truncate">
              {tutorialData?.author?.username}
            </span>
          </div>
          <div className="shrink-0 text-[9px] font-digital text-purple-glow opacity-70 text-glow-purple">
            {tutorialData?.units?.length || 0}_units
          </div>
        </div>
      </div>
    </aside>
  );
}
