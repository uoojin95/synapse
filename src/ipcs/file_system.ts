import {invoke} from "@tauri-apps/api/core";

// open_directory opens a directory invokes an "open_directory" Tauri API call
// and returns the selected directory path.
export async function open_directory(path: string): Promise<string> {
  return invoke("open_directory", { path });
}