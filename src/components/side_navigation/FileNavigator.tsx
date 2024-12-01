import { useState, useContext, useEffect } from 'react';
import { open } from '@tauri-apps/plugin-dialog';
import { readDir, DirEntry } from '@tauri-apps/plugin-fs';
import { WorkingDirectoryContext } from '../../contexts/global';

type FileNavProps = {
  setWorkingDirectory: (wd: string) => void;
};

export default function FileNavigator(props: FileNavProps) {
  // get the working directory from the global context
  let workingDirectory = useContext(WorkingDirectoryContext);

  // INFO: STATE: entries in the selected working directory
  let [dirEntries, setDirEntries] = useState<DirEntry[]>([]);

  const handleSelectDirectory = async () => {
    console.log('Selecting working directory...');
    try {
      // open dialog to choose the working directory
      const wd = await open({
        multiple: false,
        directory: true,
      });
      console.log("chosen working directory", wd);
      // set the working directory in the global context
      if (wd) {
        props.setWorkingDirectory(wd);
        console.log("setting working directory in global context", wd);
      }
    } catch (err) {
      console.log(err);
    }
  }

  // load files from the selected working directory
  // when the working directory changes
  useEffect(() => {
    const loadFilesFromDir = async (url: string) => {
      console.log("loading files from", workingDirectory);
      const entries = await readDir(url);
      console.log("setting these entries in state", entries);
      setDirEntries(entries);
    }
    if (workingDirectory) {
      loadFilesFromDir(workingDirectory);
    }
  }, [workingDirectory]);

  return (
    <div className="sidebar">
      <button onClick={handleSelectDirectory}>
        📁
      </button>
      <div className="files-list">
        {dirEntries.map((entry, index) => {
          return (
            <div key={index} className="file-entry">
              {entry.name}
            </div>
          );
        })}
      </div>
    </div>
  )
}
