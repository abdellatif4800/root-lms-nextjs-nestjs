'use client'
import '@mdxeditor/editor/style.css'
import type { ForwardedRef } from 'react'
import * as MDX from '@mdxeditor/editor'
import { jsxComponentDescriptors } from './customComponents/jsxComponentDescriptors'
import { InsertSimpleSeparator } from './customComponents/HorizontalSeprator'
import { InsertSandpackDropdown, sandpackConfig } from './SandpackConfig'
import { InsertImageComponent } from './customComponents/CustomImage'
import { InsertVideoComponent } from './customComponents/CustomVideo'
import { InsertQuizComponent } from './customComponents/QuizComponent'


export default function InitializedMDXEditor({
  editorRef,
  ...props
}: { editorRef: ForwardedRef<MDX.MDXEditorMethods> | null } & MDX.MDXEditorProps) {
  return (
    <div className="">
      <MDX.MDXEditor
        {...props}
        ref={editorRef}
        contentEditableClassName="mdxContent"
        //onChange={console.log}
        plugins={[
          MDX.toolbarPlugin({
            toolbarContents: () => (
              <>
                <MDX.UndoRedo />
                <MDX.BlockTypeSelect />
                <MDX.BoldItalicUnderlineToggles />
                <MDX.ListsToggle />
                <MDX.CreateLink />
                <MDX.InsertTable />
                <InsertSimpleSeparator />
                <InsertImageComponent />
                <InsertVideoComponent />
                <InsertQuizComponent />
                <MDX.CodeToggle />
                <MDX.ConditionalContents
                  options={[
                    {
                      when: (editor) => editor?.editorType === 'codeblock',
                      contents: () => <MDX.ChangeCodeMirrorLanguage />
                    },
                    {
                      when: (editor) => editor?.editorType === 'sandpack',
                      contents: () => <MDX.ShowSandpackInfo />
                    },
                    {
                      fallback: () => (
                        <>

                          <MDX.InsertCodeBlock />
                          {/* <MDX.InsertSandpack /> */}
                          <InsertSandpackDropdown />
                        </>
                      )
                    }
                  ]}
                />

                {/* <MDX.KitchenSinkToolbar /> */}
                {/* <InsertCustomText /> */}
              </>
            )
          }),

          MDX.jsxPlugin({
            jsxComponentDescriptors
          }),

          MDX.listsPlugin(),
          MDX.quotePlugin(),
          MDX.headingsPlugin(),
          MDX.linkPlugin(),
          MDX.linkDialogPlugin(),
          MDX.imagePlugin(
            {
              imageUploadHandler: () => {
                return Promise.resolve('https://picsum.photos/200/300')
              },
              imageAutocompleteSuggestions: ['https://picsum.photos/200/300', 'https://picsum.photos/200']
            }
          ),
          MDX.tablePlugin(),
          MDX.thematicBreakPlugin(),
          MDX.frontmatterPlugin(),

          MDX.codeBlockPlugin({ defaultCodeBlockLanguage: 'ts' }),
          MDX.codeMirrorPlugin({
            codeBlockLanguages: { js: 'JavaScript', css: 'CSS', ts: 'TypeScript' }
          }),
          MDX.sandpackPlugin({ sandpackConfig: sandpackConfig }),
          // MDX.diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: 'boo' }),
          MDX.markdownShortcutPlugin()
        ]}
      />
    </div>
  )
}
