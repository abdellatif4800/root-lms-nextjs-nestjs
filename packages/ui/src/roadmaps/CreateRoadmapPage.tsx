"use client";
import { AdminPanel, ReactFlowComponent } from "@repo/reactFlowSetup";
import { RootState, setEdges, setNodes, updateNode, useDispatch, useSelector } from "@repo/reduxSetup";
import { useEffect } from "react";

export function CreateRoadmapPage({
  className,
  initialData,
}: {
  className?: string;
  initialData?: any;
}) {
  const dispatch = useDispatch();
  const currentNode = useSelector((state: RootState) => state.roadmapSlice.currentNode);
  const reduxNodes = useSelector((state: RootState) => state.roadmapSlice.nodes);
  const reduxEdges = useSelector((state: RootState) => state.roadmapSlice.edges);

  useEffect(() => {
    if (!initialData) return;

    if (initialData.nodes?.length) {
      const flowNodes = initialData.nodes.map((n: any) => ({
        id: n.clientId,
        type: "tutorial",
        position: { x: n.positionX, y: n.positionY },
        data: { tutorial: n.tutorial },
      }));
      dispatch(setNodes(flowNodes));
    }

    if (initialData.edges?.length) {
      const flowEdges = initialData.edges.map((e: any) => ({
        id: e.id,
        source: e.sourceClientId,
        target: e.targetClientId,
        type: "step",
      }));
      dispatch(setEdges(flowEdges));
    }
  }, [initialData]);

  return (
    <div className={`flex flex-row h-[calc(100vh-10rem)] gap-4 w-full p-2 bg-background ${className ?? ""}`}>
      {/* Configuration Sidebar */}
      <div className="w-1/4 h-full bg-surface border-2 border-ink shadow-wire overflow-hidden flex flex-col relative">
        {/* Drafting Corner Decor */}
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-ink opacity-20" />
        
        <div className="p-3 border-b-2 border-ink bg-background/20 shrink-0">
          <h3 className="font-mono font-black text-ink text-sm tracking-widest uppercase flex items-center gap-2">
            <span className="w-2 h-2 bg-teal-primary" />
            Node_Configuration
          </h3>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          <AdminPanel currentNode={currentNode} />
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 min-h-0 border-2 border-ink bg-background shadow-wire relative overflow-hidden flex flex-col">
        <div className="p-3 border-b-2 border-ink bg-surface/50 flex justify-between items-center z-10">
          <h3 className="font-mono font-black text-teal-primary text-sm tracking-widest uppercase">
            Architectural_Blueprint
          </h3>
          <span className="text-[10px] font-mono font-black text-dust uppercase tracking-[0.2em] opacity-60">
            Mode: Interactive_Drafting
          </span>
        </div>

        <div className="flex-1 relative z-0">
          <ReactFlowComponent
            nodes={reduxNodes}
            edges={reduxEdges}
            setNodes={(newNodes: any) => {
              const nodesArray =
                typeof newNodes === "function" ? newNodes(reduxNodes) : newNodes;
              nodesArray.forEach((node: any) => {
                dispatch(updateNode({ id: node.id, changes: node }));
              });
            }}
            setEdges={(newEdges: any) => {
              const edgesArray = typeof newEdges === "function" ? newEdges(reduxEdges) : newEdges;
              dispatch(setEdges(edgesArray));
            }}
            isEditable={true}
          />
        </div>

        {/* Bottom Annotation */}
        <div className="absolute bottom-4 right-4 z-10 pointer-events-none text-right">
          <span className="block text-[8px] font-mono font-black text-dust uppercase tracking-[0.3em]">
            SYSTEM: FLOW_V4.0
          </span>
          <span className="block text-[8px] font-mono font-bold text-dust/30 uppercase">
            Coord_Sync: Active
          </span>
        </div>
      </div>
    </div>
  );
}
