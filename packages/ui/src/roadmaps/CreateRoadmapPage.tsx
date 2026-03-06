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

    // setNodes does a bulk replace — updateNode only patches existing nodes
    // so it silently does nothing when the array is empty on first render
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
    <div className={`flex flex-row h-[calc(100vh-10rem)] w-full ${className ?? ""}`}>
      <div className="p-4 w-1/4">
        <AdminPanel currentNode={currentNode} />
      </div>
      <div className="flex-1 min-h-0 border border-purple-glow relative overflow-hidden">
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
          setEdges={(newEdges) => dispatch(setEdges(newEdges))}
          isEditable={true}
        />
      </div>
    </div>
  );
}

// "use client"
//
// import { AdminPanel, ReactFlowComponent } from '@repo/reactFlowSetup'
// import { RootState, setEdges, updateNode, useDispatch, useSelector } from '@repo/reduxSetup';
// import { useEffect, useState } from 'react';
//
//
// export function CreateRoadmapPage() {
//   const dispatch = useDispatch()
//
//   const currentNode = useSelector(
//     (state: RootState) => state.roadmapSlice.currentNode
//   );
//
//   const reduxNodes = useSelector(
//     (state: RootState) => state.roadmapSlice.nodes
//   );
//
//   const reduxEdges = useSelector(
//     (state: RootState) => state.roadmapSlice.edges
//   );
//
//
//
//   return (
//     <div className="flex flex-row  h-[calc(100vh-10rem)] w-full">
//       <div className="p-4 w-1/4 ">
//         <AdminPanel currentNode={currentNode} />
//       </div>
//
//       <div className='flex-1 min-h-0 border border-purple-glow relative overflow-hidden"'>
//         <ReactFlowComponent
//           nodes={reduxNodes}
//           edges={reduxEdges}
//           setNodes={(newNodes: any) => {
//             // Always update local state first
//             // newNodes might be a callback function from ReactFlow
//             const nodesArray = typeof newNodes === 'function' ? newNodes(reduxNodes) : newNodes;
//
//             // Dispatch updates to Redux for each node
//             nodesArray.forEach(node => {
//               dispatch(updateNode({ id: node.id, changes: node }));
//             });
//           }}
//           setEdges={(newEdges) => dispatch(setEdges(newEdges))}
//           isEditable={true}
//         />
//       </div>
//     </div>
//   )
// }
//
