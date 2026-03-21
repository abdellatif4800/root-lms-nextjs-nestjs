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
  sidebarOpen,
  onOpenUnits,
}: {
  tutorialData?: any;
  sidebarOpen?: boolean;
  onOpenUnits?: () => void;
}) {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();

  const tutorialId = params.tutorialId as string;
  const unitIdParam = searchParams.get("unitId");
  const currentUnitId = unitIdParam || tutorialData?.units?.[0]?.id;

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
    <main className="flex-1 flex flex-col h-full min-h-0 relative overflow-hidden bg-background">

      {/* ── Top Bar ── */}
      <div className="shrink-0 flex items-center gap-3 px-4 sm:px-6 py-3 border-b-2 border-ink bg-surface shadow-wire relative z-20">

        {/* Home Button */}
        <button
          onClick={() => router.push('/')}
          className="btn-wire p-2 shadow-[2px_2px_0px_0px_rgba(19,21,22,1)]"
          aria-label="Go home"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </button>

        {/* Back to list */}
        <Link
          href="/tutorials/list"
          className="btn-wire px-4 py-2 text-[10px] shadow-[2px_2px_0px_0px_rgba(19,21,22,1)] font-black uppercase tracking-widest  items-center gap-2 flex items-center"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          Library
        </Link>

        {/* Sidebar Toggle (Mobile/Closed) */}
        {!sidebarOpen && (
          <button
            onClick={onOpenUnits}
            className="btn-wire-teal px-4 py-2 text-[10px] shadow-[2px_2px_0px_0px_rgba(19,21,22,1)] font-black uppercase tracking-widest flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
            </svg>
            Units
          </button>
        )}

        {/* Unit Breadcrumb */}
        {data && (
          <div className="flex-1 min-w-0 flex items-center gap-2 ml-2">
            <span className="text-teal-primary font-mono text-xs font-black hidden sm:inline">{">"}</span>
            <span className="text-[10px] font-mono font-bold text-dust uppercase truncate">
              {data.unitTitle}
            </span>
          </div>
        )}

        {/* Complete Toggle */}
        {userId && data && (
          <button
            disabled={isPending}
            onClick={() => mutation.mutate({ userId, unitId: data.id, isCompleted: !isCompleted })}
            className={`
              ml-auto flex items-center gap-2
              border-2 border-ink px-4 py-2 text-[10px] font-black uppercase tracking-widest
              transition-all duration-200 shrink-0 shadow-[2px_2px_0px_0px_rgba(19,21,22,1)]
              ${isCompleted
                ? "bg-teal-primary text-background"
                : "bg-background text-ink hover:bg-surface"
              }
              ${isPending ? "animate-pulse opacity-50" : ""}
            `}
          >
            <span className="text-xs">{isCompleted ? "✓" : "○"}</span>
            <span className="hidden sm:inline">{isCompleted ? "Completed" : "Mark Done"}</span>
          </button>
        )}
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10 scroll-smooth">

        {contentLoading && (
          <div className="flex flex-col items-center justify-center gap-4 min-h-[300px]">
            <div className="w-12 h-12 border-4 border-ink border-t-teal-primary rounded-full animate-spin" />
            <span className="text-[10px] font-mono font-bold text-dust uppercase tracking-[0.3em]">
              Loading Lesson...
            </span>
          </div>
        )}

        {!contentLoading && (error || !data) && (
          <div className="flex items-center justify-center p-12">
            <div className="wire-card max-w-sm w-full p-8 border-ink/20 shadow-none text-center">
              <p className="text-xs font-bold text-ink/60 uppercase">
                Lesson failed to load.
              </p>
            </div>
          </div>
        )}

        {!contentLoading && data && (
          <div className="max-w-4xl mx-auto w-full flex flex-col pb-32">

            <div className="mb-10 pb-6 border-b-2 border-ink/10">
              <div className="flex flex-col gap-2">
                <span className="badge-tape w-fit">Lesson Section</span>
                <h1 className="text-3xl sm:text-5xl font-black text-ink uppercase tracking-tighter leading-tight mt-2">
                  {data.unitTitle}
                </h1>
              </div>
            </div>

            <div className="prose prose-slate max-w-none">
              {mdxSource ? (
                <MDXContent source={mdxSource} />
              ) : (
                <div className="p-10 border-2 border-ink border-dashed text-center">
                  <span className="text-xs font-mono font-bold text-dust uppercase">The lesson content is empty.</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
