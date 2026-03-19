import {
  getAllQuizzes,
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@repo/gql";
import { QuizList } from "@repo/ui";

export default async function WebQuizzesPage() {
  const queryClient = new QueryClient();

  // For the web app, we might only want to fetch published quizzes
  // For now, let's use allQuizzes and we can filter on the client or update the API
  await queryClient.prefetchQuery({
    queryKey: ["allQuizzes"],
    queryFn: () => getAllQuizzes(),
  });

  const quizzes = (queryClient.getQueryData(["allQuizzes"]) as any[]) || [];
  const publishedQuizzes = quizzes.filter(q => q.publish);

  return (
    <div className="min-h-screen bg-surface-950 flex flex-col pt-20">
      {/* ── Header ── */}
      <div className="max-w-7xl mx-auto w-full px-6 py-10">
        <div className="flex flex-col gap-2 border-l-2 border-teal-glow pl-6">
          <h1 className="text-3xl font-digital font-black text-text-primary uppercase tracking-widest">
            Assessment_Terminal
          </h1>
          <p className="text-[10px] font-terminal text-text-secondary uppercase tracking-[0.4em] opacity-60">
            // Validate_Your_Logic_Streams
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto w-full px-4">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <QuizList quizzes={publishedQuizzes} isAdmin={false} />
        </HydrationBoundary>
      </div>
    </div>
  );
}
