import { dehydrate, getMe, getTutoialsInProgressByUser, HydrationBoundary, QueryClient } from "@repo/gql";
import { ProgressPageContent } from "@repo/ui";

export default async function ProgressPage({ searchParams }: any) {
  const queryClient = new QueryClient()
  const { userId } = await searchParams

  await queryClient.prefetchQuery({
    queryKey: ['unitProgressByUser', userId],
    queryFn: () => getTutoialsInProgressByUser(userId),
  })

  const unitProgressByUser = queryClient.getQueryData(['unitProgressByUser', userId]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProgressPageContent
        unitProgressByUser={unitProgressByUser}
      />
    </HydrationBoundary>
  );
}
