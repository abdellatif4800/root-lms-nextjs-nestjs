import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import { useRouter } from "next/navigation";

export interface SimpleTutorialNodeData extends Record<string, unknown> {
  tutorial: {
    id: string;
    tutorialName: string;
    level?: string;
    description?: string;
    category?: string;
  };
}

export type CustomTutorialNode = Node<SimpleTutorialNodeData, 'tutorial'>;

export function TutorialNode({ data, selected }: NodeProps<CustomTutorialNode>) {
  const tutorial = data.tutorial;
  const router = useRouter();

  return (
    <div
      className={`
        w-[280px] flex flex-col bg-surface border-2 transition-all duration-200 cursor-pointer group
        ${selected ? 'border-teal-primary shadow-wire-teal -translate-y-1' : 'border-ink shadow-wire'}
      `}
    >
      {/* ── Header ── */}
      <div className="px-4 py-4 border-b-2 border-ink flex flex-col gap-2 bg-background/50">
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-mono font-black text-dust uppercase tracking-[0.2em]">
            Step_{tutorial.id.slice(0, 3)}
          </span>
          <span className="badge-tape scale-75 origin-right">
            {tutorial.level || "BEGINNER"}
          </span>
        </div>

        <h3 className="text-sm font-black text-ink uppercase tracking-tighter leading-tight group-hover:text-teal-primary transition-colors">
          {tutorial.tutorialName}
        </h3>
      </div>

      {/* ── Body ── */}
      <div className="px-4 py-4 flex flex-col gap-3 flex-1">
        {tutorial.description && (
          <p className="text-[10px] text-dust font-medium leading-relaxed line-clamp-2">
            {tutorial.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 border border-ink bg-teal-primary" />
            <span className="text-[8px] font-mono font-bold text-ink uppercase tracking-widest">
              {tutorial.category}
            </span>
          </div>
          <button
            onClick={() => router.push(`/tutorials/${tutorial.id}`)}
            className="text-[10px] font-black text-teal-primary group-hover:underline">
            VIEW_DETAILS
          </button>
        </div>
      </div>

      {/* ── Handles ── */}
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        style={{
          background: "var(--color-ink-black)",
          border: "2px solid var(--color-background)",
          width: 8,
          height: 8,
        }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom"
        style={{
          background: "var(--color-blueprint-teal)",
          border: "2px solid var(--color-background)",
          width: 8,
          height: 8,
        }}
      />
    </div>
  );
}
