'use client'
import React, { useState, useEffect } from "react";
import { type Node, type Edge } from "@xyflow/react";
import { useDispatch, useSelector, RootState } from "@repo/reduxSetup";
import {
  updateNode,
  addEdge,
  updateEdge,
  removeEdge,
  removeNode,
} from "@repo/reduxSetup";
import { useMutation } from "@tanstack/react-query";
import { createFullRoadmap } from "@repo/gql";
import { useRouter } from "next/navigation";
import { TutorialDropdown } from "./customComponents/TutorialsDropdwon";

interface RoadmapEditorPanelProps {
  currentNode: Node | null;
  initialData?: any;
}

export function RoadmapEditorPanel({ currentNode, initialData }: RoadmapEditorPanelProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const edges = useSelector((state: RootState) => state.roadmapSlice.edges);
  const nodes = useSelector((state: RootState) => state.roadmapSlice.nodes);
  const { user } = useSelector((state: RootState) => state.authSlice);

  // Roadmap Form State
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [authorId, setAuthorId] = useState(user?.sub);

  useEffect(() => {
    if (user?.sub) setAuthorId(user.sub);
  }, [user]);

  useEffect(() => {
    if (!initialData) return;
    if (initialData.title) setTitle(initialData.title);
    if (initialData.description) setDescription(initialData.description);
    if (initialData.authorId) setAuthorId(initialData.authorId);
  }, [initialData]);

  const mutation = useMutation({
    mutationFn: createFullRoadmap,
    onSuccess: () => router.push("/roadmaps/list"),
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });

  const handleSaveRoadmap = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedNodes = nodes.map((node) => ({
      clientId: node.id,
      tutorialId: (node.data as any).tutorial.id,
      positionX: node.position.x,
      positionY: node.position.y,
    }));
    const formattedEdges = edges.map((edge) => ({
      sourceNodeId: edge.source,
      targetNodeId: edge.target,
    }));
    mutation.mutate({ title, description, authorId, nodes: formattedNodes, edges: formattedEdges });
  };

  // Node/Edge Management Actions
  const handleDeleteNode = () => {
    if (!currentNode) return;
    dispatch(removeNode(currentNode.id));
  };

  const handleUpdateNode = (field: 'label' | 'x' | 'y', value: string | number) => {
    if (!currentNode) return;
    const changes: any = {};
    if (field === 'label') changes.data = { ...currentNode.data, label: value };
    else changes.position = { ...currentNode.position, [field]: Number(value) };
    dispatch(updateNode({ id: currentNode.id, changes }));
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
    ? edges.filter(e => e.source === currentNode.id || e.target === currentNode.id)
    : [];

  return (
    <div className="w-full h-full flex flex-col bg-surface border-l-2 border-ink text-ink font-sans overflow-hidden">
      {/* Header Section: Save & Global Meta */}
      <div className="p-4 border-b-2 border-ink space-y-4 bg-background/30">
        <div className="flex flex-col gap-2">
           <span className="badge-tape w-fit">Architectural Controls</span>
           <h2 className="text-xl font-black uppercase tracking-tighter">Roadmap Editor</h2>
        </div>

        <form onSubmit={handleSaveRoadmap} className="space-y-3">
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-black text-dust uppercase tracking-widest pl-1">
              Title_String
            </label>
            <input
              className="w-full bg-background border-2 border-ink text-sm font-bold p-2 focus:outline-none focus:ring-2 focus:ring-teal-primary/20 placeholder:text-dust/30 font-mono"
              placeholder="ENTER_TITLE..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono font-black text-dust uppercase tracking-widest pl-1">
              Blueprint_Description
            </label>
            <textarea
              className="w-full bg-background border-2 border-ink text-xs font-bold p-2 focus:outline-none focus:ring-2 focus:ring-teal-primary/20 placeholder:text-dust/30 font-mono h-20 resize-none"
              placeholder="ENTER_DESCRIPTION..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full btn-wire-teal py-3 text-[10px] font-black tracking-widest uppercase"
          >
            {mutation.isPending ? "[ PROCESSING... ]" : initialData ? "[ SAVE_CHANGES ]" : "[ INITIALIZE_PATH ]"}
          </button>
          
          {mutation.isError && (
             <div className="text-[8px] font-black text-red-500 uppercase mt-1">
               Error: Synchronization Failed.
             </div>
          )}
        </form>

        <div className="flex items-center gap-4 text-[9px] font-mono font-bold text-dust uppercase tracking-widest pt-2">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-ink" />
            N: {nodes.length}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-ink" />
            L: {edges.length}
          </span>
        </div>
      </div>

      {/* Main Controls Section */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-8">
        {/* Module Palette */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-mono font-black uppercase text-dust tracking-widest">Architectural Palette</h3>
          <TutorialDropdown />
        </div>

        {/* Selected Node Inspector */}
        {currentNode ? (
          <div className="space-y-8 animate-[fadeSlideIn_0.3s_ease_forwards]">
            <div className="space-y-4">
              <h3 className="text-[10px] font-mono font-black uppercase text-dust tracking-widest border-b border-ink/10 pb-2 flex justify-between items-center">
                Module Inspector
                <button
                  onClick={handleDeleteNode}
                  className="text-red-500 hover:underline"
                >
                  [ REMOVE ]
                </button>
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-[8px] font-bold uppercase text-dust mb-1">Internal_Client_ID</label>
                  <input
                    type="text"
                    value={currentNode.id}
                    disabled
                    className="w-full border-2 border-ink p-2 bg-background/50 text-[10px] font-mono opacity-50 cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[8px] font-bold uppercase text-dust mb-1">Pos_X</label>
                    <input
                      type="number"
                      value={Math.round(currentNode.position?.x || 0)}
                      onChange={(e) => handleUpdateNode('x', Number(e.target.value))}
                      className="w-full border-2 border-ink p-2 bg-background text-[10px] font-mono focus:outline-none focus:ring-2 focus:ring-teal-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold uppercase text-dust mb-1">Pos_Y</label>
                    <input
                      type="number"
                      value={Math.round(currentNode.position?.y || 0)}
                      onChange={(e) => handleUpdateNode('y', Number(e.target.value))}
                      className="w-full border-2 border-ink p-2 bg-background text-[10px] font-mono focus:outline-none focus:ring-2 focus:ring-teal-primary/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Edge Connections */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-mono font-black uppercase text-dust tracking-widest border-b border-ink/10 pb-2">Active Connections</h3>
              
              <div className="space-y-3">
                {connectedEdges.length === 0 && <div className="text-[10px] italic text-dust opacity-50 uppercase">No active links detected.</div>}
                {connectedEdges.map(edge => (
                  <div key={edge.id} className="border-2 border-ink p-3 bg-background/50 space-y-2 relative group/edge">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-mono font-black uppercase text-teal-primary">LINK_{edge.id.slice(-4)}</span>
                      <button
                        className="text-[8px] font-black text-red-500 hover:underline uppercase"
                        onClick={() => handleRemoveEdge(edge.id)}
                      >
                        [ REMOVE ]
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                         <span className="text-[7px] font-bold uppercase opacity-40">Origin</span>
                         <span className="text-[9px] font-mono truncate">{edge.source}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                         <span className="text-[7px] font-bold uppercase opacity-40">Target</span>
                         <span className="text-[9px] font-mono truncate">{edge.target}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Manual Link Creation */}
            <div className="space-y-3 pt-4 border-t-2 border-ink/5">
              <label className="block text-[10px] font-mono font-black uppercase text-dust tracking-widest">Connect to Node</label>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="PASTE_TARGET_ID..."
                  id="targetNodeId"
                  className="w-full border-2 border-ink p-2 bg-background text-[10px] font-mono focus:outline-none placeholder:text-dust/30"
                />
                <button
                  type="button"
                  className="btn-wire-teal py-2 text-[10px] uppercase font-black tracking-widest"
                  onClick={() => {
                    const targetIdInput = document.getElementById('targetNodeId') as HTMLInputElement;
                    if (targetIdInput?.value) handleAddEdge(targetIdInput.value);
                    targetIdInput.value = '';
                  }}
                >
                  Establish Connection
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-ink border-dashed flex flex-col items-center gap-3 bg-background/10">
             <span className="text-2xl opacity-20">🖱️</span>
             <span className="text-[10px] font-black uppercase text-dust tracking-widest">Select a node to edit</span>
          </div>
        )}
      </div>
    </div>
  );
}
