import { TutorialPageClient } from "@repo/ui";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  getUnitsByTutorialId,
  getAllUnitProgressByTutorialAndUser,
} from "@repo/gql";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{ tutorialId: string }>;
}

export default async function TutorialPage({ params }: PageProps) {
  const resolvedParams = await params;

  const queryClient = new QueryClient();

  const tutorialId = resolvedParams.tutorialId;
  const userId = "68bd5bc5-c684-49d2-add3-562c605b1b44";

  await queryClient.prefetchQuery({
    queryKey: ["tutorialById"],
    queryFn: () => getUnitsByTutorialId(tutorialId),
  });

  await queryClient.prefetchQuery({
    queryKey: ["unitProgress", userId, tutorialId],
    queryFn: () => getAllUnitProgressByTutorialAndUser(userId, tutorialId),
  });

  const tutorialData = queryClient.getQueryData(["tutorialById"]) as any;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading Tutorial...</div>}>
        <TutorialPageClient tutorialData={tutorialData} />
      </Suspense>
    </HydrationBoundary>
  );
}
