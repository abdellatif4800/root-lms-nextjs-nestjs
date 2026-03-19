import {
  getAllQuizzes,
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@repo/gql";
import { QuizList } from "@repo/ui";

export default async function QuizzesListPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["allQuizzes"],
    queryFn: () => getAllQuizzes(),
  });

  const quizzes = (queryClient.getQueryData(["allQuizzes"]) as any[]) || [];

  return (
    <div className="h-full flex flex-col min-h-0 bg-surface-950">
      {/* ── Header ── */}
      <div className="shrink-0 p-6 border-b border-surface-800 bg-surface-900/50 flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-teal-glow animate-pulse" />
            <h1 className="text-xl font-digital font-black text-text-primary uppercase tracking-wider">
              Quiz_Database
            </h1>
          </div>
          <p className="text-[10px] font-terminal text-text-secondary uppercase tracking-widest opacity-60">
            // Manage_Standalone_Assessments
          </p>
        </div>

        <a
          href="/quizzes/quizEditor?editOrCreate=create"
          className="px-6 py-2.5 bg-purple-glow text-black text-[10px] font-digital font-black uppercase tracking-widest hover:bg-white transition-all shadow-[4px_4px_0px_rgba(168,85,247,0.3)] active:translate-x-px active:translate-y-px active:shadow-none"
        >
          [+ Initialize_New_Quiz ]
        </a>
      </div>

      {/* ── Content ── */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <QuizList quizzes={quizzes} isAdmin={true} />
      </HydrationBoundary>
    </div>
  );
}
