import * as MDX from '@mdxeditor/editor'
import { usePublisher, insertCodeBlock$, Button } from '@mdxeditor/editor'

const defaultReactSnippet = `
export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
`.trim()



const defaultVueSnippet = `
<template>
  <h1>Hello Vue!</h1>
</template>

<script>
export default {
  name: 'App',
}
</script>`.trim()

const defaultVanillaSnippet = `
document.body.innerHTML = \`
  <h1>Hello Vanilla JS!</h1>
\`
`.trim()


export const sandpackConfig: MDX.SandpackConfig = {
  defaultPreset: 'react',
  presets: [
    {
      label: 'React',
      name: 'react',
      meta: 'live react',
      sandpackTemplate: 'react',
      sandpackTheme: 'light',
      snippetFileName: '/App.js',
      snippetLanguage: 'jsx',
      initialSnippetContent: defaultReactSnippet
    },
    {
      label: 'Vue',
      name: 'vue',
      meta: 'live vue', // This 'meta' string is what triggers this preset
      sandpackTemplate: 'vue',
      sandpackTheme: 'dark',
      snippetFileName: '/src/App.vue',
      snippetLanguage: 'html',
      initialSnippetContent: defaultVueSnippet
    },
    {
      label: 'Vanilla JS',
      name: 'vanilla',
      meta: 'live vanilla',
      sandpackTemplate: 'vanilla',
      sandpackTheme: 'dark',
      snippetFileName: '/index.js',
      snippetLanguage: 'js',
      initialSnippetContent: defaultVanillaSnippet
    }
  ]
}


export const InsertSandpackDropdown = () => {
  const insertCodeBlock = usePublisher(insertCodeBlock$)

  const handleInsert = (presetName: string) => {
    let code = ''
    let language = ''
    let meta = ''

    // Determine content based on selection
    switch (presetName) {
      case 'react':
        code = `export default function App() { return <h1>Hello React</h1> }`
        language = 'jsx'
        meta = 'live react' // MUST match the 'meta' in your config
        break;
      case 'vue':
        code = `<template><h1>Hello Vue</h1></template>`
        language = 'html'
        meta = 'live vue'
        break;
      case 'vanilla':
        code = `document.body.innerHTML = '<h1>Hello JS</h1>'`
        language = 'javascript'
        meta = 'live vanilla'
        break;
    }

    insertCodeBlock({ code, language, meta })
  }

  return (
    <div className="flex items-center gap-1 border border-surface-700 rounded bg-surface-900 px-1">
      <span className="text-[10px] uppercase font-bold text-teal-glow px-1">Sandpack:</span>

      {/* React Button */}
      <button
        onClick={() => handleInsert('react')}
        className="text-xs hover:text-white hover:bg-surface-700 px-2 py-1 rounded transition-colors"
      >
        React
      </button>

      <span className="text-surface-700">|</span>

      {/* Vue Button */}
      <button
        onClick={() => handleInsert('vue')}
        className="text-xs hover:text-white hover:bg-surface-700 px-2 py-1 rounded transition-colors"
      >
        Vue
      </button>

      <span className="text-surface-700">|</span>

      {/* Vanilla Button */}
      <button
        onClick={() => handleInsert('vanilla')}
        className="text-xs hover:text-white hover:bg-surface-700 px-2 py-1 rounded transition-colors"
      >
        JS
      </button>
    </div>
  )
}
