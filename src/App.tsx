import { useState } from "react";
import "./App.css";
import Tiptap from './components/Tiptap'
import 'tldraw/tldraw.css'
import { WorkingDirectoryContext } from './contexts/global'
import FileNavigator from "./components/side_navigation/FileNavigator";

export default function App() {
  // INFO: Global States
  const [workingDirectory, setWorkingDirectory] = useState<string | null>(null);

  return (
    <WorkingDirectoryContext.Provider value={workingDirectory}>
      <div className="app_wrapper">
        <div className="sidebar_wrapper">
          <FileNavigator setWorkingDirectory={setWorkingDirectory} />
        </div>
        <div className="tiptap_wrapper">
          <Tiptap />
        </div>
      </div>
    </WorkingDirectoryContext.Provider>
  );
}
