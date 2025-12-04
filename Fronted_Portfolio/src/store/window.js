import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { WINDOW_CONFIG, INITIAL_Z_INDEX } from "../constants/Index.jsx";

export const useWindowStore = create(
  immer((set) => ({
    windows: structuredClone(WINDOW_CONFIG),
    nextZIndex: INITIAL_Z_INDEX + 1,

    openWindow: (windowKey, data = null) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) return;

        if (win.x === null && win.width) {
          win.x = window.innerWidth / 2 - win.width / 2;
        }
        if (win.y === null && win.height) {
          win.y = window.innerHeight / 2 - win.height / 2;
        }

        win.isOpen = true;
        win.data = data ?? win.data;
        win.zIndex = state.nextZIndex++;
      }),

    closeWindow: (windowKey) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) return;

        win.isOpen = false;
        win.data = null;
        win.zIndex = INITIAL_Z_INDEX;
      }),

    focusWindow: (windowKey) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) return;
        win.zIndex = state.nextZIndex++;
      }),

    setWindowState: (windowKey, partial) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) return;
        Object.assign(win, partial);
      }),

    toggleMaximize: (windowKey) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) return;
        if (!win.isMaximized) {
          win.prev = {
            x: win.x,
            y: win.y,
            width: win.width,
            height: win.height,
          };
          win.isMaximized = true;
          win.x = 0;
          win.y = 0;
          win.width = window.innerWidth;
          win.height = window.innerHeight;
        } else {
          if (win.prev) {
            win.x = win.prev.x;
            win.y = win.prev.y;
            win.width = win.prev.width;
            win.height = win.prev.height;
          }
          win.prev = null;
          win.isMaximized = false;
        }
      }),
  }))
);

export default useWindowStore;
