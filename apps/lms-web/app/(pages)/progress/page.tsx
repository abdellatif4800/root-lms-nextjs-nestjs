import { dehydrate, getMe, getTutoialsInProgressByUser, getQuizProgressByUser, HydrationBoundary, QueryClient } from "@repo/gql";
import { ProgressPageContent } from "@repo/ui";

export default async function ProgressPage({ searchParams }: any) {
  const queryClient = new QueryClient()
  const { userId } = await searchParams

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['unitProgressByUser', userId],
      queryFn: () => getTutoialsInProgressByUser(userId),
    }),
    queryClient.prefetchQuery({
      queryKey: ['quizProgress', userId],
      queryFn: () => getQuizProgressByUser(userId),
    })
  ])

  const unitProgressByUser = queryClient.getQueryData(['unitProgressByUser', userId]);
  const quizProgressByUser = queryClient.getQueryData(['quizProgress', userId]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProgressPageContent
        unitProgressByUser={unitProgressByUser}
        quizProgressByUser={quizProgressByUser}
      />
    </HydrationBoundary>
  );
}
