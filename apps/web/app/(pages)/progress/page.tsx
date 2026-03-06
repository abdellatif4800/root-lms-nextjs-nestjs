import { dehydrate, getTutoialsInProgressByUser, HydrationBoundary, QueryClient } from "@repo/gql";
import { ProgressPageContent } from "@repo/ui";

export default async function ProgressPage() {
  const queryClient = new QueryClient()

  const userId = "c3b67ca3-44a1-4f05-a511-980758b24176"

  await queryClient.prefetchQuery({
    queryKey: ['unitProgressByUser', userId],
    queryFn: () => getTutoialsInProgressByUser(userId),
  })

  const unitProgressByUser = queryClient.getQueryData(['unitProgressByUser', userId]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProgressPageContent unitProgressByUser={unitProgressByUser} />
    </HydrationBoundary>
  );
}
