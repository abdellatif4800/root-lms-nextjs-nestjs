// app/quizzes/page.tsx  (or wherever your quiz editor route lives)
import { dehydrate, HydrationBoundary, QueryClient } from "@repo/gql";
import { getQuizById } from "@repo/gql";
import { QuizEditorRoot } from "@repo/ui";

type PageProps = {
  searchParams: Promise<{
    editOrCreate?: string;
    quizId?: string;
  }>;
};

export default async function QuizPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const queryClient = new QueryClient();

  // prefetch quiz data if editing
  if (params.editOrCreate === "edit" && params.quizId) {
    await queryClient.prefetchQuery({
      queryKey: ["quizById", params.quizId],
      queryFn: () => getQuizById(params.quizId!),
    });
  }

  return (
    <div className="w-full h-screen flex flex-col bg-surface-950 overflow-hidden">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <QuizEditorRoot
          editOrCreate={params.editOrCreate as "edit" | "create"}
          quizId={params.quizId}
        />
      </HydrationBoundary>
    </div>
  );
}

