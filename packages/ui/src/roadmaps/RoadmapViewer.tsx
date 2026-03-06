"use client"
import { getRoadmap, useQuery } from '@repo/gql';
import { Edge, Node, AdminPanel, ReactFlowComponent } from '@repo/reactFlowSetup'
import { RootState, setEdges, updateNode, useDispatch, useSelector } from '@repo/reduxSetup';
import { useEffect, useState } from 'react';

export function RoadmapViewPage({ roadmapId }: { roadmapId: string }) {
  const { data: roadmap, isLoading, isError } = useQuery({
    queryKey: ["roadmap", roadmapId],
    queryFn: () => getRoadmap(roadmapId),
  });

  if (isLoading) return (
    <div className="h-full w-full bg-surface-950 flex flex-col items-center justify-center gap-4">
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-2 h-2 bg-purple-glow animate-pulse"
            style={{
              animationDelay: `${i * 200}ms`,
              boxShadow: "0 0 6px var(--shadow-purple)",
              clipPath: "polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))"
            }}
          />
        ))}
      </div>
      <span className="text-[9px] font-terminal text-text-secondary uppercase tracking-[0.3em] animate-pulse opacity-60">
        Initializing_Roadmap...
      </span>
    </div>
  );

  if (isError) return (
    <div className="h-full w-full bg-surface-950 flex items-center justify-center p-8">
      <div
        className="border border-red-500/30 bg-red-500/5 px-6 py-4 max-w-sm w-full"
        style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}
      >
        <p className="text-[10px] font-terminal text-red-400 uppercase tracking-wider">
          <span className="opacity-50 mr-2">{">"}</span>
          Failed to load roadmap
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
    type: "default",
  }));

  return (
    <div className="h-full w-full bg-surface-950 flex flex-col overflow-hidden relative">

      {/* Top HUD bar */}
      <div className="shrink-0 flex items-center justify-between px-5 py-3 border-b border-surface-800 bg-surface-900/80 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <span className="block w-0.5 h-5 bg-purple-glow"
            style={{ boxShadow: "0 0 6px var(--shadow-purple)" }} />
          <div>
            <h1 className="text-sm font-digital font-black text-text-primary uppercase tracking-wider leading-none">
              {roadmap.title}
            </h1>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border border-surface-700 px-3 py-1.5">
            <span className="w-1.5 h-1.5 bg-purple-glow animate-pulse"
              style={{ boxShadow: "0 0 4px var(--shadow-purple)" }} />
            <span className="text-sm font-terminal uppercase tracking-[0.2em] text-text-secondary">
              <span className="text-purple-glow font-bold">{nodes.length}</span>
              <span className="ml-1 opacity-50">Tutorials</span>
            </span>
          </div>
        </div>
      </div>

      {/* Flow canvas */}
      <div className="flex-1 relative overflow-hidden border border-purple-glow/30"
        style={{ boxShadow: "inset 0 0 40px rgba(0,0,0,0.3)" }}>
        {/* Corner brackets */}
        {/* <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-purple-glow/40 pointer-events-none z-10" /> */}
        {/* <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-purple-glow/40 pointer-events-none z-10" /> */}
        {/* <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-purple-glow/40 pointer-events-none z-10" /> */}
        {/* <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-purple-glow/40 pointer-events-none z-10" /> */}

        {/* Status tag */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <span className="flex items-center gap-1.5 text-[7px] font-terminal uppercase tracking-[0.25em] text-text-secondary opacity-30">
            <span className="w-1 h-1 bg-emerald-glow" />
            READ_ONLY_MODE
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



// "use client"
//
// import { getRoadmap, useQuery } from '@repo/gql';
// import { Edge, Node, AdminPanel, ReactFlowComponent } from '@repo/reactFlowSetup'
// import { RootState, setEdges, updateNode, useDispatch, useSelector } from '@repo/reduxSetup';
// import { useEffect, useState } from 'react';
//
//
// export function RoadmapViewPage({ roadmapId }: { roadmapId: string }) {
//
//   const { data: roadmap, isLoading, isError } = useQuery({
//     queryKey: ["roadmap", roadmapId],
//     queryFn: () => getRoadmap(roadmapId),
//   });
//
//   if (isLoading) return <div>Loading...</div>;
//   if (isError) return <div>Failed to load roadmap</div>;
//
//   const nodes: Node[] = roadmap.nodes.map((n: any) => ({
//     id: n.clientId,
//     type: "tutorial",
//     position: { x: n.positionX, y: n.positionY },
//     data: { tutorial: n.tutorial },
//   }));
//
//   const edges: Edge[] = roadmap.edges.map((e: any) => ({
//     id: e.id,
//     source: e.sourceClientId,
//     target: e.targetClientId,
//     type: "default",
//   }));
//
//
//
//   return (
//
//     <div className="h-full w-full border border-purple-glow relative">
//
//       <ReactFlowComponent
//         nodes={nodes}
//         edges={edges}
//         isEditable={false}
//       />
//     </div>
//   )
// }
//
