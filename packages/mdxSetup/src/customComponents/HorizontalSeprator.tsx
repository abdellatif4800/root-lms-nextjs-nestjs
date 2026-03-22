// HorizontalSeprator.tsx
import { useLexicalNodeRemove, usePublisher, insertJsx$, Button } from '@mdxeditor/editor'

export function SimpleSeparator() {
  return (
    <div className="w-full my-12 flex items-center gap-4">
      <div className="flex-1 h-[2px] bg-ink/10" />
      <div className="w-2 h-2 border-2 border-ink rotate-45 opacity-20" />
      <div className="flex-1 h-[2px] bg-ink/10" />
    </div>
  )
}

export const SimpleSeparatorEditor = () => {
  const removeNode = useLexicalNodeRemove()

  return (
    <div contentEditable={false} className="group relative py-6 cursor-default select-none border-2 border-dashed border-ink/10">

      {/* --- LIVE PREVIEW --- */}
      <div className="mb-4 pointer-events-none px-4">
        <SimpleSeparator />
      </div>

      {/* --- EDITOR UI --- */}
      <div className="relative mx-4 border-2 border-ink p-4 flex items-center justify-center bg-surface shadow-wire">
        <div className="h-px w-full bg-ink/20 border-b border-dashed border-ink" />

        <button
          onClick={removeNode}
          className="absolute -top-3 right-4 z-20 btn-wire py-1 px-3 text-[10px] opacity-0 group-hover:opacity-100 transition-all"
          title="Remove Divider"
        >
          Remove Section Break
        </button>
      </div>
    </div>
  )
}

export const InsertSimpleSeparator = () => {
  const insertJsx = usePublisher(insertJsx$)

  return (
    <Button
      onClick={() => insertJsx({
        name: 'SimpleSeparator',
        kind: 'flow',
        props: {}
      })}
      title="Insert Section Break"
    >
      <div className="font-black text-lg leading-none mb-1">―</div>
    </Button>
  )
}
