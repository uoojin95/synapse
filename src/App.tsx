import { useState } from "react";
import "./App.css";
import Editor from './components/editor/Editor'
import 'tldraw/tldraw.css'
import { SelectedFileContext, WorkingDirectoryContext } from './contexts/global'
import FileNavigator from "./components/side_navigation/FileNavigator";

export default function App() {
  // INFO: Global States
  const [workingDirectory, setWorkingDirectory] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

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
          <div className="tiptap_wrapper">
            <Editor />
          </div>
        </div>
      </SelectedFileContext.Provider>
    </WorkingDirectoryContext.Provider>
  );
}
