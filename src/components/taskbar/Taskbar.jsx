import { Earth, Lightbulb, Search, User, Wifi } from "lucide-react";
import { useCallback, useMemo, useRef } from "react";
import { profile } from "../../data/profile.js";
import { useTranslation } from "../../i18n/index.js";
import { asset } from "../../lib/assets.js";
import { useUiStore } from "../../store/uiStore.js";
import Clock from "./Clock.jsx";
import Dock from "./Dock.jsx";
import QuickPanel from "./QuickPanel.jsx";
import StartMenu from "./StartMenu.jsx";
import { useDismiss } from "./useDismiss.js";

// Decorative tray icons (no behaviour yet).
const TRAY_ICONS = [Search, Wifi, Earth, User, Lightbulb];

const Taskbar = () => {
  const t = useTranslation();
  const startOpen = useUiStore((s) => s.startOpen);
  const panelOpen = useUiStore((s) => s.panelOpen);
  const toggleStart = useUiStore((s) => s.toggleStart);
  const closeMenus = useUiStore((s) => s.closeMenus);

  const startButtonRef = useRef(null);
  const startMenuRef = useRef(null);
  const panelRef = useRef(null);
  const insideRefs = useMemo(() => [startButtonRef, startMenuRef, panelRef], []);

  // Click outside or Escape closes whichever popup is open.
  const dismiss = useCallback(
    (reason) => {
      const wasStartOpen = useUiStore.getState().startOpen;
      closeMenus();
      if (reason === "escape" && wasStartOpen) startButtonRef.current?.focus();
    },
    [closeMenus]
  );
  useDismiss(startOpen || panelOpen, insideRefs, dismiss);

  return (
    <>
      {startOpen && <StartMenu menuRef={startMenuRef} />}
      <QuickPanel panelRef={panelRef} />

      <nav
        className="fixed bottom-0 left-0 z-[9000] flex h-10 w-full items-center justify-between bg-white/50 px-5 py-2 backdrop-blur-3xl select-none"
        style={{ height: "var(--taskbar-h)" }}
      >
        <button
          ref={startButtonRef}
          type="button"
          aria-label={t("start.button")}
          aria-expanded={startOpen}
          onClick={toggleStart}
          className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-0.5 hover:bg-white/40"
        >
          <img src={asset("web_logo.png")} alt="" className="h-7 w-7" />
          <span className="text-sm font-semibold tracking-wide">{profile.name}'s Portfolio</span>
        </button>

        <div className="flex items-center gap-2">
          <Dock />
        </div>

        <div className="flex items-center gap-2">
          {TRAY_ICONS.map((Icon, i) => (
            <div
              key={i}
              aria-hidden="true"
              className="cursor-pointer rounded-full p-2 transition-all duration-200 hover:scale-120 hover:bg-gray-100/50 hover:shadow-md"
            >
              <Icon className="h-3.5 w-3.5 text-black" />
            </div>
          ))}

          <Clock />
        </div>
      </nav>
    </>
  );
};

export default Taskbar;
