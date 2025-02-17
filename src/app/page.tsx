"use client";
import ActionButtons from "@/components/ActionButtons";
import Header from "@/components/Header";
import { useEffect, useRef, useReducer, useState } from "react";

interface Shape {
  id: number;
  type: "rectangle" | "circle";
  x: number;
  y: number;
  width: number;
  height: number;
  isDragging: boolean;
}

interface CanvasState {
  context: CanvasRenderingContext2D | null;
  shapes: Shape[];
}

type Action =
  | { type: "SET_CONTEXT"; payload: CanvasRenderingContext2D }
  | { type: "ADD_SHAPE"; payload: Shape }
  | { type: "REMOVE_SHAPE"; payload: number }
  | { type: "UPDATE_SHAPES"; payload: Shape[] };

const reducer = (state: CanvasState, action: Action): CanvasState => {
  switch (action.type) {
    case "SET_CONTEXT":
      return { ...state, context: action.payload };
    case "ADD_SHAPE":
      return { ...state, shapes: [...state.shapes, action.payload] };
    case "REMOVE_SHAPE":
      return { ...state, shapes: state.shapes.filter((shape) => shape.id !== action.payload) };
    case "UPDATE_SHAPES":
      return { ...state, shapes: action.payload };
    default:
      return state;
  }
};

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, dispatch] = useReducer(reducer, { context: null, shapes: [] });
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [resizingId, setResizingId] = useState<number | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // History management
  const [history, setHistory] = useState<CanvasState[]>([]);
  const [redoHistory, setRedoHistory] = useState<CanvasState[]>([]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      dispatch({ type: "SET_CONTEXT", payload: ctx });
    }
  }, []);

  const drawShapes = () => {
    if (!state.context || !canvasRef.current) return;
    const ctx = state.context;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    state.shapes.forEach((shape) => {
      ctx.fillStyle = shape.type === "rectangle" ? "blue" : "red";

      if (shape.type === "rectangle") {
        ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
      } else {
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.width / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      if (shape.type === "rectangle") {
        ctx.fillStyle = "black";
        ctx.fillRect(shape.x + shape.width - 5, shape.y + shape.height - 5, 10, 10);
      }

      if (shape.type === "circle") {
        ctx.fillStyle = "black";
        const resizeX = shape.x + shape.width / 2 + 5;
        const resizeY = shape.y;
        ctx.fillRect(resizeX - 5, resizeY - 5, 10, 10);
      }
    });
  };

  useEffect(() => {
    drawShapes();
  }, [state.shapes]);

  const addShape = (type: "rectangle" | "circle") => {
    const newShape: Shape = {
      id: Date.now(),
      type,
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      isDragging: false,
    };

    saveHistory();
    dispatch({ type: "ADD_SHAPE", payload: newShape });
  };


  const updateShapes = (updatedShapes: Shape[]) => {
    saveHistory();
    dispatch({ type: "UPDATE_SHAPES", payload: updatedShapes });
  };

  const saveHistory = () => {
    setHistory((prevHistory) => [...prevHistory, state]);
    setRedoHistory([]); // Clear redo history
  };

  const undo = () => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setRedoHistory((prev) => [state, ...prev]);
      setHistory((prev) => prev.slice(0, -1));
      dispatch({ type: "UPDATE_SHAPES", payload: lastState.shapes });
    }
  };

  const redo = () => {
    if (redoHistory.length > 0) {
      const nextState = redoHistory[0];
      setHistory((prev) => [...prev, state]);
      setRedoHistory((prev) => prev.slice(1));
      dispatch({ type: "UPDATE_SHAPES", payload: nextState.shapes });
    }
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    const { offsetX, offsetY } = event.nativeEvent;
    const foundShape = state.shapes.find(
      (s) => offsetX >= s.x && offsetX <= s.x + s.width && offsetY >= s.y && offsetY <= s.y + s.height
    );

    const foundResizer = state.shapes.find((s) => {
      if (s.type === "rectangle") {
        return (
          offsetX >= s.x + s.width - 5 &&
          offsetX <= s.x + s.width + 5 &&
          offsetY >= s.y + s.height - 5 &&
          offsetY <= s.y + s.height + 5
        );
      } else {
        const resizeX = s.x + s.width / 2 + 5;
        const resizeY = s.y;
        return Math.abs(offsetX - resizeX) <= 5 && Math.abs(offsetY - resizeY) <= 5;
      }
    });

    if (foundResizer) {
      setResizingId(foundResizer.id);
    } else if (foundShape) {
      setDraggingId(foundShape.id);
      setOffset({ x: offsetX - foundShape.x, y: offsetY - foundShape.y });
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (draggingId !== null) {
      const { offsetX, offsetY } = event.nativeEvent;
      updateShapes(
        state.shapes.map((shape) =>
          shape.id === draggingId ? { ...shape, x: offsetX - offset.x, y: offsetY - offset.y } : shape
        )
      );
    }

    if (resizingId !== null) {
      const { offsetX, offsetY } = event.nativeEvent;
      updateShapes(
        state.shapes.map((shape) => {
          if (shape.id === resizingId) {
            if (shape.type === "rectangle") {
              return { ...shape, width: Math.max(20, offsetX - shape.x), height: Math.max(20, offsetY - shape.y) };
            } else {
              const newSize = Math.max(20, Math.abs(offsetX - shape.x));
              return { ...shape, width: newSize, height: newSize };
            }
          }
          return shape;
        })
      );
    }
  };

  const handleMouseUp = () => {
    setDraggingId(null);
    setResizingId(null);
  };
  const saveDesign = () => {
     if (!canvasRef.current) return;
     localStorage.setItem("design", canvasRef.current.toDataURL());
  };
  const loadDesign = () => {
    if (!canvasRef.current || !state.context) return;
    const savedDesign = localStorage.getItem("design");
    if (savedDesign) {
      const img = new Image();
      img.src = savedDesign;
      img.onload = () => {
        state.context?.clearRect(0, 0, canvasRef.current?.width ?? 0, canvasRef.current?.height ?? 0);
        state.context?.drawImage(img, 0, 0);
      };
    }
  };

  const downloadDesign = () => {
    if (!canvasRef.current) return;
    const dataURL = canvasRef.current.toDataURL("image/png");
    const link = document.createElement("a");
    const timestamp = new Date().toISOString().replace(/[:.-]/g, "_");
    link.href = dataURL;
    link.download = `design_${timestamp}.png`;
    link.click();
  };
  return (
    <div className="flex flex-col items-center space-y-4"> 
      <Header />
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="border shadow-md"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
       <ActionButtons
          addShape={addShape}
          undo={undo}
          redo={redo}
          saveDesign={saveDesign}
          loadDesign={loadDesign}
          downloadDesign={downloadDesign}
        />
     
    </div>
  );
}