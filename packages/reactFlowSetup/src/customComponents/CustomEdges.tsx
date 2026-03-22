import { BaseEdge, type EdgeProps } from '@xyflow/react';

const edgeStyle = {
  stroke: 'var(--color-ink-black)',
  strokeWidth: 2,
};

export function StepEdge({ id, sourceX, sourceY, targetX, targetY, markerEnd }: EdgeProps) {
  const centerY = (targetY - sourceY) / 2 + sourceY;
  const edgePath = `M ${sourceX} ${sourceY} L ${sourceX} ${centerY} L ${targetX} ${centerY} L ${targetX} ${targetY}`;

  return <BaseEdge id={id} path={edgePath} style={edgeStyle} markerEnd={markerEnd} />;
}

export function SineEdge({ id, sourceX, sourceY, targetX, targetY, markerEnd }: EdgeProps) {
  const centerX = (targetX - sourceX) / 2 + sourceX;
  const centerY = (targetY - sourceY) / 2 + sourceY;

  const edgePath = `
  M ${sourceX} ${sourceY} 
  Q ${(targetX - sourceX) * 0.2 + sourceX} ${targetY * 1.1} ${centerX} ${centerY}
  Q ${(targetX - sourceX) * 0.8 + sourceX} ${sourceY * 0.9} ${targetX} ${targetY}
  `;

  return <BaseEdge id={id} path={edgePath} style={edgeStyle} markerEnd={markerEnd} />;
}
