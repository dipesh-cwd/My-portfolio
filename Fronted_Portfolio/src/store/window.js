import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { WINDOW_CONFIG, INITIAL_Z_INDEX, IMAGE_CONFIG } from "../constants/Index.jsx";

let INSTANCE_COUNTER = 1;

export const useWindowStore = create(
  immer((set) => ({
    windows: structuredClone(WINDOW_CONFIG),
    nextZIndex: INITIAL_Z_INDEX + 1,

    openWindow: (windowKey, data = null) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) return;

        if (win.x === null && win.width && typeof window !== "undefined") {
          win.x = window.innerWidth / 2 - win.width / 2;
        }

        if (win.y === null && win.height && typeof window !== "undefined") {
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
        if (typeof window === "undefined") return;

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

// export const useImageStore = create(
//   immer((set) => ({

//     imageWindows: structuredClone(IMAGE_CONFIG),
//     nextZIndex: INITIAL_Z_INDEX + 1,

//     openWindow: (windowKey, data = null) =>
//       set((state) => {
//         const win = state.imageWindows[windowKey];
//         if (!win) return;

//         if (win.x === null && win.width && typeof window !== "undefined") {
//           win.x = window.innerWidth / 2 - win.width / 2;
//         }

//         if (win.y === null && win.height && typeof window !== "undefined") {
//           win.y = window.innerHeight / 2 - win.height / 2;
//         }

//         win.isOpen = true;
//         win.data = data ?? win.data;
//         win.zIndex = state.nextZIndex++;
//       }),

//     closeWindow: (windowKey) =>
//       set((state) => {
//         const win = state.windows[windowKey];
//         if (!win) return;
//         win.isOpen = false;
//         win.data = null;
//         win.zIndex = INITIAL_Z_INDEX;
//       }),

//     focusWindow: (windowKey) =>
//       set((state) => {
//         const win = state.windows[windowKey];
//         if (!win) return;
//         win.zIndex = state.nextZIndex++;
//       }),

//     setWindowState: (windowKey, partial) =>
//       set((state) => {
//         const win = state.windows[windowKey];
//         if (!win) return;
//         Object.assign(win, partial);
//       }),

//     toggleMaximize: (windowKey) =>
//       set((state) => {
//         const win = state.windows[windowKey];
//         if (!win) return;
//         if (typeof window === "undefined") return;

//         if (!win.isMaximized) {
//           win.prev = {
//             x: win.x,
//             y: win.y,
//             width: win.width,
//             height: win.height,
//           };
//           win.isMaximized = true;
//           win.x = 0;
//           win.y = 0;
//           win.width = window.innerWidth;
//           win.height = window.innerHeight;
//         } else {
//           if (win.prev) {
//             win.x = win.prev.x;
//             win.y = win.prev.y;
//             win.width = win.prev.width;
//             win.height = win.prev.height;
//           }
//           win.prev = null;
//           win.isMaximized = false;
//         }
//       }),
//   }))
// );

// export const useImageStore = create(
//   immer((set) => ({
//     // static app window configs (your existing photos, etc.)
//     imageWindows: structuredClone(IMAGE_CONFIG),

//     // dynamic viewer windows
//     viewerInstances: [], // each: { id, isOpen, zIndex, x,y,width,height,isMaximized,prev,data }

//     nextZIndex: INITIAL_Z_INDEX + 1,

//     // open a new viewer instance (returns instance id)
//     openViewerInstance: (data) =>
//       set((state) => {
//         const id = `viewer_${Date.now()}`;
//         const width = data?.width ?? 850;
//         const height = data?.height ?? 600;
//         const x = window?.innerWidth ? Math.round(window.innerWidth / 2 - width / 2 + (state.viewerInstances.length * 20)) : 100;
//         const y = window?.innerHeight ? Math.round(window.innerHeight / 2 - height / 2 + (state.viewerInstances.length * 20)) : 80;

//         state.viewerInstances.push({
//           id,
//           isOpen: true,
//           zIndex: state.nextZIndex++,
//           x,
//           y,
//           width,
//           height,
//           isMaximized: false,
//           prev: null,
//           data: data ?? null, // { images, startIndex }
//         });

//         return id; // note: not directly returned from zustand setter, but we can read it after calling openViewerInstance
//       }),

//     // closes a viewer instance
//     closeViewerInstance: (instanceId) =>
//       set((state) => {
//         const idx = state.viewerInstances.findIndex((v) => v.id === instanceId);
//         if (idx === -1) return;
//         state.viewerInstances.splice(idx, 1);
//       }),

//     // focus a viewer instance (bring to front)
//     focusViewerInstance: (instanceId) =>
//       set((state) => {
//         const inst = state.viewerInstances.find((v) => v.id === instanceId);
//         if (!inst) return;
//         inst.zIndex = state.nextZIndex++;
//       }),

//     // update instance partial state
//     setViewerInstanceState: (instanceId, partial) =>
//       set((state) => {
//         const inst = state.viewerInstances.find((v) => v.id === instanceId);
//         if (!inst) return;
//         Object.assign(inst, partial);
//       }),

//     // toggle maximize for an instance
//     toggleViewerMaximize: (instanceId) =>
//       set((state) => {
//         const inst = state.viewerInstances.find((v) => v.id === instanceId);
//         if (!inst) return;
//         if (!inst.isMaximized) {
//           inst.prev = { x: inst.x, y: inst.y, width: inst.width, height: inst.height };
//           inst.isMaximized = true;
//           inst.x = 0;
//           inst.y = 0;
//           inst.width = window.innerWidth;
//           inst.height = window.innerHeight;
//         } else {
//           if (inst.prev) {
//             inst.x = inst.prev.x;
//             inst.y = inst.prev.y;
//             inst.width = inst.prev.width;
//             inst.height = inst.prev.height;
//           }
//           inst.prev = null;
//           inst.isMaximized = false;
//         }
//       }),
//   }))
// );

const useImageStore = create(
  immer((set) => ({
    viewerInstances: [],

    // OPEN NEW IMAGE WINDOW
    openViewerInstance: (images, startIndex) =>
      set((state) => {
        const id = INSTANCE_COUNTER++;

        state.viewerInstances.push({
          id,
          isOpen: true,
          isMaximized: false,
          x: 100 + id * 20,
          y: 100 + id * 20,
          width: 600,
          height: 400,
          zIndex: 100 + id,
          data: {
            images,
            index: startIndex,
          },
          prev: null,
        });
      }),

    closeViewerInstance: (instanceId) =>
      set((state) => {
        const win = state.viewerInstances.find((v) => v.id === instanceId);
        if (win) win.isOpen = false;
      }),

    focusViewerInstance: (instanceId) =>
      set((state) => {
        const maxZ = Math.max(200, ...state.viewerInstances.map((w) => w.zIndex));
        const win = state.viewerInstances.find((v) => v.id === instanceId);
        if (win) win.zIndex = maxZ + 1;
      }),

    setViewerInstanceState: (instanceId, partial) =>
      set((state) => {
        const win = state.viewerInstances.find((v) => v.id === instanceId);
        if (!win) return;
        Object.assign(win, partial);
      }),

    toggleViewerMaximize: (instanceId) =>
      set((state) => {
        const win = state.viewerInstances.find((v) => v.id === instanceId);
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
export { useImageStore };
