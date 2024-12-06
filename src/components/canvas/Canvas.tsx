import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import { Excalidraw } from "@excalidraw/excalidraw";


export default function Canvas() {
  return (
    <>
      <div style={{ height: "100vh" }}>
        <Excalidraw UIOptions={{ tools: { image: false } }}>
        </Excalidraw>
      </div>
    </>
  );
  // return (
  //   <div style={{ inset: 0 }} className="tldraw__editor">
  //     <Tldraw />
  //   </div>
  // )
}
