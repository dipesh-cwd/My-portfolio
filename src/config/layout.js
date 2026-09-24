/** Height of the bottom taskbar in px. Keep in sync with `--taskbar-h` in index.css. */
export const TASKBAR_HEIGHT = 40;

/** Approximate title bar height; used to keep dragged windows grabbable. */
export const TITLEBAR_HEIGHT = 40;

/** How much of a window must stay on screen horizontally when dragged (px). */
export const MIN_VISIBLE_GRAB = 96;

/** Offset between windows that would otherwise open exactly on top of each other. */
export const CASCADE_STEP = 28;
export const CASCADE_SLOTS = 6;

/** Windows use z-index BASE_Z..Z_LIMIT; the taskbar sits above (see Taskbar.jsx). */
export const BASE_Z = 10;
export const Z_LIMIT = 5000;

/** Margin kept around a new window when the viewport is smaller than the window. */
export const VIEWPORT_MARGIN = 16;

/** Below this width the desktop UI is replaced by a simple scrolling page (see MobileSite). */
export const MOBILE_QUERY = "(max-width: 767px)";
