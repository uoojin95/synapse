import { useContext, useEffect, useState, useRef } from 'react'
import { BaseDirectory, readTextFile } from '@tauri-apps/plugin-fs'

import { SelectedFileContext, WorkingDirectoryContext } from '../../contexts/global'
import { path } from '@tauri-apps/api'

import { MDXEditor, MDXEditorMethods } from '@mdxeditor/editor'
import { headingsPlugin, listsPlugin, quotePlugin, thematicBreakPlugin, markdownShortcutPlugin } from '@mdxeditor/editor'

// import '@mdxeditor/editor/style.css' // original style
import './editor.css'

const initialContent = 'Start typing..'

const Editor = () => {
  let workingDirectory = useContext(WorkingDirectoryContext)
  let selectedFile = useContext(SelectedFileContext)
  const ref = useRef<MDXEditorMethods>(null)

  useEffect(() => {
    console.log("editor: use effect", selectedFile)

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

  return (
    <MDXEditor
      contentEditableClassName="editor"
      ref={ref}
      markdown={initialContent}
      plugins={[headingsPlugin(), listsPlugin(), quotePlugin(), thematicBreakPlugin(), markdownShortcutPlugin()]}
      onChange={(markdown) => {
        console.log("markdown changed", markdown)
        ref.current?.setMarkdown(markdown)
      }}
    />
  )
}

export default Editor
