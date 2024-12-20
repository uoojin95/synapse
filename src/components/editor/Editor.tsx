import { useContext, useEffect, useState, useRef } from 'react'
import { BaseDirectory, readTextFile } from '@tauri-apps/plugin-fs'

import { SelectedFileContext, WorkingDirectoryContext } from '../../contexts/global'
import { path } from '@tauri-apps/api'
import { ALL_PLUGINS } from './editor_plugins'

import { MDXEditor, MDXEditorMethods } from '@mdxeditor/editor'

// import '@mdxeditor/editor/style.css' // original style
import './editor.css'

const initialContent = 'Start typing..'

const Editor = () => {
  let workingDirectory = useContext(WorkingDirectoryContext)
  let selectedFile = useContext(SelectedFileContext)
  const ref = useRef<MDXEditorMethods>(null)

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
    console.log("Editor clicked")
  }

  return (
    <div onClick={handleEditorClick}>
      <MDXEditor
        contentEditableClassName="editor"
        ref={ref}
        markdown={initialContent}
        plugins={ALL_PLUGINS}
        autoFocus={false}
      // onChange={(markdown) => {
      //   // console.log("markdown changed", markdown)
      //   // ref.current?.setMarkdown(markdown)
      // }}
      />
    </div>
  )
}

export default Editor
