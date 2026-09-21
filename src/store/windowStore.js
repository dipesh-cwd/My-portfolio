import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { APPS, DEFAULT_MIN_HEIGHT, DEFAULT_MIN_WIDTH } from "../config/apps.js";
import {
  BASE_Z,
  CASCADE_SLOTS,
  CASCADE_STEP,
  TASKBAR_HEIGHT,
  VIEWPORT_MARGIN,
  Z_LIMIT,
} from "../config/layout.js";

/**
 * Window store.
 *
 * ONE store handles every window. A window exists in `windows` only while it is open
 * (a minimized window is still open). Closing a window deletes its entry.
 *
 *   id        Single-instance apps use the app key ("skill"); multi-instance apps
 *             get "<appKey>#<n>" (e.g. "viewer#3").
 *   appKey    Key into APPS (src/config/apps.js).
 *   data      Anything the app needs (e.g. { images, index } for the image viewer).
 *
 * Components should subscribe with narrow selectors, e.g.
 *   const win = useWindowStore((s) => s.windows[id]);
 * so a window only re-renders when its own state changes.
 */

const getViewport = () =>
  typeof window === "undefined"
    ? { width: 1280, height: 800 }
    : { width: window.innerWidth, height: window.innerHeight };

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const getMinSize = (appKey) => ({
  minWidth: APPS[appKey]?.minWidth ?? DEFAULT_MIN_WIDTH,
  minHeight: APPS[appKey]?.minHeight ?? DEFAULT_MIN_HEIGHT,
});

/** Highest z-index among windows that are actually visible (not minimized). */
export const getTopVisibleZ = (windows) => {
  let top = -1;
  for (const win of Object.values(windows)) {
    if (!win.isMinimized && win.zIndex > top) top = win.zIndex;
  }
  return top;
};

// Re-number z-indexes 0..n so they never grow past Z_LIMIT (which would cover the taskbar).
const renumberZ = (state) => {
  const sorted = Object.values(state.windows).sort((a, b) => a.zIndex - b.zIndex);
  sorted.forEach((win, i) => {
    win.zIndex = BASE_Z + i;
  });
  state.nextZ = BASE_Z + sorted.length;
};

const bringToFront = (state, id) => {
  const win = state.windows[id];
  if (!win) return;
  win.zIndex = state.nextZ++;
  if (state.nextZ > Z_LIMIT) renumberZ(state);
};

export const createInitialState = () => ({
  windows: {},
  nextZ: BASE_Z,
  seq: 0,
});

export const useWindowStore = create(
  immer((set, get) => ({
    ...createInitialState(),

    /**
     * Open an app. Returns the id of the window, or null for an unknown app.
     * - single-instance app: opens it, or restores + focuses it if already open
     * - multi-instance app: always opens a new window
     */
    openApp: (appKey, data = null) => {
      const app = APPS[appKey];
      if (!app) return null;

      let id = appKey;
      set((state) => {
        if (app.multiInstance) {
          state.seq += 1;
          id = `${appKey}#${state.seq}`;
        }

        const existing = state.windows[id];
        if (existing) {
          existing.isMinimized = false;
          if (data !== null) existing.data = data;
          bringToFront(state, id);
          return;
        }

        const viewport = getViewport();
        const availableHeight = viewport.height - TASKBAR_HEIGHT;
        const width = Math.min(app.width, viewport.width - VIEWPORT_MARGIN * 2);
        const height = Math.min(app.height, availableHeight - VIEWPORT_MARGIN * 2);

        // Stagger new windows so they don't open exactly on top of each other.
        const offset = (Object.keys(state.windows).length % CASCADE_SLOTS) * CASCADE_STEP;
        const x = Math.round((viewport.width - width) / 2 + offset);
        const y = Math.round((availableHeight - height) / 2 + offset);

        state.windows[id] = {
          id,
          appKey,
          data,
          width,
          height,
          x: clamp(x, 0, Math.max(0, viewport.width - width)),
          y: clamp(y, 0, Math.max(0, availableHeight - height)),
          zIndex: BASE_Z,
          isMinimized: false,
          isMaximized: false,
        };
        bringToFront(state, id);
      });
      return id;
    },

    closeWindow: (id) =>
      set((state) => {
        delete state.windows[id];
      }),

    focusWindow: (id) =>
      set((state) => {
        const win = state.windows[id];
        if (!win || win.isMinimized) return;
        if (win.zIndex === getTopVisibleZ(state.windows)) return; // already in front
        bringToFront(state, id);
      }),

    minimizeWindow: (id) =>
      set((state) => {
        const win = state.windows[id];
        if (win) win.isMinimized = true;
      }),

    restoreWindow: (id) =>
      set((state) => {
        const win = state.windows[id];
        if (!win) return;
        win.isMinimized = false;
        bringToFront(state, id);
      }),

    toggleMaximize: (id) =>
      set((state) => {
        const win = state.windows[id];
        if (!win) return;
        win.isMaximized = !win.isMaximized;
        if (!win.isMinimized) bringToFront(state, id);
      }),

    /** Set position and/or size. Size is clamped to the app's minimum. */
    setBounds: (id, bounds) =>
      set((state) => {
        const win = state.windows[id];
        if (!win) return;
        const { minWidth, minHeight } = getMinSize(win.appKey);
        if (bounds.x !== undefined) win.x = Math.round(bounds.x);
        if (bounds.y !== undefined) win.y = Math.round(bounds.y);
        if (bounds.width !== undefined) win.width = Math.max(minWidth, Math.round(bounds.width));
        if (bounds.height !== undefined) {
          win.height = Math.max(minHeight, Math.round(bounds.height));
        }
      }),

    /** "Show desktop": minimize every window (they can be restored from the panel or dock). */
    minimizeAll: () =>
      set((state) => {
        for (const win of Object.values(state.windows)) win.isMinimized = true;
      }),

    closeAll: () =>
      set((state) => {
        state.windows = {};
      }),

    /** Shallow-merge into a window's `data` (e.g. the image viewer changing image). */
    updateWindowData: (id, partial) =>
      set((state) => {
        const win = state.windows[id];
        if (win) win.data = { ...win.data, ...partial };
      }),

    /**
     * Dock click behaviour (like a Windows taskbar):
     * closed -> open, minimized -> restore, behind others -> focus, in front -> minimize.
     */
    toggleApp: (appKey) => {
      const app = APPS[appKey];
      if (!app) return;

      const { windows, openApp, restoreWindow, focusWindow, minimizeWindow } = get();
      const win = windows[appKey];

      if (app.multiInstance || !win) {
        openApp(appKey);
      } else if (win.isMinimized) {
        restoreWindow(appKey);
      } else if (win.zIndex === getTopVisibleZ(windows)) {
        minimizeWindow(appKey);
      } else {
        focusWindow(appKey);
      }
    },
  }))
);
