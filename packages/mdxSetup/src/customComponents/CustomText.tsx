import {
  JsxComponentDescriptor,
  GenericJsxEditor,
  usePublisher, insertJsx$, Button,
  JsxEditorProps, useMdastNodeUpdater, useLexicalNodeRemove
} from '@mdxeditor/editor'

export const CustomTextEditor = ({ mdastNode }: JsxEditorProps) => {
  const updateMdastNode = useMdastNodeUpdater()
  const removeNode = useLexicalNodeRemove()

  // Helper to safely get attribute values
  const getAttr = (name: string) => {
    const attr = mdastNode.attributes.find(a => a.type === 'mdxJsxAttribute' && a.name === name)
    return attr?.value?.toString() || ''
  }

  // Get current values (with defaults)
  const title = getAttr('title')
  const color = getAttr('color') || '#2dd4bf'
  const fontSize = getAttr('fontSize') || '24px'
  const tag = getAttr('tag') || 'h2' // Default to H2

  // Update logic
  const updateAttr = (key: string, value: string) => {
    const otherAttributes = mdastNode.attributes.filter(
      a => a.type === 'mdxJsxAttribute' && a.name !== key
    )
    updateMdastNode({
      ...mdastNode,
      attributes: [...otherAttributes, { type: 'mdxJsxAttribute', name: key, value }]
    })
  }

  return (
    <div className="bg-surface-900 border border-surface-800 p-3 flex flex-col gap-3 max-w-lg shadow-lg">

      {/* 1. LIVE PREVIEW */}
      <div className="p-4 border border-dashed border-surface-700 bg-black/30 text-center">
        <span
          style={{
            color,
            fontSize,
            display: 'block',
            fontFamily: 'Orbitron, sans-serif',
            whiteSpace: 'pre-wrap' // Important: Respects newlines in preview
          }}
        >
          {`${title || "HEADER"}`}
        </span>
      </div>

      {/* 2. CONTROLS */}
      <div className="grid grid-cols-[auto_1fr_auto] gap-2 items-start bg-surface-950 p-2">

        {/* Tag Selector */}
        <select
          className="bg-surface-900 border border-surface-700 text-teal-glow px-2 py-1 text-sm font-bold uppercase h-8 mt-1"
          value={tag}
          onChange={(e) => updateAttr('tag', e.target.value)}
        >
          <option value="h1">H1</option>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
          <option value="p">P</option>
        </select>

        {/* CONDITIONAL INPUT: Textarea for 'p', Input for others */}
        {tag === 'p' ? (
          <textarea
            className="bg-transparent border border-surface-700 text-white px-2 py-1 text-sm focus:border-teal-glow outline-none w-full min-h-[80px] resize-y font-mono"
            placeholder="Type your paragraph here..."
            value={title}
            onChange={(e) => updateAttr('title', e.target.value)}
          />
        ) : (
          <input
            className="bg-transparent border-b border-surface-700 text-white px-2 py-1 text-sm focus:border-teal-glow outline-none w-full h-8 mt-1"
            placeholder="Header Content..."
            value={title}
            onChange={(e) => updateAttr('title', e.target.value)}
          />
        )}

        {/* Settings Group (Color + Size + Delete) */}
        <div className="flex gap-2 h-8 mt-1">
          <input
            type="color"
            className="h-6 w-6 bg-transparent border-none cursor-pointer"
            value={color}
            onChange={(e) => updateAttr('color', e.target.value)}
          />
          <select
            className="bg-surface-900 border border-surface-700 text-white text-xs"
            value={fontSize}
            onChange={(e) => updateAttr('fontSize', e.target.value)}
          >
            <option value="16px">16px</option>
            <option value="24px">24px</option>
            <option value="32px">32px</option>
            <option value="48px">48px</option>
          </select>
          <button onClick={() => removeNode()} className="text-red-500 hover:text-white px-2 font-bold">
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}

export const InsertCustomText = () => {
  const insertJsx = usePublisher(insertJsx$)

  return (
    <Button
      onClick={() =>
        insertJsx({
          name: 'CustomText',
          kind: 'flow',
          props: { title: 'My New Header' }
        })
      }
    >
      Add Header
    </Button>
  )
}

