"use client"

import { useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, BackgroundVariant, Controls, type Edge, type Node, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { TutorialNode } from './customComponents/TutorialNode';
import { StepEdge, SineEdge } from './customComponents/CustomEdges';

// 1. Alias the Redux addEdge so it doesn't conflict with XYFlow's addEdge
import { setCurrentNode, updateNode, useDispatch, addEdge as reduxAddEdge } from '@repo/reduxSetup';

// 2. Define nodeTypes OUTSIDE the component to prevent re-renders
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nodeTypes: any = { tutorial: TutorialNode };

// Define edgeTypes outside as well
const edgeTypes = {
  step: StepEdge,
  sine: SineEdge,
};

const defaultEdgeOptions = {
  type: 'step',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: 'var(--color-ink-black)',
  },
};

interface ReactFlowComponentProps {
  nodes: Node[];
  edges: Edge[];
  setNodes?: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges?: React.Dispatch<React.SetStateAction<Edge[]>>;
  isEditable?: boolean;
}

export function ReactFlowComponent(
  { nodes, edges, setNodes, setEdges, isEditable }: ReactFlowComponentProps
) {
  const dispatch = useDispatch();

  const onNodesChange = useCallback(
    (changes: any) => {
      if (!setNodes) return;
      setNodes((prevNodes) => {
        const updatedNodes = applyNodeChanges(changes, prevNodes);

        changes.forEach((change: any) => {
          if (change.type === 'position' || change.type === 'dimensions') {
            const node = updatedNodes.find((n) => n.id === change.id);
            if (node) {
              dispatch(updateNode({
                id: node.id,
                changes: {
                  position: node.position,
                  measured: node.measured,
                },
              }));
            }
          }
        });

        return updatedNodes;
      });
    },
    [setNodes, dispatch]
  );

  const onEdgesChange = useCallback(
    (changes: any) => {
      if (!setEdges) return;
      setEdges((prevEdges) => applyEdgeChanges(changes, prevEdges));
    },
    [setEdges]
  );

  const onConnect = useCallback(
    (params: any) => {
      if (!setEdges) return;
      setEdges((prevEdges) => {
        const newEdges = addEdge(params, prevEdges);
        const addedEdge = newEdges.find(
          e => !prevEdges.some(pe => pe.id === e.id)
        );
        if (addedEdge) dispatch(reduxAddEdge(addedEdge));
        return newEdges;
      });
    },
    [setEdges, dispatch]
  );

  const onNodeClick = (_: any, node: Node) => {
    dispatch(setCurrentNode(node));
  };

  return (
    <div className='h-full w-full bg-background'>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={isEditable ? onConnect : undefined}
        onNodeClick={onNodeClick}
        nodesDraggable={isEditable}
        nodesConnectable={isEditable}
        elementsSelectable={isEditable}
        defaultEdgeOptions={defaultEdgeOptions}
        edgeTypes={edgeTypes}
        fitView
      >
        <Background 
          color="rgba(13,148,136,0.1)" 
          variant={BackgroundVariant.Lines} 
          gap={40}
          size={1}
        />
        <Controls className="!bg-surface !border-2 !border-ink !shadow-wire" />
      </ReactFlow>
    </div>
  );
}
