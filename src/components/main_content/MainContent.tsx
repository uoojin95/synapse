import { useContext, useEffect, useState, useRef } from 'react'
import { BaseDirectory, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs'
import { SelectedFileContext, WorkingDirectoryContext } from '../../contexts/global'
import { path } from '@tauri-apps/api'
import { ALL_PLUGINS } from '../editor/editor_plugins'
import { MDXEditor, MDXEditorMethods } from '@mdxeditor/editor'
import '../editor/editor.css'
import Canvas from '../canvas/Canvas'
import { ToastContainer, toast, Bounce, Flip, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NoFileSelected from './no_file_selected/NoFileSelected'
import './toastify.css'
import './main-content.css'

const initialContent = 'Start typing..'

type MainContentProps = {
  canvasFolded: boolean;
}

export default function MainContent(props: MainContentProps) {
  let workingDirectory = useContext(WorkingDirectoryContext)
  let selectedFile = useContext(SelectedFileContext)
  const ref = useRef<MDXEditorMethods>(null)
  const prevRef = useRef<MDXEditorMethods>(null)
  // const [canvasFolded, setCanvasFolded] = useState<boolean>(true);
  // let currentContent = "";

  let [previouslySavedContent, setPreviouslySavedContent] = useState<string | null>(null)

  useEffect(() => {
    // fetch the file content
    const fetchFileContent = async (fileName: string) => {
      let fullPath = await path.join(workingDirectory + '/' + fileName)
      let text = await readTextFile(fullPath, {
        baseDir: BaseDirectory.Document,
      })
      ref.current?.setMarkdown(text)

      // set the previously saved content to the fetched content
      setPreviouslySavedContent(text)
    }
    if (selectedFile && workingDirectory) {
      fetchFileContent(selectedFile)
    }
  }, [selectedFile])

  const handleEditorClick = () => {
    ref.current?.focus()
  }

  const handleBlur = async () => {
    let currentContent = ref.current?.getMarkdown()
    console.log({
      previouslySavedContent,
      currentContent,
    })

    if (currentContent == undefined || currentContent == "") {
      return
    }

    if (previouslySavedContent === currentContent) {
      console.log('no changes, do not save')
      return
    }

    // get the current json from the editor
    const jsonContent = JSON.stringify({ notifications: true })
    await writeTextFile(workingDirectory + '/' + selectedFile, currentContent, {
      baseDir: BaseDirectory.Document,
    })

    // display notification, to say something like
    // "file {the file name} has been saved"
    toast.success(`saved ${selectedFile}`, {
      position: "bottom-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      className: "custom-toast",
      transition: Flip,
    });
  }

  // const handleContentChange = (e: string) => {
  //   currentContent = e
  // }

  return (
    <div className="content_wrapper">
      <ToastContainer />
      {
        selectedFile == null ?
          <NoFileSelected /> :
          <>
            <div className="tiptap_wrapper" onClick={handleEditorClick}>
              <MDXEditor
                contentEditableClassName="editor"
                ref={ref}
                markdown={initialContent}
                plugins={ALL_PLUGINS}
                autoFocus={false}
                onBlur={handleBlur}
              />
            </div>
            <div className={`canvas_wrapper ${props.canvasFolded ? "folded" : ""}`}>
              <Canvas />
            </div>
          </>
      }
    </div>
  );
}


