import { CreateRoadmapPage, RoadmapForm } from "@repo/ui";
import { getRoadmap, QueryClient } from "@repo/gql";

type PageProps = {
  searchParams?: {
    editOrCreate?: string;
    roadmapId?: string;
  };
};

export default async function Page({ searchParams }: PageProps) {
  const queryParams = await searchParams;
  const editOrCreateParam = queryParams?.editOrCreate;
  const roadmapId = queryParams?.roadmapId;

  const queryClient = new QueryClient();
  if (editOrCreateParam === "edit" && !!roadmapId) {
    await queryClient.prefetchQuery({
      queryKey: ["roadmap", roadmapId],
      queryFn: () => getRoadmap(roadmapId),
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const roadmapById = queryClient.getQueryData(["roadmap", roadmapId]) as any;

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-surface-950">
      {editOrCreateParam === "create" && (
        <div className="mdxContent w-full h-full flex flex-col justify-start items-center p-5 overflow-auto gap-6">
          <RoadmapForm />
          <CreateRoadmapPage className="w-full max-w-7xl" />
        </div>
      )}
      {editOrCreateParam === "edit" && (
        <div className="mdxContent w-full h-full flex flex-col justify-start items-center p-5 overflow-auto gap-6">
          <RoadmapForm initialData={roadmapById} />
          <CreateRoadmapPage className="w-full max-w-7xl" initialData={roadmapById} />
        </div>
      )}
    </div>
  );
}
