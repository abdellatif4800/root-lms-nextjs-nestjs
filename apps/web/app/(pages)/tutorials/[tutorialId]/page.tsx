import { ContentArea, UnitsList } from "@repo/ui";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  getTutorialById,
  getUnitsByTutorialId,
  getAllUnitProgressByTutorialAndUser,

} from "@repo/gql";
import { log } from "console";


interface PageProps {
  tutorialId: Promise<{ tutorialId: string }>;
}


export default async function TutorialPage({ params }: PageProps) {
  const resolvedParams = await params

  const queryClient = new QueryClient()


  const tutorialId = resolvedParams.tutorialId;
  const userId = "c3b67ca3-44a1-4f05-a511-980758b24176"

  await queryClient.prefetchQuery({
    queryKey: ['tutorialById'],
    queryFn: () => getUnitsByTutorialId(tutorialId),
  })

  await queryClient.prefetchQuery({
    queryKey: ['unitProgress', userId, tutorialId],
    queryFn: () =>
      getAllUnitProgressByTutorialAndUser(userId, tutorialId),
  });

  const tutorialData = queryClient.getQueryData(['tutorialById']);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>

      {/* Tutorial page wrapper — drop-in replacement for the inline div */}
      <div className="
  h-full w-full bg-surface-950
  flex gap-4 overflow-hidden
  font-terminal text-text-primary min-h-0

" >
        <UnitsList firstUnit={tutorialData.units[0].id} />


        <ContentArea tutorialData={tutorialData} />
      </div>
    </HydrationBoundary>
  );
}
