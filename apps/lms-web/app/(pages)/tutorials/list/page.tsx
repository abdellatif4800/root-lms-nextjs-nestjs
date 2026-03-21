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

  // Match the query key used in the component: ["tutorials", { publish: true }]
  await queryClient.prefetchQuery({
    queryKey: ['tutorials', { publish: true }],
    queryFn: () => getTutorials({ publish: true }),
  })


  return (

    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div className="p-10 font-mono text-xs uppercase opacity-50">Loading Tutorials...</div>}>
        <TutorialsPage isPublic={true} />
      </Suspense>
    </HydrationBoundary>
  );
}
