"use client";
import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { createFullRoadmap } from "@repo/gql";
import { RootState, useSelector } from "@repo/reduxSetup";
import { useRouter } from "next/navigation";

export function RoadmapForm({ initialData }: { initialData?: any }) {
  const { user } = useSelector((state: RootState) => state.authSlice);
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [authorId, setAuthorId] = useState(user?.sub);
  const router = useRouter();

  useEffect(() => {
    if (!initialData) return;
    if (initialData.title) setTitle(initialData.title);
    if (initialData.description) setDescription(initialData.description);
    if (initialData.authorId) setAuthorId(initialData.authorId);
  }, [initialData]);

  const reduxNodes = useSelector((state: RootState) => state.roadmapSlice.nodes);
  const reduxEdges = useSelector((state: RootState) => state.roadmapSlice.edges);

  const mutation = useMutation({
    mutationFn: createFullRoadmap,
    onSuccess: () => router.push("/roadmaps/list"),
    onError: (error) => {
      console.error(error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nodes = reduxNodes.map((node) => ({
      clientId: node.id,
      tutorialId: (node.data as any).tutorial.id,
      positionX: node.position.x,
      positionY: node.position.y,
    }));
    const edges = reduxEdges.map((edge) => ({
      sourceNodeId: edge.source,
      targetNodeId: edge.target,
    }));
    mutation.mutate({ title, description, authorId, nodes, edges });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-5xl p-8 bg-surface border-2 border-ink shadow-wire relative flex flex-col gap-8"
    >
      {/* Drafting Corner Decor */}
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-ink opacity-20" />

      <div className="flex flex-row   items-center justify-between border-b-2 border-ink pb-6">
        <h2 className="text-2xl font-mono font-black text-ink uppercase tracking-tighter">
          Configure Path
        </h2>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="btn-wire-teal px-8 py-3 text-[10px] font-black tracking-widest min-w-[160px]"
        >
          {mutation.isPending ? "[ PROCESSING... ]" : initialData ? "[ SAVE_CHANGES ]" : "[ INITIALIZE_PATH ]"}
        </button>
      </div>

      {mutation.isError && (
        <div className="p-3 bg-red-500/10 border-2 border-red-500 text-red-500 text-[10px] font-mono font-black uppercase text-center">
          Error: Failed to synchronize architectural data.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-mono font-black text-ink uppercase tracking-widest pl-1 opacity-60">
            Roadmap_Title
          </label>
          <input
            className="w-full bg-background border-2 border-ink text-ink text-sm font-bold p-3 focus:outline-none focus:ring-2 focus:ring-teal-primary/20 placeholder:text-dust/40 transition-all font-mono"
            placeholder="ENTER_TITLE_STRING..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-mono font-black text-ink uppercase tracking-widest pl-1 opacity-60">
            Architectural_Description
          </label>
          <textarea
            className="w-full bg-background border-2 border-ink text-ink text-sm font-bold p-3 focus:outline-none focus:ring-2 focus:ring-teal-primary/20 placeholder:text-dust/40 transition-all font-mono h-32 resize-none"
            placeholder="ENTER_DETAILED_DESCRIPTION..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 text-[9px] font-mono font-bold text-dust uppercase tracking-widest">
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-ink" />
          Nodes: {reduxNodes.length}
        </span>
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-ink" />
          Links: {reduxEdges.length}
        </span>
      </div>
    </form>
  );
}
