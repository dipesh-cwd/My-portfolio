import React, { useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import useWindowStore from "../store/window.js";
import { FIXED_MIN_HEIGHT, FIXED_MIN_WIDTH } from "../constants/Index.jsx";

gsap.registerPlugin(Draggable);

const MIN_WIDTH = FIXED_MIN_WIDTH;
const MIN_HEIGHT = FIXED_MIN_HEIGHT;

const WindowWrapper = (Component, windowKey) => {
  const Wrapped = (props) => {
    const { windows, focusWindow, setWindowState, toggleMaximize } = useWindowStore();
    const win = windows?.[windowKey];
    const { isOpen, zIndex, x, y, width, height, isMaximized } = win;

    

    const rootRef = useRef(null);
    const draggableRef = useRef(null);




   

    

    useLayoutEffect(() => {
      const el = rootRef.current;
      if (!el) return;
      const w = Math.max(MIN_WIDTH, width ?? 650);
      const h = Math.max(MIN_HEIGHT, height ?? 420);

      el.style.position = "fixed";
      el.style.left = `${x ?? Math.round(window.innerWidth / 2 - w / 2)}px`;
      el.style.top = `${y ?? Math.round(window.innerHeight / 2 - h / 2)}px`;
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      el.style.zIndex = String(zIndex ?? 100);
      el.style.display = isOpen ? "block" : "none";

      gsap.set(el, { x: 0, y: 0 });
    }, [x, y, width, height, zIndex, isOpen]);

    useEffect(() => {
      const el = rootRef.current;
      if (!el || !isOpen || isMaximized) return;

      const handle = el.querySelector("[data-drag-handle]");
      if (!handle) {
        return;
      }

      if (draggableRef.current) {
        draggableRef.current.kill();
        draggableRef.current = null;
      }

      const instance = Draggable.create(el, {
        type: "x,y",
        trigger: handle,
        inertia: true,
        edgeResistance: 0.85,
        bounds: document.body,

        onPress: () => focusWindow(windowKey),

        onDragEnd: function () {
          const rect = el.getBoundingClientRect();

          const newLeft = Math.round(rect.left);
          const newTop = Math.round(rect.top);

          el.style.left = `${newLeft}px`;
          el.style.top = `${newTop}px`;

          setWindowState(windowKey, { x: newLeft, y: newTop });

          gsap.set(el, { x: 0, y: 0 });
        },

        onThrowUpdate: function () {
          const rect = el.getBoundingClientRect();
          const newLeft = Math.round(rect.left);
          const newTop = Math.round(rect.top);

          el.style.left = `${newLeft}px`;
          el.style.top = `${newTop}px`;

          setWindowState(windowKey, { x: newLeft, y: newTop });
          gsap.set(el, { x: 0, y: 0 });
        },
      })[0];

      draggableRef.current = instance;

      return () => {
        try {
          draggableRef.current?.kill();
          draggableRef.current = null;
        } catch (_) {}
      };
    }, [isOpen, isMaximized, focusWindow, setWindowState, windowKey]);

    useEffect(() => {
      const el = rootRef.current;
      if (!el || isMaximized) return;

      let state = null;

      const getRect = () => {
        const style = getComputedStyle(el);
        return {
          left: parseFloat(style.left || 0),
          top: parseFloat(style.top || 0),
          width: parseFloat(style.width || 0),
          height: parseFloat(style.height || 0),
        };
      };

      const onMouseDown = (evt) => {
        const dir = evt.target?.dataset?.resizeDir;
        if (!dir) return;

        evt.preventDefault();
        evt.stopPropagation();

        const r = getRect();
        state = {
          dir,
          startX: evt.clientX,
          startY: evt.clientY,
          startLeft: r.left,
          startTop: r.top,
          startWidth: r.width,
          startHeight: r.height,
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
      };

      const onMouseMove = (ev) => {
        if (!state) return;
        ev.preventDefault();

        const dx = ev.clientX - state.startX;
        const dy = ev.clientY - state.startY;

        let newLeft = state.startLeft;
        let newTop = state.startTop;
        let newWidth = state.startWidth;
        let newHeight = state.startHeight;



        if (state.dir.includes("right")) {
          newWidth = Math.max(MIN_WIDTH, Math.round(state.startWidth + dx));
        }

        if (state.dir.includes("left")) {
          const clampedWidth = Math.max(MIN_WIDTH, Math.round(state.startWidth - dx));
          newLeft = state.startLeft+(state.startWidth- clampedWidth);
          newWidth = clampedWidth;
        }

        if (state.dir.includes("bottom")) {
          newHeight = Math.max(MIN_HEIGHT, Math.round(state.startHeight + dy));
        }




        if (state.dir.includes("top")) {
           const clampedWidth = Math.max(MIN_HEIGHT, Math.round(state.startHeight - dy));
          newTop = state.startTop+(state.startHeight- clampedWidth);
          newHeight = clampedWidth;
        }

        el.style.width = `${newWidth}px`;
        el.style.height = `${newHeight}px`;
        el.style.left = `${newLeft}px`;
        el.style.top = `${newTop}px`;

        setWindowState(windowKey, {
          x: newLeft,
          y: newTop,
          width: newWidth,
          height: newHeight,
        });
      };

      const onMouseUp = () => {
        state = null;
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      const handles = el.querySelectorAll("[data-resize-dir]");
      handles.forEach((h) => h.addEventListener("mousedown", onMouseDown));

      return () => {
        handles.forEach((h) => h.removeEventListener("mousedown", onMouseDown));
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
    }, [isMaximized, setWindowState, windowKey]);

    const onTitleDoubleClick = useCallback(
      (e) => {
        e?.preventDefault?.();
        toggleMaximize(windowKey);
      },
      [toggleMaximize, windowKey]
    );



     if (!win) {
      console.warn("WindowWrapper: no window config for", windowKey);
      return null;
    }

    return (
      <section
        ref={rootRef}
        aria-label={`window-${windowKey}`}
        className="bg-black text-white no-scrollbar rounded-md shadow-2xl border border-gray-800 overflow-hidden font-mono"
        style={{ touchAction: "none" }}
      >
        {!isMaximized && (
          <>
            <div
              data-resize-dir="top"
              className="absolute top-0 left-0 w-full h-2 cursor-ns-resize z-50"
            />
            <div
              data-resize-dir="bottom"
              className="absolute bottom-0 left-0 w-full h-2 cursor-ns-resize z-50"
            />
            <div
              data-resize-dir="left"
              className="absolute top-0 left-0 h-full w-2 cursor-ew-resize z-50"
            />
            <div
              data-resize-dir="right"
              className="absolute top-0 right-0 h-full w-2 cursor-ew-resize z-50"
            />
            <div
              data-resize-dir="top-left"
              className="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize z-50"
            />
            <div
              data-resize-dir="top-right"
              className="absolute top-0 right-0 w-4 h-4 cursor-nesw-resize z-50"
            />
            <div
              data-resize-dir="bottom-left"
              className="absolute bottom-0 left-0 w-4 h-4 cursor-nesw-resize z-50"
            />
            <div
              data-resize-dir="bottom-right"
              className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-50"
            />
          </>
        )}

        <Component {...props} onTitleDoubleClick={onTitleDoubleClick} />
      </section>
    );
  };

  Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || "Component"})`;
  return Wrapped;
};

export default WindowWrapper;
