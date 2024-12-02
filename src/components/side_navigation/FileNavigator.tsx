import { useState, useContext, useEffect } from 'react';
import { open } from '@tauri-apps/plugin-dialog';
import { readDir, DirEntry, BaseDirectory } from '@tauri-apps/plugin-fs';
import { WorkingDirectoryContext } from '../../contexts/global';
import FileItem from './FileItem';
import * as path from '@tauri-apps/api/path';

type FileNavProps = {
  setWorkingDirectory: (wd: string) => void;
  setSelectedFile: (file: string) => void;
};

export default function FileNavigator(props: FileNavProps) {
  // get the working directory from the global context
  let workingDirectory = useContext(WorkingDirectoryContext);

  // INFO: [STATE]: entries in the selected working directory
  let [dirEntries, setDirEntries] = useState<DirEntry[]>([]);

  // INFO: handle working directory selection
  const selectWorkingDirectory = async () => {
    console.log('Selecting working directory...');
    try {
      // open dialog to choose the working directory
      let wd = await open({
        multiple: false,
        directory: true,
        defaultPath: "$DOCUMENT", // `Doucments` directory as base path
      });

      // get the relative path of the selected directory from the base path (Documents)
      const documentsPath = await path.documentDir();
      wd = wd?.replace(documentsPath + `/`, '') || null;

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

  const selectFile = (file: DirEntry) => {
    console.log("select file...", file);
    props.setSelectedFile(file.name);
  }


  // load files from the selected working directory
  // when the working directory changes
  useEffect(() => {
    const loadFilesFromDir = async (url: string) => {
      const entries = await readDir(url!, { baseDir: BaseDirectory.Document });

      // filter only markdown files (not directories)
      let markdownFiles = entries.filter((entry) => {
        return entry.isFile && entry.name.endsWith('.md');
      });

      setDirEntries(markdownFiles);
    }
    if (workingDirectory) {
      loadFilesFromDir(workingDirectory);
    }
  }, [workingDirectory]);

  return (
    <div className="sidebar">
      <button onClick={selectWorkingDirectory}>
        📁
      </button>
      <div className="files-list">
        {dirEntries.map((entry, index) => {
          return (
            <FileItem key={index} entry={entry} onSelectFile={selectFile} />
          );
        })}
      </div>
    </div>
  )
}
