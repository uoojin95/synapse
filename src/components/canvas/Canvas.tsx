import React, { useEffect, useState, useContext, useRef } from 'react'
import 'tldraw/tldraw.css'
import { Excalidraw } from "@excalidraw/excalidraw";
import { useDebounce, useThrottledCallback } from 'use-debounce';
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import { AppState, BinaryFiles, ExcalidrawImperativeAPI, ExcalidrawProps } from '@excalidraw/excalidraw/types/types';
import { writeTextFile, BaseDirectory, readTextFile } from '@tauri-apps/plugin-fs'
import { path } from '@tauri-apps/api'
import { SelectedFileContext, WorkingDirectoryContext } from '../../contexts/global'
import { toast } from 'react-toastify';

type CanvasState = {
  elements: readonly ExcalidrawElement[],
  appState: Partial<AppState>,
  files: BinaryFiles
}

type CanvasData = {
  type: string,
  version: number,
  source: string,
  elements: readonly ExcalidrawElement[],
  appState: AppState,
  files: BinaryFiles
}

export default function Canvas() {
  const workingDirectory = useContext(WorkingDirectoryContext)
  const selectedFile = useContext(SelectedFileContext)
  const previousFile = useRef(selectedFile)
  let [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null)

  const [elements, setElements] = useState<CanvasState>({
    elements: [],
    appState: {
      viewBackgroundColor: "#ffffff",
      gridSize: null
    },
    files: {},
  });
  const [elementValue] = useDebounce(elements, 0, {
    equalityFn: (left, right) => {
      return JSON.stringify(left) === JSON.stringify(right)
    }
  });


  const handleOnChange = (
    elements: readonly ExcalidrawElement[], 
    appState: AppState, 
    files: BinaryFiles
  ) => {
    setElements({
      elements,
      appState,
      files
    });
  };

  // Save the current drawing before loading a new one
  useEffect(() => {
    const saveAndLoadDrawing = async () => {
      if (!workingDirectory) return;
      
      // Save the previous drawing if it exists
      if (previousFile.current && elementValue.elements.length) {
        const prevDrawingFileName = `${previousFile.current.replace('.md', '')}.excalidraw`
        const prevFullPath = await path.join(workingDirectory, prevDrawingFileName)

        const drawingData: CanvasData = {
          type: "excalidraw",
          version: 2,
          source: "your-app",
          elements: excalidrawAPI?.getSceneElements() || [],
          appState: excalidrawAPI?.getAppState() as AppState,
          files: elements.files,
        }

        await writeTextFile(prevFullPath, JSON.stringify(drawingData, null, 2), {
          baseDir: BaseDirectory.Document,
        })
        console.log("Previous drawing saved")
      }

      // Load the new drawing
      if (selectedFile) {
        try {
          const drawingFileName = `${selectedFile.replace('.md', '')}.excalidraw`
          const fullPath = await path.join(workingDirectory, drawingFileName)

          console.log({
            fullPath,
            workingDirectory
          })
          const content = await readTextFile(fullPath, {
            baseDir: BaseDirectory.Document,
          })
          console.log({
            content
          })
          
          const drawingData = JSON.parse(content) as CanvasData
          console.log({
            drawingData,
            elements: drawingData.elements,
          })
          // try to update the scene
          excalidrawAPI?.updateScene(drawingData)
          console.log("what is this")
        } catch (error) {
          // File doesn't exist yet or other error
          console.log("No existing drawing found", error)

          // update scene to nothing
          excalidrawAPI?.updateScene({
            elements: [],
            appState: {
              viewBackgroundColor: "#ffffff",
            },
            collaborators: new Map()
          })
          // // Reset to empty drawing
          // excalidrawAPI.current?.updateScene({
          //   elements: [],
          //   appState: {
          //     viewBackgroundColor: "#ffffff",
          //     gridSize: null
          //   },
          //   files: {},
          // })
        }
      }

      // Update the previous file reference
      previousFile.current = selectedFile
    }

    saveAndLoadDrawing()
  }, [selectedFile, workingDirectory])

  // Keep the regular auto-save effect for ongoing changes
  useEffect(() => {
    const saveDrawing = async () => {
      if (!workingDirectory || !selectedFile || !elementValue.elements.length) return;
      
      const drawingFileName = `${selectedFile.replace('.md', '')}.excalidraw`
      const fullPath = await path.join(workingDirectory, drawingFileName)
      
      const drawingData = {
        type: "excalidraw",
        version: 2,
        source: "your-app",
        elements: elementValue,
        appState: elementValue.appState,
        files: elementValue.files,
      }

      await writeTextFile(fullPath, JSON.stringify(drawingData, null, 2), {
        baseDir: BaseDirectory.Document,
      })
      console.log("drawing saved")
      toast.success("Drawing saved")
    }

    saveDrawing()
  }, [elementValue, workingDirectory, selectedFile]);

  return (
    <div style={{ height: "100vh" }}>
      <Excalidraw
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        initialData={elementValue}
        onChange={useThrottledCallback(handleOnChange, 5000)}
        UIOptions={{ tools: { image: false } }}
      >
      </Excalidraw>
    </div >
  );
}
