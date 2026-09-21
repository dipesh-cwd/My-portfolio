import { ChevronUp, X } from "lucide-react";
import { getWindowTitle, APPS } from "../../config/apps.js";
import { asset } from "../../lib/assets.js";
import { useUiStore } from "../../store/uiStore.js";
import { useWindowStore } from "../../store/windowStore.js";

const actionClass =
  "cursor-pointer rounded-md bg-black/10 px-3 py-1.5 text-xs text-black hover:bg-black/20 disabled:cursor-not-allowed disabled:opacity-40";

/**
 * Slide-up panel above the taskbar: a window switcher with "Show desktop" and "Close all".
 * The chevron toggle stays reachable when collapsed; the content is `inert` so keyboard
 * focus can't wander into it while hidden.
 */
const QuickPanel = ({ panelRef }) => {
  const open = useUiStore((s) => s.panelOpen);
  const togglePanel = useUiStore((s) => s.togglePanel);
  const closeMenus = useUiStore((s) => s.closeMenus);

  const windows = useWindowStore((s) => s.windows);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const restoreWindow = useWindowStore((s) => s.restoreWindow);
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const minimizeAll = useWindowStore((s) => s.minimizeAll);
  const closeAll = useWindowStore((s) => s.closeAll);

  const list = Object.values(windows);
  const allMinimized = list.length > 0 && list.every((win) => win.isMinimized);

  const activate = (win) => {
    if (win.isMinimized) restoreWindow(win.id);
    else focusWindow(win.id);
    closeMenus();
  };

  return (
    <div
      ref={panelRef}
      className={`fixed left-0 z-[8999] w-full bg-white/50 backdrop-blur-3xl transition-all duration-500 ease-in-out ${
        open ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ bottom: "var(--taskbar-h)", height: "256px" }}
    >
      <button
        type="button"
        aria-label={open ? "Collapse panel" : "Expand panel"}
        aria-expanded={open}
        onClick={togglePanel}
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full cursor-pointer rounded-t-xl bg-white/50 px-5 backdrop-blur-3xl transition-all duration-200 ease-in-out select-none hover:scale-105 hover:bg-white/65"
      >
        <ChevronUp
          size={20}
          className={`text-black/70 transition-transform duration-300 hover:text-black/90 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      <div inert={!open} className="mx-auto flex h-full max-w-2xl flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-black/80">Open windows</h2>
          <div className="flex gap-2">
            <button
              type="button"
              className={actionClass}
              disabled={list.length === 0 || allMinimized}
              onClick={() => {
                minimizeAll();
                closeMenus();
              }}
            >
              Show desktop
            </button>
            <button
              type="button"
              className={actionClass}
              disabled={list.length === 0}
              onClick={() => {
                closeAll();
                closeMenus();
              }}
            >
              Close all
            </button>
          </div>
        </div>

        {list.length === 0 ? (
          <p className="text-sm text-black/60">No windows open. Pick an app from the dock.</p>
        ) : (
          <ul className="no-scrollbar min-h-0 flex-1 space-y-1 overflow-auto">
            {list.map((win) => {
              const title = getWindowTitle(win.appKey, win.data);
              return (
                <li key={win.id} className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => activate(win)}
                    className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-black hover:bg-black/10"
                  >
                    <img
                      src={asset(APPS[win.appKey].icon)}
                      alt=""
                      className="h-5 w-5 shrink-0 object-contain"
                    />
                    <span className="truncate">{title}</span>
                    {win.isMinimized && <span className="text-xs text-black/50">minimized</span>}
                  </button>
                  <button
                    type="button"
                    aria-label={`Close ${title}`}
                    onClick={() => closeWindow(win.id)}
                    className="cursor-pointer rounded-md p-1.5 text-black/60 hover:bg-black/10 hover:text-black"
                  >
                    <X size={14} aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default QuickPanel;
