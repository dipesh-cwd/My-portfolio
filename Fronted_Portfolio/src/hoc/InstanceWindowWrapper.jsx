import React, { useLayoutEffect, useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { useImageStore } from "../store/window.js";
import { FIXED_MIN_HEIGHT, FIXED_MIN_WIDTH } from "../constants/Index.jsx";

gsap.registerPlugin(Draggable);

const MIN_WIDTH = FIXED_MIN_WIDTH;
const MIN_HEIGHT = FIXED_MIN_HEIGHT;

const InstanceWindowWrapper = (Component) => {
  const Wrapped = ({ instanceId, ...props }) => {
    const rootRef = useRef(null);
    const draggableRef = useRef(null);
    const win = viewerInstances.find((v) => v.id === instanceId);
    const {
      viewerInstances,
      focusViewerInstance,
      setViewerInstanceState,
      toggleViewerMaximize,
      closeViewerInstance,
    } = useImageStore();

    const { x, y, width, height, zIndex, isOpen, isMaximized } = win;

    // layout effect: set DOM sizing/pos
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

      // reset transient GSAP transform so left/top reflect actual pos
      gsap.set(el, { x: 0, y: 0 });
    }, [x, y, width, height, zIndex, isOpen]);

    // draggable
    useEffect(() => {
      const el = rootRef.current;
      if (!el || !isOpen || isMaximized) return;
      const handle = el.querySelector("[data-drag-handle]");
      if (!handle) return;

      // kill any previous instance
      if (draggableRef.current) {
        try {
          draggableRef.current.kill();
        } catch (e) {
          console.log(e);
        } // ignore
        draggableRef.current = null;
      }

      const instance = Draggable.create(el, {
        type: "x,y",
        trigger: handle,
        inertia: true,
        edgeResistance: 0.85,
        bounds: document.body,

        onPress: () => focusViewerInstance(instanceId),

        onDragEnd: function () {
          const rect = el.getBoundingClientRect();
          const newLeft = Math.round(rect.left);
          const newTop = Math.round(rect.top);

          // commit final left/top to inline style so layout effect picks up
          el.style.left = `${newLeft}px`;
          el.style.top = `${newTop}px`;

          setViewerInstanceState(instanceId, { x: newLeft, y: newTop });

          // clear gsap transient transform
          gsap.set(el, { x: 0, y: 0 });
        },

        onThrowUpdate: function () {
          const rect = el.getBoundingClientRect();
          const newLeft = Math.round(rect.left);
          const newTop = Math.round(rect.top);

          el.style.left = `${newLeft}px`;
          el.style.top = `${newTop}px`;
          setViewerInstanceState(instanceId, { x: newLeft, y: newTop });

          gsap.set(el, { x: 0, y: 0 });
        },
      })[0];

      draggableRef.current = instance;

      return () => {
        try {
          draggableRef.current?.kill();
        } catch (err) {
          console.log(err);
        }
        draggableRef.current = null;
      };
    }, [isOpen, isMaximized, focusViewerInstance, setViewerInstanceState, instanceId]);

    // resize handlers (adapted from your original code)
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

        // horizontal resizing
        if (state.dir.includes("right")) {
          newWidth = Math.max(MIN_WIDTH, Math.round(state.startWidth + dx));
        }
        if (state.dir.includes("left")) {
          const clampedWidth = Math.max(MIN_WIDTH, Math.round(state.startWidth - dx));
          newLeft = state.startLeft + (state.startWidth - clampedWidth);
          newWidth = clampedWidth;
        }

        // vertical resizing
        if (state.dir.includes("bottom")) {
          newHeight = Math.max(MIN_HEIGHT, Math.round(state.startHeight + dy));
        }
        if (state.dir.includes("top")) {
          const clampedHeight = Math.max(MIN_HEIGHT, Math.round(state.startHeight - dy));
          newTop = state.startTop + (state.startHeight - clampedHeight);
          newHeight = clampedHeight;
        }

        // apply
        el.style.width = `${newWidth}px`;
        el.style.height = `${newHeight}px`;
        el.style.left = `${newLeft}px`;
        el.style.top = `${newTop}px`;

        // persist to store so other consumers see updated geometry
        setViewerInstanceState(instanceId, {
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
    }, [isMaximized, setViewerInstanceState, instanceId]);

    const onTitleDoubleClick = useCallback(
      (e) => {
        e?.preventDefault?.();
        toggleViewerMaximize(instanceId);
      },
      [toggleViewerMaximize, instanceId]
    );

    if (!win) return null;

    return (
      <section
        ref={rootRef}
        aria-label={`window-instance-${instanceId}`}
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

        <Component
          {...props}
          instanceId={instanceId}
          onTitleDoubleClick={onTitleDoubleClick}
          onClose={() => closeViewerInstance(instanceId)}
        />
      </section>
    );
  };

  Wrapped.displayName = `InstanceWindowWrapper(${Component.displayName || Component.name || "Component"})`;
  return Wrapped;
};

export default InstanceWindowWrapper;
