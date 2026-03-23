'use client'
import {
  getQuizById,
  useQuery,
  useMutation,
  useQueryClient,
  createQuizProgress,
  createUnitProgress,
} from "@repo/gql";
import { QuizViewer } from "@repo/ui";
import { useParams, useSearchParams } from "next/navigation";
import { RootState, useAppSelector } from "@repo/reduxSetup";
import { QuizHeader } from "./QuizHeader";

export function QuizContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const quizId = params.quizId as string;
  const unitId = searchParams.get("unitId");

  const { user } = useAppSelector((state: RootState) => state.authSlice);
  const userId = user?.sub ?? "";

  const { data: quiz, isLoading, error } = useQuery({
    queryKey: ["quizById", quizId],
    queryFn: () => getQuizById(quizId),
    enabled: !!quizId,
  });

  const quizMutation = useMutation({
    mutationFn: (input: any) => createQuizProgress(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizProgress", userId] });
    }
  });

  const unitMutation = useMutation({
    mutationFn: (input: any) => createUnitProgress(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unitProgress", userId] });
    }
  });

  const handleComplete = async (results: { score: number; answers: any[] }) => {
    if (!userId) return;

    await quizMutation.mutateAsync({
      userId,
      quizId,
      score: results.score,
      isCompleted: true
    });

    if (unitId) {
      await unitMutation.mutateAsync({
        userId,
        unitId,
        isCompleted: true
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-20">
        <div className="w-12 h-12 border-4 border-ink border-t-teal-primary rounded-full animate-spin mb-4" />
        <span className="text-[10px] font-mono font-black text-dust uppercase tracking-[0.3em]">
          Loading Assessment...
        </span>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-full flex items-center justify-center p-12">
        <div className="wire-card max-w-sm w-full p-8 border-red-500/30 text-center">
          <p className="text-xs font-bold text-ink uppercase">
            Failed to load quiz content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col font-sans overflow-y-auto custom-scrollbar bg-background ">
      <div className="p-3">
        {/* Specialized Quiz Header */}
        <QuizHeader />
      </div>

      {/* ── Header ── */}
      <div className="max-w-3xl mx-auto w-full mb-12">
        <div className="flex flex-col gap-2">
          <span className="badge-tape w-fit">Knowledge Check</span>
          <h1 className="text-4xl sm:text-5xl font-black text-ink uppercase tracking-tighter leading-tight mt-2">
            {quiz.title}
          </h1>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t-2 border-dashed border-ink/5">
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-mono font-bold text-dust uppercase">Pass Mark:</span>
              <span className="text-[10px] font-mono font-black text-teal-primary">{quiz.passMark || 70}%</span>
            </div>
            <div className="w-px h-3 bg-ink/10" />
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-mono font-bold text-dust uppercase">Questions:</span>
              <span className="text-[10px] font-mono font-black text-ink">{quiz.questions?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Viewer ── */}
      <div className="max-w-3xl mx-auto w-full">
        <QuizViewer
          quiz={quiz}
          onComplete={handleComplete}
          userId={userId}
        />
      </div>
    </div>
  );
}

