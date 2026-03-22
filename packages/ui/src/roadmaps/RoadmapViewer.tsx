"use client"
import { getRoadmap, useQuery } from '@repo/gql';
import { ReactFlowComponent } from '@repo/reactFlowSetup'
import { type Edge, type Node } from '@xyflow/react';

export function RoadmapViewPage({ roadmapId }: { roadmapId: string }) {
  const { data: roadmap, isLoading, isError } = useQuery({
    queryKey: ["roadmap", roadmapId],
    queryFn: () => getRoadmap(roadmapId),
  });

  if (isLoading) return (
    <div className="h-full w-full flex flex-col items-center justify-center p-20">
      <div className="w-12 h-12 border-4 border-ink border-t-teal-primary rounded-full animate-spin mb-4" />
      <span className="text-[10px] font-mono font-bold text-dust uppercase tracking-[0.3em]">
        Opening Blueprint...
      </span>
    </div>
  );

  if (isError) return (
    <div className="h-full w-full flex items-center justify-center p-12">
      <div className="wire-card max-w-sm w-full p-8 border-red-500/30 text-center shadow-none">
        <p className="text-xs font-bold text-ink uppercase">
          Failed to load study path.
        </p>
      </div>
    </div>
  );

  const nodes: Node[] = roadmap.nodes.map((n: any) => ({
    id: n.clientId,
    type: "tutorial",
    position: { x: n.positionX, y: n.positionY },
    data: { tutorial: n.tutorial },
  }));

  const edges: Edge[] = roadmap.edges.map((e: any) => ({
    id: e.id,
    source: e.sourceClientId,
    target: e.targetClientId,
    type: "step", // Use the new blueprint-style step edge
  }));

  return (
    <div className="h-full w-full flex flex-col overflow-hidden relative font-sans text-ink">

      {/* Top HUD bar */}
      <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b-2 border-ink bg-surface shadow-wire z-10">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="badge-tape w-fit mb-1">Study Path Overview</span>
            <h1 className="text-xl font-black uppercase tracking-tighter leading-none">
              {roadmap.title}
            </h1>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 border-2 border-ink px-4 py-2 bg-background shadow-[2px_2px_0px_0px_rgba(19,21,22,1)]">
            <div className="w-2 h-2 bg-teal-primary animate-pulse" />
            <span className="text-[10px] font-mono font-black uppercase tracking-widest">
              {nodes.length} Modules
            </span>
          </div>
        </div>
      </div>

      {/* Flow canvas */}
      <div className="flex-1 relative overflow-hidden bg-background">
        {/* Simple Drafting annotation */}
        <div className="absolute bottom-6 left-6 z-10 pointer-events-none border-l-2 border-ink/20 pl-3">
          <span className="block text-[8px] font-mono font-black uppercase text-dust tracking-[0.2em]">
            Mode: Interactive_View
          </span>
          <span className="block text-[8px] font-mono font-bold text-dust/40 uppercase">
            Draft_Ref: {roadmapId.slice(0, 8)}
          </span>
        </div>

        <ReactFlowComponent
          nodes={nodes}
          edges={edges}
          isEditable={false}
        />
      </div>
    </div>
  );
}
