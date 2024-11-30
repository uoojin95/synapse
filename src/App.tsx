import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import Tiptap from './components/Tiptap'

import CustomUI from './components/CustomUI'

import { Tldraw, DefaultColorThemePalette, DefaultSizeStyle } from 'tldraw'
import 'tldraw/tldraw.css'


DefaultSizeStyle.setDefaultValue("xl")

export default function App() {
  return (
    <div className="app_wrapper">
      <div className="tiptap_wrapper">
        <Tiptap />
      </div>
      <div className="tldraw_wrapper">
        <div style={{ position: 'fixed', inset: 0 }} className="tldraw__editor">
          <Tldraw hideUi>
            <CustomUI />
          </Tldraw>

        </div>
      </div>

    </div>

  );
}

//
// function App() {
//
//   // write a effect that only runs once. it should set the fill style of the canvas element to transparent
//   useEffect(() => {
//     const canvas = document.querySelectorAll("canvas");
//     console.log(canvas);
//     if (canvas) {
//       // loop over the canvases
//       for (let i = 0; i < canvas.length; i++) {
//         canvas[i].style.background = "transparent";
//         const ctx = canvas[i].getContext("2d");
//         if (ctx) {
//           // clear the canvas
//           ctx.clearRect(0, 0, canvas[i].width, canvas[i].height);
//           ctx.fillStyle = "rgba(255, 0, 0, 0)";
//           // fill the canvas
//           ctx.fillRect(0, 0, canvas[i].width, canvas[i].height);
//         }
//       }
//       // canvas.style.backgroundColor = "blue";
//       // const ctx = canvas.getContext("2d");
//       // console.log(ctx);
//       // if (ctx) {
//       //   // // clear the canvas
//       //   ctx.clearRect(0, 0, canvas.width, canvas.height);
//       //   ctx.fillStyle = "rgba(255, 0, 0, 0)";
//       //   // fill the canvas
//       //   // ctx.fillRect(0, 0, canvas.width, canvas.height);
//       //
//       //
//       // }
//     }
//   }, []);
//
//   return (
//     <div style={{ height: "500px" }} className="custom-styles">
//       <Excalidraw />
//     </div>
//   )
// }
//
// export default App;

// function App() {
//   const [greetMsg, setGreetMsg] = useState("");
//   const [name, setName] = useState("");
//
//   async function greet() {
//     // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
//     setGreetMsg(await invoke("greet", { name }));
//   }
//
//   return (
//     <main className="container">
//       <h1>Welcome to Tauri + React</h1>
//
//       <div className="row">
//         <a href="https://vitejs.dev" target="_blank">
//           <img src="/vite.svg" className="logo vite" alt="Vite logo" />
//         </a>
//         <a href="https://tauri.app" target="_blank">
//           <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
//         </a>
//         <a href="https://reactjs.org" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <p>Click on the Tauri, Vite, and React logos to learn more.</p>
//
//       <form
//         className="row"
//         onSubmit={(e) => {
//           e.preventDefault();
//           greet();
//         }}
//       >
//         <input
//           id="greet-input"
//           onChange={(e) => setName(e.currentTarget.value)}
//           placeholder="Enter a name..."
//         />
//         <button type="submit">Greet</button>
//       </form>
//       <p>{greetMsg}</p>
//     </main>
//   );
// }
//
// export default App;
