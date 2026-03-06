import { GenericJsxEditor, JsxComponentDescriptor } from "@mdxeditor/editor";
import { CustomTextEditor } from "./CustomText";
import { SimpleSeparatorEditor } from "./HorizontalSeprator";
import { ImageComponentEditor } from "./CustomImage";



export const jsxComponentDescriptors: JsxComponentDescriptor[] = [
  {
    name: 'CustomText',
    kind: 'flow',
    source: './external',
    props: [
      { name: 'title', type: 'string' },
      { name: 'color', type: 'string' },
      { name: 'fontSize', type: 'string' },
      { name: 'tag', type: 'string' }
    ],
    hasChildren: false,
    Editor: GenericJsxEditor
  },
  {
    name: 'SimpleSeparator',
    kind: 'flow',
    props: [],
    Editor: SimpleSeparatorEditor
  },
  {
    name: 'ImageComponent',
    kind: 'flow',
    props: [
      { name: 'src', type: 'string' },
      { name: 'alt', type: 'string' }
    ],
    hasChildren: false,
    Editor: ImageComponentEditor
  }
]



