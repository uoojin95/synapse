
// src/Tiptap.tsx
import { EditorProvider, FloatingMenu, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import JSONPreview from './JSONPreview'

// define your extension array
const extensions = [StarterKit]

const content = '<p>start typing..</p>'

// INFO: READ: https://tiptap.dev/docs/editor/getting-started/install/react
const Tiptap = () => {
  return (
    <EditorProvider
      extensions={extensions}
      content={content}
    >
      <FloatingMenu editor={null}>This is the floating menu</FloatingMenu>
      <BubbleMenu editor={null}>This is the bubble menu</BubbleMenu>
      {/* <JSONPreview /> */}
    </EditorProvider>
  )
}

export default Tiptap
