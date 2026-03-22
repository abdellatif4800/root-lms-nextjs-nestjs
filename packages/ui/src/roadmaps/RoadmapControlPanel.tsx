"use client";
import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { createFullRoadmap } from "@repo/gql";
import { 
  useDispatch, 
  useSelector, 
  RootState,
  updateNode,
  addEdge,
  removeEdge,
  removeNode
} from "@repo/reduxSetup";
import { useRouter } from "next/navigation";
import { type Node, type Edge } from "@xyflow/react";
import { TutorialDropdown } from "@repo/reactFlowSetup";

interface RoadmapControlPanelProps {
  currentNode: Node | null;
  initialData?: any;
}

export function RoadmapControlPanel({ currentNode, initialData }: RoadmapControlPanelProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.authSlice);
  
  // Roadmap Meta State
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [authorId, setAuthorId] = useState(user?.sub);

  const reduxNodes = useSelector((state: RootState) => state.roadmapSlice.nodes);
  const reduxEdges = useSelector((state: RootState) => state.roadmapSlice.edges);

  useEffect(() => {
    if (!initialData) return;
    if (initialData.title) setTitle(initialData.title);
    if (initialData.description) setDescription(initialData.description);
    if (initialData.authorId) setAuthorId(initialData.authorId);
  }, [initialData]);

  // --- Roadmap Mutation ---
  const mutation = useMutation({
    mutationFn: createFullRoadmap,
    onSuccess: () => router.push("/roadmaps/list"),
    onError: (error) => console.error("Save failed:", error),
  });

  const handleSaveRoadmap = () => {
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

  // --- Node Actions ---
  const handleDeleteNode = () => {
    if (currentNode) dispatch(removeNode(currentNode.id));
  };

  const handleUpdateNodePos = (field: 'x' | 'y', value: number) => {
    if (!currentNode) return;
    dispatch(updateNode({ 
      id: currentNode.id, 
      changes: { position: { ...currentNode.position, [field]: value } } 
    }));
  };

  const handleAddEdge = (targetNodeId: string) => {
    if (!currentNode) return;
    const newEdge: Edge = {
      id: `e${currentNode.id}-${targetNodeId}`,
      source: currentNode.id,
      target: targetNodeId,
      type: "step",
    };
    dispatch(addEdge(newEdge));
  };

  const handleRemoveEdge = (edgeId: string) => {
    dispatch(removeEdge(edgeId));
  };

  const connectedEdges = currentNode
    ? reduxEdges.filter(e => e.source === currentNode.id || e.target === currentNode.id)
    : [];

  return (
    <div className="h-full flex flex-col gap-6 font-mono text-ink">
      
      {/* 1. GLOBAL ROADMAP CONFIG */}
      <section className="space-y-4 border-b-2 border-ink pb-6">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-dust">
            {"//"} SYSTEM_META
          </span>
          <button
            onClick={handleSaveRoadmap}
            disabled={mutation.isPending}
            className="btn-wire-teal py-1.5 px-4 text-[9px] font-black tracking-widest"
          >
            {mutation.isPending ? "[ SAVING... ]" : "[ COMMIT_PATH ]"}
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-black uppercase tracking-widest opacity-60">Title_String</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-background border border-ink p-2 text-[10px] font-bold focus:ring-1 focus:ring-teal-primary/50 outline-none"
              placeholder="ENTER_NAME..."
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-black uppercase tracking-widest opacity-60">Description_Blob</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-background border border-ink p-2 text-[10px] font-bold focus:ring-1 focus:ring-teal-primary/50 outline-none h-16 resize-none"
              placeholder="ENTER_PURPOSE..."
            />
          </div>
        </div>
      </section>

      {/* 2. LIBRARY / ADD NODE */}
      <section className="space-y-3">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-dust">
          {"//"} COMPONENT_LIBRARY
        </span>
        <TutorialDropdown />
      </section>

      {/* 3. NODE INSPECTOR */}
      <section className="flex-1 flex flex-col gap-4 min-h-0">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-dust">
          {"//"} NODE_INSPECTOR
        </span>

        {currentNode ? (
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 animate-[fadeSlideIn_0.3s_ease_forwards]">
            
            {/* Basic Info */}
            <div className="space-y-3 border-l-2 border-teal-primary pl-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-ink uppercase">Module: {currentNode.id.slice(0, 8)}</span>
                <button onClick={handleDeleteNode} className="text-red-500 text-[8px] font-black uppercase hover:underline">
                  [ DESTROY ]
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[7px] font-bold uppercase opacity-50">Pos_X</label>
                  <input
                    type="number"
                    value={Math.round(currentNode.position.x)}
                    onChange={(e) => handleUpdateNodePos('x', Number(e.target.value))}
                    className="w-full bg-background border border-ink p-1.5 text-[10px] font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[7px] font-bold uppercase opacity-50">Pos_Y</label>
                  <input
                    type="number"
                    value={Math.round(currentNode.position.y)}
                    onChange={(e) => handleUpdateNodePos('y', Number(e.target.value))}
                    className="w-full bg-background border border-ink p-1.5 text-[10px] font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Connections */}
            <div className="space-y-3">
              <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Active_Connections</span>
              <div className="space-y-2">
                {connectedEdges.length === 0 && <span className="text-[8px] italic opacity-40">No topological links.</span>}
                {connectedEdges.map(edge => (
                  <div key={edge.id} className="border border-ink p-2 bg-ink/5 flex items-center justify-between text-[8px] group">
                    <span className="font-bold opacity-60">TO: {edge.target.slice(0, 8)}</span>
                    <button onClick={() => handleRemoveEdge(edge.id)} className="text-red-500 font-black opacity-0 group-hover:opacity-100 transition-opacity">
                      [ DEL ]
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Link */}
            <div className="space-y-2 pt-2 border-t border-ink/10">
              <label className="text-[8px] font-black uppercase tracking-widest opacity-60">Manual_Link_Inject</label>
              <div className="flex gap-2">
                <input
                  id="targetNodeId"
                  type="text"
                  placeholder="Target_ID"
                  className="flex-1 bg-background border border-ink p-1.5 text-[9px] font-mono"
                />
                <button
                  onClick={() => {
                    const input = document.getElementById('targetNodeId') as HTMLInputElement;
                    if (input?.value) handleAddEdge(input.value);
                    input.value = '';
                  }}
                  className="bg-ink text-background px-3 py-1 text-[8px] font-black uppercase hover:bg-teal-primary transition-colors"
                >
                  Link
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div className="flex-1 border-2 border-ink border-dashed flex flex-col items-center justify-center p-6 opacity-40">
            <span className="text-[8px] font-black uppercase text-center tracking-widest">
              Awaiting_Node_Selection<br/>[ Cursor_Signal_Idle ]
            </span>
          </div>
        )}
      </section>

      {/* FOOTER STATS */}
      <section className="pt-4 border-t-2 border-ink flex justify-between items-center text-[7px] font-black opacity-40">
        <span>NODES: {reduxNodes.length}</span>
        <span>LINKS: {reduxEdges.length}</span>
      </section>
    </div>
  );
}
