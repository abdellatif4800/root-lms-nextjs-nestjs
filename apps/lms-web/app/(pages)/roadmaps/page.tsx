import { dehydrate, getRoadmap, getRoadmaps, HydrationBoundary, QueryClient } from "@repo/gql";
import { RoadmapsList, RoadmapViewPage } from "@repo/ui";
import { log } from "console";

export default async function page({ params }: any) {
  const queryClient = new QueryClient();

  // 👇 Prefetch on server
  await queryClient.prefetchQuery({
    queryKey: ['roadmaps'],
    queryFn: () => getRoadmaps(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="h-screen overflow-y-auto">  {/* 👈 add this wrapper */}
        <RoadmapsList isPublic={true} />
      </div>
    </HydrationBoundary>
  )
}

