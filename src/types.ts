export interface Shape {
    id: number;
    type: "rectangle" | "circle";
    x: number;
    y: number;
    width: number;
    height: number;
    isDragging: boolean;
  }
  
  export interface CanvasState {
    context: CanvasRenderingContext2D | null;
    shapes: Shape[];
  }
  
  export type Action =
    | { type: "SET_CONTEXT"; payload: CanvasRenderingContext2D }
    | { type: "ADD_SHAPE"; payload: Shape }
    | { type: "REMOVE_SHAPE"; payload: number }
    | { type: "UPDATE_SHAPES"; payload: Shape[] };