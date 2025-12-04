import React from "react";
import useWindowStore from "../store/window";

const WindowControles = ({ target }) => {
  const { closeWindow, toggleMaximize, focusWindow } = useWindowStore();
  const { windows } = useWindowStore();
  const win = windows[target];

  return (
    <div className="flex tems-center space-x-1 ">
      <button
        className="w-10 h-6 flex items-center justify-center text-gray-300 hover:bg-[#2a2a2a] rounded-sm cursor-pointer"
        onClick={() => closeWindow(target)}
      >
        ─
      </button>
      <button
        className="w-10 h-6 flex items-center justify-center text-gray-300 hover:bg-[#2a2a2a] rounded-sm cursor-pointer"
        onClick={() => {
          focusWindow(target);
          toggleMaximize("skill");
        }}
      >
        {win?.isMaximized ? "❐" : "▢"}
      </button>

      <button
        className="w-10 h-6 flex items-center justify-center bg-red-600 hover:bg-red-700 rounded-sm cursor-pointer"
        onClick={() => closeWindow(target)}
      >
        ✕
      </button>
    </div>
  );
};

export default WindowControles;
