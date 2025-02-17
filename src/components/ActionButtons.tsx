// const ActionButtons = ({ addShape, undo, redo, saveDesign, loadDesign, downloadDesign }) => (
//     <div className="flex space-x-2">
//       <button
//         className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         onClick={() => addShape("rectangle")}
//       >
//         Add Rectangle
//       </button>
//       <button
//         className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//         onClick={() => addShape("circle")}
//       >
//         Add Circle
//       </button>
//       <button
//         className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//         onClick={undo}
//       >
//         Undo
//       </button>
//       <button
//         className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//         onClick={redo}
//       >
//         Redo
//       </button>
//       <button
//         className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//         onClick={saveDesign}
//       >
//         Save Design
//       </button>
//       <button
//         className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
//         onClick={loadDesign}
//       >
//         Load Design
//       </button>
//       <button
//         className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
//         onClick={downloadDesign}
//       >
//         Download
//       </button>
//     </div>
//   );

  interface ActionButtonsProps {
    addShape: (type: "rectangle" | "circle") => void;
    undo: () => void;
    redo: () => void;
    saveDesign: () => void;
    loadDesign: () => void;
    downloadDesign: () => void;
  }
  
  const ActionButtons: React.FC<ActionButtonsProps> = ({ addShape, undo, redo, saveDesign, loadDesign, downloadDesign }) => {
    return (
        <div className="flex space-x-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => addShape("rectangle")}>Add Rectangle</button>
            <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={() => addShape("circle")}>Add Circle</button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={undo}>Undo</button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={redo}>Redo</button>
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={saveDesign}>Save Design</button>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600" onClick={loadDesign}>Load Design</button>
            <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600" onClick={downloadDesign}>Download</button>
        </div>
    );
  };
  
  export default ActionButtons;