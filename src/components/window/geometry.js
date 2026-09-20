import { MIN_VISIBLE_GRAB, TASKBAR_HEIGHT, TITLEBAR_HEIGHT } from "../../config/layout.js";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/** The 8 resize handles, in render order (edges first, corners on top). */
export const RESIZE_DIRECTIONS = [
  "top",
  "bottom",
  "left",
  "right",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
];

/**
 * Keep a dragged window reachable: the title bar can never leave the screen, and at least
 * MIN_VISIBLE_GRAB px of the window stay visible on the left/right.
 */
export const clampPosition = ({ x, y, width }, viewport) => ({
  x: clamp(x, MIN_VISIBLE_GRAB - width, viewport.width - MIN_VISIBLE_GRAB),
  y: clamp(y, 0, Math.max(0, viewport.height - TASKBAR_HEIGHT - TITLEBAR_HEIGHT)),
});

/**
 * Compute the new rectangle while resizing from `dir`, given how far the pointer has moved.
 * `rect` is the rectangle at the start of the gesture: { x, y, width, height }.
 */
export const computeResize = (dir, rect, dx, dy, { minWidth, minHeight }) => {
  let { x, y, width, height } = rect;

  if (dir.includes("right")) {
    width = Math.max(minWidth, rect.width + dx);
  }
  if (dir.includes("left")) {
    width = Math.max(minWidth, rect.width - dx);
    x = rect.x + (rect.width - width); // the right edge stays put
  }
  if (dir.includes("bottom")) {
    height = Math.max(minHeight, rect.height + dy);
  }
  if (dir.includes("top")) {
    height = Math.max(minHeight, rect.height - dy);
    y = rect.y + (rect.height - height); // the bottom edge stays put

    if (y < 0) {
      // Don't let the title bar be pushed above the screen.
      height += y;
      y = 0;
    }
  }

  return { x, y, width, height };
};
