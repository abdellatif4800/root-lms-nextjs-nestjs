"use client";
import {
  getUnitById,
  useQuery,
  useMutation,
  useQueryClient,
  createUnitProgress,
  getAllUnitProgressByTutorialAndUser,
  CreateProgressInput,
} from "@repo/gql";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { type MDXRemoteSerializeResult } from "next-mdx-remote";
import { MDXContent, serializeMDX } from "@repo/mdxSetup";
import Link from "next/link";
import { RootState, useAppSelector } from "@repo/reduxSetup";

export function ContentArea({
  tutorialData,
  onOpenUnits,
}: {
  tutorialData?: any;
  onOpenUnits?: () => void;
}) {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();

  const tutorialId = params.tutorialId as string;
  const unitIdParam = searchParams.get("unitId");
  const currentUnitId = unitIdParam || tutorialData?.units?.[0]?.id;

  // ── Read userId from Redux auth state ──
  const { user } = useAppSelector((state: RootState) => state.authSlice);
  const userId = user?.sub ?? "";

  const { data, isLoading, error } = useQuery({
    queryKey: ["unitById", currentUnitId],
    queryFn: () => getUnitById(currentUnitId!),
    enabled: !!currentUnitId,
  });

  const { data: progressData } = useQuery({
    queryKey: ["unitProgress", userId, tutorialId],
    queryFn: () => getAllUnitProgressByTutorialAndUser(userId, tutorialId),
    enabled: !!userId && !!tutorialId,
  });

  const mutation = useMutation({
    mutationFn: (input: CreateProgressInput) => createUnitProgress(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unitProgress", userId, tutorialId] });
    },
    onError: (err) => {
      console.error("Error saving progress:", err);
    },
  });

  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);
  const [mdxLoading, setMdxLoading] = useState(false);

  useEffect(() => {
    if (!data?.content) { setMdxSource(null); return; }
    setMdxLoading(true);
    serializeMDX(data.content).then(setMdxSource).finally(() => setMdxLoading(false));
  }, [data?.content]);

  const contentLoading = isLoading || mdxLoading;

  const currentUnitProgress = progressData?.find((p: any) => p.unit.id === currentUnitId);
  const isCompleted = currentUnitProgress?.isCompleted;
  const isPending = mutation.isPending;

  return (
    <main className="flex-1 flex flex-col h-full min-h-0 relative border border-surface-800 overflow-hidden">

      {/* ── Persistent top bar — all screen sizes ── */}
      <div className="shrink-0 flex items-center gap-2 px-3 sm:px-5 py-2.5 border-b border-surface-800 bg-surface-900 relative overflow-hidden">

        {/* Left accent bar */}
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-emerald-glow [box-shadow:0_0_8px_var(--shadow-emerald)]" />

        {/* Back button — goes to previous route */}
        <button
          onClick={() => router.push('/')}
          className="
            group flex items-center gap-1.5
            border border-surface-700 bg-surface-950
            text-text-secondary hover:text-teal-glow hover:border-teal-glow
            text-[9px] font-digital font-black uppercase tracking-wider
            px-2.5 py-1.5 transition-colors duration-200 shrink-0
            [clip-path:polygon(0_0,calc(100%-5px)_0,100%_5px,100%_100%,5px_100%,0_calc(100%-5px))]
          "
          aria-label="Go back"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          <span className="hidden sm:inline">Back</span>
        </button>

        {/* Divider */}
        <span className="h-4 w-px bg-surface-700 shrink-0" />

        {/* Tutorials list link */}
        <Link
          href="/tutorials/list"
          className="
            group flex items-center gap-1.5
            border border-surface-700 bg-surface-950
            text-text-secondary hover:text-purple-glow hover:border-purple-glow
            text-[9px] font-digital font-black uppercase tracking-wider
            px-2.5 py-1.5 transition-colors duration-200 shrink-0
            [clip-path:polygon(0_0,calc(100%-5px)_0,100%_5px,100%_100%,5px_100%,0_calc(100%-5px))]
          "
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
            <path d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          <span className="hidden sm:inline">Tutorials</span>
        </Link>

        {/* Divider */}
        <span className="h-4 w-px bg-surface-700 shrink-0" />

        {/* Units toggle — mobile only */}
        <button
          onClick={onOpenUnits}
          className="
            lg:hidden flex items-center gap-1.5
            border border-surface-700 bg-surface-950
            text-text-secondary hover:text-teal-glow hover:border-teal-glow
            text-[9px] font-digital font-black uppercase tracking-wider
            px-2.5 py-1.5 transition-colors duration-200 shrink-0
            [clip-path:polygon(0_0,calc(100%-5px)_0,100%_5px,100%_100%,5px_100%,0_calc(100%-5px))]
          "
          aria-label="Open units list"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
            <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
          </svg>
          <span>Units</span>
        </button>

        {/* Current unit breadcrumb — fills remaining space */}
        {data && (
          <span className="flex-1 min-w-0 text-[9px] font-terminal text-text-secondary opacity-40 truncate ml-1">
            <span className="text-teal-glow/40 mr-1">{">"}</span>
            {data.unitTitle}
          </span>
        )}

        {/* ── Complete Toggle ── */}
        {userId && data && (
          <button
            disabled={isPending}
            onClick={() => mutation.mutate({ userId, unitId: data.id, isCompleted: !isCompleted })}
            className={`
              ml-auto flex items-center gap-1.5
              border text-[9px] font-digital font-black uppercase tracking-wider
              px-3 py-1.5 transition-all duration-200 shrink-0
              [clip-path:polygon(0_0,calc(100%-5px)_0,100%_5px,100%_100%,5px_100%,0_calc(100%-5px))]
              ${isCompleted
                ? "bg-emerald-glow/20 border-emerald-glow text-emerald-glow shadow-glow-emerald-sm"
                : "bg-surface-950 border-surface-700 text-text-secondary hover:text-teal-glow hover:border-teal-glow"
              }
              ${isPending ? "animate-pulse opacity-50" : ""}
            `}
          >
            <span className="text-[10px]">{isCompleted ? "✓" : "○"}</span>
            <span className="hidden sm:inline">{isCompleted ? "Completed" : "Mark Complete"}</span>
          </button>
        )}
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-5">

        {contentLoading && (
          <div className="flex flex-col items-center justify-center gap-3 min-h-[200px]">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-1.5 h-1.5 bg-teal-glow animate-pulse"
                  style={{ animationDelay: `${i * 200}ms` }} />
              ))}
            </div>
            <span className="text-[9px] font-terminal text-text-secondary uppercase tracking-[0.3em] animate-pulse">
              Loading_Unit...
            </span>
          </div>
        )}

        {!contentLoading && (error || !data) && (
          <div className="flex items-center justify-center p-8">
            <div className="border border-red-500/30 bg-red-500/5 px-6 py-4 max-w-sm w-full [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,10px_100%,0_calc(100%-10px))]">
              <p className="text-[10px] font-terminal text-red-400">
                <span className="opacity-50 mr-1">{">"}</span>
                Failed to load unit data.
              </p>
            </div>
          </div>
        )}

        {!contentLoading && data && (
          <div className="max-w-3xl mx-auto w-full flex flex-col pb-20 px-2 sm:px-6 lg:px-10 pt-4 sm:pt-8">

            <div className="mb-6 sm:mb-8 pb-4 border-b border-surface-800">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-1 shrink-0 mt-1 self-stretch bg-purple-glow"
                  style={{ boxShadow: "0 0 8px var(--shadow-purple)", minHeight: "1.5rem" }} />
                <h3 className="text-xl sm:text-2xl font-digital font-black text-text-primary uppercase leading-tight tracking-wide">
                  {data.unitTitle}
                </h3>
              </div>
            </div>

            {mdxSource ? (
              <MDXContent source={mdxSource} />
            ) : (
              <div className="flex items-center gap-3 p-5 border border-dashed border-surface-700 [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,10px_100%,0_calc(100%-10px))]">
                <span className="text-[9px] font-digital font-black text-teal-glow tracking-wider">[EMPTY]</span>
                <span className="text-[10px] font-terminal text-text-secondary opacity-60">Data stream is void.</span>
              </div>
            )}
          </div>
        )}

        {!contentLoading && !data && !error && (
          <div className="h-full flex items-center justify-center">
            <span className="text-[9px] font-terminal text-text-secondary uppercase tracking-[0.3em] animate-pulse opacity-40">
              LOADING_UNIT_DATA...
            </span>
          </div>
        )}
      </div>
    </main>
  );
}
