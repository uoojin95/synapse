import React, { useEffect, useRef, useState } from 'react';

type Tool = 'select' | 'circle' | 'line' | 'arrow' | 'text' | 'arrow' | 'select';
type Point = { x: number; y: number };

interface Shape {
    id: string;
    type: Tool;
    startPoint: Point;
    endPoint?: Point;
    radius?: number;
    text?: string;
    selected?: boolean;
    color: string;
    strokeWidth: number;
}
  
  interface DrawingState {
    startPoint: Point | null;
    isDrawing: boolean;
    selectedShape: Shape | null;
    isDragging: boolean;
    dragOffset: Point;
  }

interface Handle {
  id: string;
  position: Point;
  cursor: string;
}

export default function SimpleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>('line');
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [drawingState, setDrawingState] = useState<DrawingState>({
    startPoint: null,
    isDrawing: false,
    selectedShape: null,
    isDragging: false,
    dragOffset: { x: 0, y: 0 },
  });
  const [selectedColor, setSelectedColor] = useState<string>('#000000');
  const [strokeWidth, setStrokeWidth] = useState<number>(2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
  }, []);

  const drawAllShapes = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    shapes.forEach(shape => {
      ctx.beginPath();
      ctx.strokeStyle = shape.selected ? '#0088ff' : shape.color;
      ctx.lineWidth = shape.strokeWidth;

      switch (shape.type) {
        case 'circle':
          if (shape.radius) {
            ctx.arc(shape.startPoint.x, shape.startPoint.y, shape.radius, 0, 2 * Math.PI);
          }
          break;

        case 'line':
          if (shape.endPoint) {
            ctx.moveTo(shape.startPoint.x, shape.startPoint.y);
            ctx.lineTo(shape.endPoint.x, shape.endPoint.y);
          }
          break;

        case 'arrow':
          if (shape.endPoint) {
            drawArrow(ctx, shape.startPoint, shape.endPoint);
          }
          break;

        case 'text':
          if (shape.text) {
            ctx.font = '16px Arial';
            ctx.fillStyle = shape.selected ? '#0088ff' : shape.color;
            ctx.fillText(shape.text, shape.startPoint.x, shape.startPoint.y);
            // Reset fillStyle for other shapes
            ctx.fillStyle = 'black';
          }
          break;
      }
      
      if (shape.type !== 'text') {
        ctx.stroke();
      }

      // Draw handles if shape is selected
      if (shape.selected) {
        const handles = getHandles(shape);
        handles.forEach(handle => {
          ctx.beginPath();
          ctx.fillStyle = '#ffffff';
          ctx.strokeStyle = '#0088ff';
          ctx.lineWidth = 1;
          ctx.arc(handle.position.x, handle.position.y, 4, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
        });
      }
    });
  };

  const getHandles = (shape: Shape): Handle[] => {
    const handles: Handle[] = [];
    
    switch (shape.type) {
      case 'circle':
        if (shape.radius) {
          handles.push({
            id: 'resize',
            position: {
              x: shape.startPoint.x + shape.radius,
              y: shape.startPoint.y
            },
            cursor: 'ew-resize'
          });
        }
        break;
        
      case 'line':
      case 'arrow':
        if (shape.endPoint) {
          handles.push(
            {
              id: 'start',
              position: shape.startPoint,
              cursor: 'move'
            },
            {
              id: 'end',
              position: shape.endPoint,
              cursor: 'move'
            }
          );
        }
        break;
        
      case 'text':
        handles.push({
          id: 'move',
          position: shape.startPoint,
          cursor: 'move'
        });
        break;
    }
    
    return handles;
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const point: Point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    if (selectedTool === 'text') {
      const text = prompt('Enter text:', '');
      if (text) {
        const newShape: Shape = {
          id: Date.now().toString(),
          type: 'text',
          startPoint: point,
          text,
          color: selectedColor,
          strokeWidth,
          selected: false
        };
        setShapes([...shapes, newShape]);
      }
      return;
    }

    if (selectedTool === 'select') {
      const clickedShape = shapes.find(shape => isPointInShape(point, shape));
      if (clickedShape) {
        setShapes(shapes.map(s => ({
          ...s,
          selected: s.id === clickedShape.id
        })));
        setDrawingState({
          ...drawingState,
          selectedShape: clickedShape,
          isDragging: true,
          dragOffset: {
            x: point.x - clickedShape.startPoint.x,
            y: point.y - clickedShape.startPoint.y,
          }
        });
        return;
      }
    }

    setDrawingState({
      startPoint: point,
      isDrawing: true,
      selectedShape: null,
      isDragging: false,
      dragOffset: { x: 0, y: 0 },
    });
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const currentPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    if (drawingState.isDragging && drawingState.selectedShape) {
      const newShapes = shapes.map(shape => {
        if (shape.id === drawingState.selectedShape?.id) {
          const dx = currentPoint.x - drawingState.dragOffset.x;
          const dy = currentPoint.y - drawingState.dragOffset.y;
          return {
            ...shape,
            startPoint: { x: dx, y: dy },
            endPoint: shape.endPoint ? {
              x: dx + (shape.endPoint.x - shape.startPoint.x),
              y: dy + (shape.endPoint.y - shape.startPoint.y),
            } : undefined,
          };
        }
        return shape;
      });
      setShapes(newShapes);
      drawAllShapes(ctx);
      return;
    }

    if (!drawingState.isDrawing || !drawingState.startPoint) return;

    drawAllShapes(ctx);
    ctx.beginPath();
    
    switch (selectedTool) {
      case 'circle':
        const radius = Math.sqrt(
          Math.pow(currentPoint.x - drawingState.startPoint.x, 2) +
          Math.pow(currentPoint.y - drawingState.startPoint.y, 2)
        );
        ctx.arc(drawingState.startPoint.x, drawingState.startPoint.y, radius, 0, 2 * Math.PI);
        break;
      case 'line':
        ctx.moveTo(drawingState.startPoint.x, drawingState.startPoint.y);
        ctx.lineTo(currentPoint.x, currentPoint.y);
        break;
      case 'arrow':
        drawArrow(ctx, drawingState.startPoint, currentPoint);
        break;
    }
    ctx.stroke();
  };

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !drawingState.startPoint) return;

    const rect = canvas.getBoundingClientRect();
    const endPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    if (drawingState.isDragging) {
      setDrawingState({
        ...drawingState,
        isDragging: false,
      });
      return;
    }

    if (drawingState.isDrawing) {
      const newShape: Shape = {
        id: Date.now().toString(),
        type: selectedTool,
        startPoint: drawingState.startPoint,
        endPoint,
        color: selectedColor,
        strokeWidth,
      };

      if (selectedTool === 'circle') {
        newShape.radius = Math.sqrt(
          Math.pow(endPoint.x - drawingState.startPoint.x, 2) +
          Math.pow(endPoint.y - drawingState.startPoint.y, 2)
        );
      } else if (selectedTool === 'text') {
        const text = prompt('Enter text:', '');
        if (text) {
          newShape.text = text;
        } else {
          setDrawingState({
            startPoint: null,
            isDrawing: false,
            selectedShape: null,
            isDragging: false,
            dragOffset: { x: 0, y: 0 },
          });
          return;
        }
      }

      setShapes([...shapes, newShape]);
    }

    setDrawingState({
      startPoint: null,
      isDrawing: false,
      selectedShape: null,
      isDragging: false,
      dragOffset: { x: 0, y: 0 },
    });
  };

  const isPointInShape = (point: Point, shape: Shape): boolean => {
    const threshold = 5;
    
    switch (shape.type) {
      case 'circle':
        if (!shape.radius) return false;
        const distance = Math.sqrt(
          Math.pow(point.x - shape.startPoint.x, 2) +
          Math.pow(point.y - shape.startPoint.y, 2)
        );
        return distance <= shape.radius;
      
      case 'line':
      case 'arrow':
        if (!shape.endPoint) return false;
        return distanceToLine(point, shape.startPoint, shape.endPoint) <= threshold;
      
      case 'text':
        if (!shape.text) return false;
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return false;
        
        ctx.font = '16px Arial';
        const metrics = ctx.measureText(shape.text);
        const textHeight = 16; // Approximate height of the text

        return (
          point.x >= shape.startPoint.x &&
          point.x <= shape.startPoint.x + metrics.width &&
          point.y >= shape.startPoint.y - textHeight &&
          point.y <= shape.startPoint.y
        );
      
      default:
        return false;
    }
  };

  const distanceToLine = (point: Point, lineStart: Point, lineEnd: Point): number => {
    const numerator = Math.abs(
      (lineEnd.y - lineStart.y) * point.x -
      (lineEnd.x - lineStart.x) * point.y +
      lineEnd.x * lineStart.y -
      lineEnd.y * lineStart.x
    );
    const denominator = Math.sqrt(
      Math.pow(lineEnd.y - lineStart.y, 2) +
      Math.pow(lineEnd.x - lineStart.x, 2)
    );
    return numerator / denominator;
  };

  const drawArrow = (ctx: CanvasRenderingContext2D, start: Point, end: Point) => {
    const headLength = 10;
    const angle = Math.atan2(end.y - start.y, end.x - start.x);

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(end.x, end.y);
    ctx.lineTo(
      end.x - headLength * Math.cos(angle - Math.PI / 6),
      end.y - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(end.x, end.y);
    ctx.lineTo(
      end.x - headLength * Math.cos(angle + Math.PI / 6),
      end.y - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
        <button
          onClick={() => setSelectedTool('select')}
          style={{ backgroundColor: selectedTool === 'select' ? '#ddd' : '#fff' }}
        >
          Select
        </button>
        <button
          onClick={() => setSelectedTool('circle')}
          style={{ backgroundColor: selectedTool === 'circle' ? '#ddd' : '#fff' }}
        >
          Circle
        </button>
        <button
          onClick={() => setSelectedTool('line')}
          style={{ backgroundColor: selectedTool === 'line' ? '#ddd' : '#fff' }}
        >
          Line
        </button>
        <button
          onClick={() => setSelectedTool('text')}
          style={{ backgroundColor: selectedTool === 'text' ? '#ddd' : '#fff' }}
        >
          Text
        </button>
        <button
          onClick={() => setSelectedTool('arrow')}
          style={{ backgroundColor: selectedTool === 'arrow' ? '#ddd' : '#fff' }}
        >
          Arrow
        </button>
      </div>
      <canvas
        ref={canvasRef}
        style={{ flex: 1, border: '1px solid #ccc' }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </div>
  );
}

