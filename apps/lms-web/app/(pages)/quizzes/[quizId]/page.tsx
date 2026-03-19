"use client";

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
import { Suspense } from "react";

function QuizContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  
  const quizId = params.quizId as string;
  const unitId = searchParams.get("unitId");

  // ── Read userId from Redux auth state ──
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
      // Invalidate unit progress queries
      queryClient.invalidateQueries({ queryKey: ["unitProgress", userId] });
    }
  });

  const handleComplete = async (results: { score: number; answers: any[] }) => {
    if (!userId) return;

    // 1. Save quiz progress
    await quizMutation.mutateAsync({
      userId,
      quizId,
      score: results.score,
      isCompleted: true
    });

    // 2. If launched from a unit, mark unit as completed
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
      <div className="min-h-screen flex items-center justify-center p-6">
        <span className="text-[10px] font-terminal text-teal-glow uppercase animate-pulse">
          // INITIALIZING_QUIZ_DATA...
        </span>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="border border-red-500/30 bg-red-500/5 px-6 py-4 max-w-sm w-full [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,10px_100%,0_calc(100%-10px))]">
          <p className="text-[10px] font-terminal text-red-400 uppercase tracking-widest">
            <span className="opacity-50 mr-1">{">"}</span>
            Error: Quiz_Not_Found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pt-24 pb-12 px-4 sm:px-6">
      {/* ── Quiz Header ── */}
      <div className="max-w-2xl mx-auto w-full mb-10">
        <div className="flex flex-col gap-1 border-l-2 border-purple-glow pl-5">
          <h1 className="text-2xl font-digital font-black text-text-primary uppercase tracking-wider">
            {quiz.title}
          </h1>
          <p className="text-[10px] font-terminal text-text-secondary uppercase tracking-[0.2em] opacity-60">
            // Assessment_Module_Active
          </p>
        </div>
      </div>

      {/* ── Viewer ── */}
      <QuizViewer 
        quiz={quiz} 
        onComplete={handleComplete} 
      />
    </div>
  );
}

export default function StudentQuizPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface-950 flex items-center justify-center p-6">
        <span className="text-[10px] font-terminal text-teal-glow uppercase animate-pulse">
          // LOADING_QUIZ_ENVIRONMENT...
        </span>
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}
