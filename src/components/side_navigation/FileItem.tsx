import { DirEntry } from '@tauri-apps/plugin-fs';
import './side-navigation.css';

type FileItemProps = {
  entry: DirEntry;
  onSelectFile: (file: DirEntry) => void;
}

export default function FileItem(props: FileItemProps) {
  // get the file entry from props
  let entry = props.entry;

  const handleSelectFile = () => {
    console.log("Selecting entry...", entry);
    props.onSelectFile(entry);
  }

  function tripFilename(entry: DirEntry) {
    // trip the .md extension from the filename
    let filename = entry.name;
    let ext = filename.split('.').pop();
    if (ext === 'md') {
      filename = filename.replace('.md', '');
    }
    return filename;
  }

  return (
    <div className="file-entry" onClick={handleSelectFile}>
      {tripFilename(entry)}
    </div>
  );
}
