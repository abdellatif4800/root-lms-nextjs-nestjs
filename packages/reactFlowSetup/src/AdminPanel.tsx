'use client'
import { type Node, type Edge } from "@xyflow/react";
import { useDispatch, useSelector, RootState } from "@repo/reduxSetup";
import {
  updateNode,
  addEdge,
  updateEdge,
  removeEdge,
  removeNode,
} from "@repo/reduxSetup";
import { TutorialDropdown } from "./customComponents/TutorialsDropdwon";

interface AdminPanelProps {
  currentNode: Node | null;
}

export function AdminPanel({ currentNode }: AdminPanelProps) {
  const dispatch = useDispatch();
  const edges = useSelector((state: RootState) => state.roadmapSlice.edges);

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

  const handleUpdateEdge = (edgeId: string, field: 'source' | 'target', value: string) => {
    dispatch(updateEdge({ id: edgeId, changes: { [field]: value } }));
  };

  const handleRemoveEdge = (edgeId: string) => {
    dispatch(removeEdge(edgeId));
  };

  const connectedEdges = currentNode
    ? edges.filter(e => e.source === currentNode.id || e.target === currentNode.id)
    : [];

  return (
    <div className="w-80 h-full overflow-y-auto custom-scrollbar p-6 space-y-8 border-l-2 border-ink bg-surface text-ink font-sans">
      <div className="flex flex-col gap-2">
        <span className="badge-tape w-fit">Editor Controls</span>
        <h2 className="text-xl font-black uppercase tracking-tighter">Drafting Tools</h2>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-mono font-black uppercase text-dust tracking-widest">Add Module</h3>
        <TutorialDropdown />
      </div>

      {currentNode ? (
        <div className="space-y-8 animate-[fadeSlideIn_0.3s_ease_forwards]">
          {/* Node Details */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-mono font-black uppercase text-dust tracking-widest border-b border-ink/10 pb-2 flex justify-between items-center">
              Selected Node
              <button
                onClick={handleDeleteNode}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[8px] font-bold uppercase text-dust mb-1">Internal ID</label>
                <input
                  type="text"
                  value={currentNode.id}
                  disabled
                  className="w-full border-2 border-ink p-2 bg-background/50 text-[10px] font-mono opacity-50 cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[8px] font-bold uppercase text-dust mb-1">X Position</label>
                  <input
                    type="number"
                    value={Math.round(currentNode.position?.x || 0)}
                    onChange={(e) => handleUpdateNode('x', Number(e.target.value))}
                    className="w-full border-2 border-ink p-2 bg-background text-[10px] font-mono focus:outline-none focus:ring-2 focus:ring-teal-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-bold uppercase text-dust mb-1">Y Position</label>
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

          {/* Edge Controls */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-mono font-black uppercase text-dust tracking-widest border-b border-ink/10 pb-2">Connections</h3>
            
            <div className="space-y-3">
              {connectedEdges.length === 0 && <div className="text-[10px] italic text-dust">No active links.</div>}
              {connectedEdges.map(edge => (
                <div key={edge.id} className="border-2 border-ink p-3 bg-background/50 space-y-2 relative group/edge">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-mono font-black uppercase text-teal-primary">Link_{edge.id.slice(-4)}</span>
                    <button
                      className="text-[8px] font-black text-red-500 hover:underline uppercase"
                      onClick={() => handleRemoveEdge(edge.id)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                       <span className="text-[7px] font-bold uppercase opacity-40">From</span>
                       <span className="text-[9px] font-mono truncate">{edge.source}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                       <span className="text-[7px] font-bold uppercase opacity-40">To</span>
                       <span className="text-[9px] font-mono truncate">{edge.target}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Add Edge */}
          <div className="space-y-3 pt-4 border-t-2 border-ink/5">
            <label className="block text-[10px] font-mono font-black uppercase text-dust tracking-widest">Create New Link</label>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Paste Target ID..."
                id="targetNodeId"
                className="w-full border-2 border-ink p-2 bg-background text-[10px] font-mono focus:outline-none placeholder:text-dust/30"
              />
              <button
                className="btn-wire-teal py-2 text-[10px] uppercase font-black tracking-widest"
                onClick={() => {
                  const targetIdInput = document.getElementById('targetNodeId') as HTMLInputElement;
                  if (targetIdInput?.value) handleAddEdge(targetIdInput.value);
                  targetIdInput.value = '';
                }}
              >
                Add Connection
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-20 text-center border-2 border-ink border-dashed flex flex-col items-center gap-3">
           <span className="text-2xl opacity-20">🖱️</span>
           <span className="text-[10px] font-black uppercase text-dust tracking-widest">Select a node to edit</span>
        </div>
      )}
    </div>
  );
}
