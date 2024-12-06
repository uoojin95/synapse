import { useState, useRef } from "react";
import "./App.css";
import Editor from './components/editor/Editor'
import Canvas from './components/canvas/Canvas'
import MainContent from './components/main_content/MainContent'
import { SelectedFileContext, WorkingDirectoryContext } from './contexts/global'
import FileNavigator from "./components/side_navigation/FileNavigator";
import { MDXEditorMethods } from '@mdxeditor/editor'

export default function App() {
  // INFO: Global States
  const [workingDirectory, setWorkingDirectory] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [canvasFolded, setCanvasFolded] = useState<boolean>(true);

  const ref = useRef<MDXEditorMethods>(null)

  // console.log("isFolded", canvasFolded);

  const handleEditorClick = () => {
    console.log("Editor clicked")
    ref.current?.focus()
    console.log("Editor focused")
  }

  return (
    <WorkingDirectoryContext.Provider value={workingDirectory}>
      <SelectedFileContext.Provider value={selectedFile}>
        <div className="app_wrapper">
          <div className="sidebar_wrapper">
            <FileNavigator
              setWorkingDirectory={setWorkingDirectory}
              setSelectedFile={setSelectedFile}
            />
          </div>
          <MainContent canvasFolded={canvasFolded} />
          {/* <div onClick={handleEditorClick} className="content_wrapper"> */}
          {/*   <div className="tiptap_wrapper"> */}
          {/*     <Editor /> */}
          {/*   </div> */}
          {/*   <div className={`canvas_wrapper ${canvasFolded ? "folded" : ""}`}> */}
          {/*     <Canvas /> */}
          {/*   </div> */}
          {/* </div> */}
          {/* <button */}
          {/*   className="toggle_canvas_button" */}
          {/*   onClick={() => { */}
          {/*     console.log("Toggling canvas"); */}
          {/*     setCanvasFolded(!canvasFolded); */}
          {/*   }} */}
          {/* >🎨</button> */}
        </div>
      </SelectedFileContext.Provider>
    </WorkingDirectoryContext.Provider>
  );
}
