import rough from 'roughjs'
import React, { useState, useRef, useEffect } from 'react';
import { Drawable } from 'roughjs/bin/core';
// import rough from 'roughjs/bundled/rough.esm';

const DrawingZone = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [elements, setElements] = useState<Drawable[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedTool, setSelectedTool] = useState('pen'); // Default tool: pen

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let rc = rough.canvas(canvasRef.current);
    //
    // const ctx = canvas.getContext('2d');
    // const rc = rough.canvas(ctx);

    const handleMouseDown = (event: MouseEvent) => {
      setIsDrawing(true);
      const x = event.offsetX;
      const y = event.offsetY;

      switch (selectedTool) {
        case 'pen':
          setElements([...elements, rc.line(x, y, x, y)]);
          break;
        case 'circle':
          setElements([...elements, rc.circle(x, y, 0)]);
          break;
        case 'text':
          // Handle text input (e.g., prompt for text)
          const text = prompt('Enter text:');
          // if (text) {
          //   const textElement = rc.(x, y, text, { fontSize: 18 });
          //   setElements([...elements, textElement]);
          // }
          break;
        default:
          break;
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDrawing || selectedTool !== 'pen') return;
      //
      // const x = event.offsetX;
      // const y = event.offsetY;
      //
      // const updatedElements = [...elements];
      // updatedElements[updatedElements.length - 1].x2 = x;
      // updatedElements[updatedElements.length - 1].y2 = y;
      setElements([...elements]);
    };

    const handleMouseUp = (event: MouseEvent) => {
      // draw the final element
      const x = event.offsetX;
      const y = event.offsetY;
      const updatedElements = [...elements];
      const lastElement = updatedElements[updatedElements.length - 1];

      setElements([...elements]);

      setIsDrawing(false);
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };

  }, [elements, selectedTool]);

  useEffect(() => {
    let rc = rough.canvas(canvasRef.current!);
    const canvas = canvasRef.current;
    // const ctx = canvas.getContext('2d');
    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    elements.forEach((element) => {
      rc.draw(element);
    });
  }, [elements, selectedTool]); // Re-render on element or tool change

  return (
    <div>
      {/* Tool selection buttons (e.g., buttons for pen, circle, text) */}
      <button onClick={() => setSelectedTool('pen')}>Pen</button>
      <button onClick={() => setSelectedTool('circle')}>Circle</button>
      <button onClick={() => setSelectedTool('text')}>Text</button>

      <canvas
        ref={canvasRef}
        className="drawing_zone"
        width={500}
        height={300}
      />
    </div>
  );
};

export default DrawingZone;
