import React from "react";
import WindowControles from "../Components/WindowControles.jsx";
import { useImageStore } from "../store/window.js";

const ImageViewer = ({ instanceId, onClose, onTitleDoubleClick }) => {
  // Get the viewerInstances array from the store
  const { viewerInstances } = useImageStore();

  // Find the window instance by id
  const win = viewerInstances.find((v) => v.id === instanceId);

  if (!win) return null;

  const { images, index } = win.data;
  const src = images[index].url;

  return (
    <div className="w-full h-full flex flex-col bg-black text-white">
      <header
        data-drag-handle
        onDoubleClick={onTitleDoubleClick}
        className="flex justify-between items-center bg-gray-800 px-3 py-1 cursor-move"
      >
        <span>{images[index].name || "Image"}</span>
        <WindowControles onClose={onClose} />
      </header>

      <div className="flex-1 overflow-hidden flex justify-center items-center bg-black">
        <img src={src} alt="" className="max-w-full max-h-full object-contain" />
      </div>
    </div>
  );
};

export default ImageViewer;
