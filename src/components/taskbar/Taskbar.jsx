import { ChevronUp, Earth, Lightbulb, Search, User, Wifi } from "lucide-react";
import { useState } from "react";
import { asset } from "../../lib/assets.js";
import Clock from "./Clock.jsx";
import Dock from "./Dock.jsx";

// Decorative tray icons (no behaviour yet).
const TRAY_ICONS = [Search, Wifi, Earth, User, Lightbulb];

const Taskbar = () => {
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <>
      {/* Slide-up panel above the taskbar (empty for now). */}
      <div
        className={`fixed left-0 z-[8999] w-full bg-white/50 backdrop-blur-3xl transition-all duration-500 ease-in-out ${
          panelOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ bottom: "var(--taskbar-h)", height: "256px" }}
      >
        <button
          type="button"
          aria-label={panelOpen ? "Collapse panel" : "Expand panel"}
          aria-expanded={panelOpen}
          onClick={() => setPanelOpen((open) => !open)}
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full cursor-pointer rounded-t-xl bg-white/50 px-5 backdrop-blur-3xl transition-all duration-200 ease-in-out select-none hover:scale-105 hover:bg-white/65"
        >
          <ChevronUp
            size={20}
            className={`text-black/70 transition-transform duration-300 hover:text-black/90 ${
              panelOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
      </div>

      <nav
        className="fixed bottom-0 left-0 z-[9000] flex h-10 w-full items-center justify-between bg-white/50 px-5 py-2 backdrop-blur-3xl select-none"
        style={{ height: "var(--taskbar-h)" }}
      >
        <div className="flex items-center gap-2">
          <img src={asset("web_logo.png")} alt="" className="h-7 w-7" />
          <p className="text-sm font-semibold tracking-wide">Dipesh's Portfolio</p>
        </div>

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
