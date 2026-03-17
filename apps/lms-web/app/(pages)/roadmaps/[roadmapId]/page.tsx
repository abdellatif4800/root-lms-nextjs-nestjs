import { dehydrate, getRoadmap, HydrationBoundary, QueryClient } from "@repo/gql";
import { RoadmapViewPage } from "@repo/ui";
import { log } from "console";

export default async function page({ params }: any) {
  const { roadmapId } = await params;
  const queryClient = new QueryClient();

  // 👇 Prefetch on server
  await queryClient.prefetchQuery({
    queryKey: ["roadmap", roadmapId],
    queryFn: () => getRoadmap(roadmapId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RoadmapViewPage roadmapId={roadmapId} />
    </HydrationBoundary>
  )
}

