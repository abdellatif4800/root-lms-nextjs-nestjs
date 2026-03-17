import { dehydrate, getRoadmaps, HydrationBoundary, QueryClient } from "@repo/gql";
import { RoadmapsList } from "@repo/ui";

export default async function page() {

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['roadmaps'],
    queryFn: () => getRoadmaps(),
  })


  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RoadmapsList isPublic={false} />
    </HydrationBoundary>
  );
}

