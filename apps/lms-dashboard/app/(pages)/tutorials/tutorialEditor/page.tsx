import Link from "next/link";
import {
  getTutorials,
  dehydrate,
  HydrationBoundary,
  QueryClient,
  getTutorialById,

} from "@repo/gql";
import { CreateTutorialPage } from "@repo/ui";
import { log } from "console";


type PageProps = {
  editOrCreate?: string,
  tutorialId?: string
}



export default async function TutorialsListPage({ searchParams }: {
  searchParams: Promise<PageProps>
}) {
  const queryParams = await searchParams

  const queryClient = new QueryClient()

  if (queryParams.editOrCreate === "edit" && queryParams.tutorialId) {
    await queryClient.prefetchQuery({
      queryKey: ['tutorialById', queryParams.tutorialId],
      queryFn: () => getTutorialById(queryParams.tutorialId || ''),
    })
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CreateTutorialPage tutorialId={queryParams.tutorialId || ''} />
    </HydrationBoundary>
  );

}
