// HorizontalSeprator.tsx
import { useLexicalNodeRemove, usePublisher, insertJsx$, Button } from '@mdxeditor/editor'

export function SimpleSeparator() {
  return (
    <div
      className="h-10 w-full border-b my-4"
      style={{
        borderColor: "purple"
      }}
    />
  )
}

export const SimpleSeparatorEditor = () => {
  const removeNode = useLexicalNodeRemove()

  return (
    <div contentEditable={false} className="group relative py-8 cursor-default select-none border border-red-500">

      {/* --- LIVE PREVIEW --- */}
      <div className="mb-4">
        <SimpleSeparator />
      </div>

      {/* --- EDITABLE AREA WITH DELETE BUTTON --- */}
      <div className="relative border border-surface-700 p-4 flex items-center justify-center rounded-md bg-surface-900">

        {/* Glow line inside editor */}
        <div className="h-[2px] w-full bg-teal-glow shadow-[0_0_10px_var(--teal-glow)] opacity-80 rounded-full" />

        {/* Invisible hit area to capture clicks */}
        <div className="absolute inset-0 z-10 bg-transparent" />

        {/* Delete button (shows on hover) */}
        <button
          onClick={removeNode}
          className="absolute -top-2 right-2 z-20 bg-surface-900 border border-surface-700
                     text-red-500 hover:text-white hover:bg-red-600
                     text-[10px] uppercase font-bold px-2 py-1 rounded shadow-lg
                     opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0"
          title="Remove Divider"
        >
          Remove
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
      title="Insert Divider"
    >
      <div className="font-bold text-lg leading-none mb-1">―</div>
    </Button>
  )
}
