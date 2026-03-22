import { GenericJsxEditor, JsxComponentDescriptor } from "@mdxeditor/editor";
import { SimpleSeparatorEditor } from "./HorizontalSeprator";
import { ImageComponentEditor } from "./CustomImage";
import { VideoComponentEditor } from "./CustomVideo";
import { QuizComponentEditor } from "./QuizComponent";



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
  ,
  {
    name: 'VideoComponent',
    kind: 'flow',
    props: [
      { name: "playbackId", type: "string" }, // ✅ fixed — was 'src'
      { name: "title", type: "string" },       // ✅ fixed — was 'alt'
      { name: "caption", type: "string" },     // ✅ added
    ],
    hasChildren: false,
    Editor: VideoComponentEditor
  },
  {
    name: 'QuizComponent',
    kind: 'flow',
    props: [
      { name: "quizId", type: "string" },
      { name: "title", type: "string" },
    ],
    hasChildren: false,
    Editor: QuizComponentEditor
  }
]



