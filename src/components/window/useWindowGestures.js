import { useCallback } from "react";
import { getMinSize, useWindowStore } from "../../store/windowStore.js";
import { clampPosition, computeResize } from "./geometry.js";

/**
 * Drag + resize for a window frame using plain pointer events.
 *
 * While a gesture is running we write `left/top/width/height` straight onto the DOM node
 * (cheap, no React renders, no store writes), then commit the final rectangle to the store
 * once on pointer-up. That keeps dragging smooth and keeps every other window from
 * re-rendering on each mouse move.
 */
export function useWindowGestures(id, frameRef) {
  const startGesture = useCallback(
    (event, mode, dir) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;

      const el = frameRef.current;
      const win = useWindowStore.getState().windows[id];
      if (!el || !win || win.isMaximized) return;

      event.preventDefault(); // no text selection / native image drag while gesturing

      const origin = { x: win.x, y: win.y, width: win.width, height: win.height };
      const min = getMinSize(win.appKey);
      const startX = event.clientX;
      const startY = event.clientY;
      const previousUserSelect = document.body.style.userSelect;
      let latest = origin;

      document.body.style.userSelect = "none";

      const onMove = (e) => {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        if (mode === "move") {
          const viewport = { width: window.innerWidth, height: window.innerHeight };
          const position = clampPosition(
            { x: origin.x + dx, y: origin.y + dy, width: origin.width },
            viewport
          );
          latest = { ...origin, ...position };
        } else {
          latest = computeResize(dir, origin, dx, dy, min);
        }

        el.style.left = `${latest.x}px`;
        el.style.top = `${latest.y}px`;
        el.style.width = `${latest.width}px`;
        el.style.height = `${latest.height}px`;
      };

      const finish = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", finish);
        window.removeEventListener("pointercancel", finish);
        document.body.style.userSelect = previousUserSelect;
        useWindowStore.getState().setBounds(id, latest);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", finish);
      window.addEventListener("pointercancel", finish);
    },
    [id, frameRef]
  );

  const startMove = useCallback(
    (event) => {
      // Let the window-control buttons work; only the empty title bar drags.
      if (event.target.closest("button")) return;
      startGesture(event, "move");
    },
    [startGesture]
  );

  const startResize = useCallback(
    (dir) => (event) => startGesture(event, "resize", dir),
    [startGesture]
  );

  return { startMove, startResize };
}
