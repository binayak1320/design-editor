import { CanvasState, Action } from "@/types";

export const canvasReducer = (state: CanvasState, action: Action): CanvasState => {
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