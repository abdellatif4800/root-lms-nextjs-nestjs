import {
  getTutorials,
  dehydrate,
  HydrationBoundary,
  QueryClient,

} from "@repo/gql";
import { TutorialsPage } from "@repo/ui"
import { Suspense } from "react";

export default async function TutorialsListPage() {

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['tutorials'],
    queryFn: () => getTutorials({ publish: true }),
  })


  return (

    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading Tutorials...</div>}>
        <TutorialsPage isPublic={true} />
      </Suspense>
    </HydrationBoundary>
  );
}
