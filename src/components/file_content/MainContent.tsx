import { useContext, useEffect, useState, useRef } from 'react'
import { BaseDirectory, readTextFile } from '@tauri-apps/plugin-fs'

import { SelectedFileContext, WorkingDirectoryContext } from '../../contexts/global'
import { path } from '@tauri-apps/api'
import { ALL_PLUGINS } from '../editor/editor_plugins'

import { MDXEditor, MDXEditorMethods } from '@mdxeditor/editor'

// import '@mdxeditor/editor/style.css' // original style
import '../editor/editor.css'

const initialContent = 'Start typing..'

import Canvas from '../canvas/Canvas'

type MainContentProps = {
  canvasFolded: boolean;
}

export default function MainContent(props: MainContentProps) {
  let workingDirectory = useContext(WorkingDirectoryContext)
  let selectedFile = useContext(SelectedFileContext)
  const ref = useRef<MDXEditorMethods>(null)
  // const [canvasFolded, setCanvasFolded] = useState<boolean>(true);

  useEffect(() => {
    // fetch the file content
    const fetchFileContent = async (fileName: string) => {
      let fullPath = await path.join(workingDirectory + '/' + fileName)
      let text = await readTextFile(fullPath, {
        baseDir: BaseDirectory.Document,
      })
      ref.current?.setMarkdown(text)
    }
    if (selectedFile && workingDirectory) {
      fetchFileContent(selectedFile)
    }
  }, [selectedFile])

  const handleEditorClick = () => {
    console.log("MC: Editor clicked")
    ref.current?.focus()
    console.log("FOCUS!!!!")
  }

  return (
    <div className="content_wrapper" onClick={handleEditorClick}>
      <div className="tiptap_wrapper">
        <MDXEditor
          contentEditableClassName="editor"
          ref={ref}
          markdown={initialContent}
          plugins={ALL_PLUGINS}
          autoFocus={false}
        />
      </div>
      <div className={`canvas_wrapper ${props.canvasFolded ? "folded" : ""}`}>
        <Canvas />
      </div>
    </div>
  );
}


