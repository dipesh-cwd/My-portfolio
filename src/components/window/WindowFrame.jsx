import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { getWindowTitle } from "../../config/apps.js";
import { useTranslation } from "../../i18n/index.js";
import { prefersReducedMotion } from "../../lib/motion.js";
import { useUiStore } from "../../store/uiStore.js";
import { useWindowStore } from "../../store/windowStore.js";
import { WINDOW_COMPONENTS } from "../../windows/registry.js";
import Placeholder from "../../windows/Placeholder.jsx";
import { RESIZE_DIRECTIONS } from "./geometry.js";
import { useWindowGestures } from "./useWindowGestures.js";
import WindowControls from "./WindowControls.jsx";

const HANDLE_CLASSES = {
  top: "top-0 left-0 h-2 w-full cursor-ns-resize",
  bottom: "bottom-0 left-0 h-2 w-full cursor-ns-resize",
  left: "top-0 left-0 h-full w-2 cursor-ew-resize",
  right: "top-0 right-0 h-full w-2 cursor-ew-resize",
  "top-left": "top-0 left-0 h-4 w-4 cursor-nwse-resize",
  "top-right": "top-0 right-0 h-4 w-4 cursor-nesw-resize",
  "bottom-left": "bottom-0 left-0 h-4 w-4 cursor-nesw-resize",
  "bottom-right": "bottom-0 right-0 h-4 w-4 cursor-nwse-resize",
};

/**
 * One draggable / resizable window. It knows nothing about *what* it shows: the content
 * component comes from the registry, the title from the app config.
 */
const WindowFrame = ({ id }) => {
  const win = useWindowStore((s) => s.windows[id]);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const toggleMaximize = useWindowStore((s) => s.toggleMaximize);
  const closeWindow = useWindowStore((s) => s.closeWindow);

  const frameRef = useRef(null);
  const { startMove, startResize } = useWindowGestures(id, frameRef);
  const t = useTranslation();

  // Move keyboard focus into a newly opened window (unless its content already took it,
  // like the image viewer does), so keyboard and screen-reader users land in it.
  useEffect(() => {
    const el = frameRef.current;
    if (el && !el.contains(document.activeElement)) el.focus({ preventScroll: true });
  }, []);

  // Escape closes the focused window, except while typing (don't lose a half-written message)
  // or while a taskbar popup is open (Escape should close that first).
  const onKeyDown = (event) => {
    if (event.key !== "Escape" || event.defaultPrevented) return;
    if (event.target.closest("input, textarea, select, [contenteditable='true']")) return;
    const { startOpen, panelOpen } = useUiStore.getState();
    if (startOpen || panelOpen) return;
    closeWindow(id);
  };

  // Small "pop in" when a window opens (skipped for reduced-motion visitors).
  useGSAP(
    () => {
      const el = frameRef.current;
      if (!el || prefersReducedMotion()) return;
      gsap.from(el, {
        opacity: 0,
        scale: 0.95,
        duration: 0.18,
        ease: "power2.out",
        clearProps: "opacity,transform",
      });
    },
    { dependencies: [] }
  );

  if (!win) return null;

  const Content = WINDOW_COMPONENTS[win.appKey] ?? Placeholder;
  const title = getWindowTitle(win.appKey, win.data, t);

  // A maximized window is sized with CSS (not stored numbers) so it always fits the viewport.
  const geometry = win.isMaximized
    ? { left: 0, top: 0, width: "100%", height: "calc(100% - var(--taskbar-h))" }
    : { left: win.x, top: win.y, width: win.width, height: win.height };

  return (
    <section
      ref={frameRef}
      role="dialog"
      aria-label={title}
      tabIndex={-1}
      className={`fixed flex flex-col overflow-hidden border border-[var(--win-border)] bg-[var(--win-bg)] font-mono text-[var(--content-text)] shadow-2xl outline-none ${
        win.isMaximized ? "rounded-none" : "rounded-md"
      }`}
      style={{
        ...geometry,
        zIndex: win.zIndex,
        display: win.isMinimized ? "none" : undefined,
      }}
      onPointerDownCapture={() => focusWindow(id)}
      onKeyDown={onKeyDown}
    >
      {!win.isMaximized &&
        RESIZE_DIRECTIONS.map((dir) => (
          <div
            key={dir}
            data-resize-dir={dir}
            className={`absolute z-50 ${HANDLE_CLASSES[dir]}`}
            style={{ touchAction: "none" }}
            onPointerDown={startResize(dir)}
          />
        ))}

      <div
        data-drag-handle
        className="flex shrink-0 cursor-grab select-none items-center justify-between border-b border-[var(--win-border)] bg-[var(--titlebar-bg)] px-4 py-2 text-[var(--titlebar-text)] active:cursor-grabbing"
        style={{ touchAction: "none" }}
        onPointerDown={startMove}
        onDoubleClick={(event) => {
          if (event.target.closest("button")) return;
          toggleMaximize(id);
        }}
      >
        <span className="truncate text-sm">{title}</span>
        <WindowControls id={id} />
      </div>

      <div className="no-scrollbar min-h-0 flex-1 overflow-auto">
        <Content windowId={id} appKey={win.appKey} data={win.data} />
      </div>
    </section>
  );
};

export default WindowFrame;
