import { CreateRoadmapPage } from "@repo/ui";
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
    <div className="w-full h-screen flex flex-col bg-surface-950 overflow-hidden">
      {editOrCreateParam === "create" && (
        <CreateRoadmapPage className="w-full h-full" />
      )}
      {editOrCreateParam === "edit" && (
        <CreateRoadmapPage className="w-full h-full" initialData={roadmapById} />
      )}
    </div>
  );
}
