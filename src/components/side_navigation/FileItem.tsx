import { DirEntry } from '@tauri-apps/plugin-fs';

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

  return (
    <div className="file-entry" onClick={handleSelectFile}>
      {entry.name}
    </div>
  );
}
