import { Tldraw } from 'tldraw'
import React, { useState } from 'react'
import 'tldraw/tldraw.css'
import { Excalidraw } from "@excalidraw/excalidraw";
import { useDebounce, useThrottledCallback } from 'use-debounce';
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import { AppState, BinaryFiles, ExcalidrawImperativeAPI, ExcalidrawProps } from '@excalidraw/excalidraw/types/types';

export default function Canvas() {
  const [excalidrawAPI, setExcalidrawAPI] = React.useState<ExcalidrawImperativeAPI>()

  const [elements, setElements] = useState<readonly ExcalidrawElement[]>([]);
  const [elementValue] = useDebounce(elements, 0, {
    equalityFn: (left, right) => {
      return JSON.stringify(left) === JSON.stringify(right)
    }
  });

  const handleOnChange = (elements: readonly ExcalidrawElement[], appState: AppState, files: BinaryFiles) => {
    console.log("change called", { elements });
    // setText(e.elements);
    setElements(elements);
  };

  // INFO: this is the important one
  React.useEffect(() => {
    console.log("element actually updated", { elementValue });
  }, [elementValue]);

  return (
    <div style={{ height: "100vh" }}>
      <Excalidraw
        onChange={useThrottledCallback(handleOnChange, 5000)}
        excalidrawAPI={(api: ExcalidrawImperativeAPI) => { }}
        UIOptions={{ tools: { image: false } }}
      >
      </Excalidraw>
    </div >
  );
}
