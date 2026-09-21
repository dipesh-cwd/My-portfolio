import { useEffect, useState } from "react";
import { profile } from "../../data/profile.js";
import { asset } from "../../lib/assets.js";
import { prefersReducedMotion } from "../../lib/motion.js";

const BOOT_KEY = "portfolio:booted";
const SHOW_MS = 1400;
const FADE_MS = 400;

const alreadyBooted = () => {
  try {
    return sessionStorage.getItem(BOOT_KEY) === "1";
  } catch {
    return false; // storage can be blocked; just show the boot screen
  }
};

const markBooted = () => {
  try {
    sessionStorage.setItem(BOOT_KEY, "1");
  } catch {
    // ignore
  }
};

/**
 * Short "starting up" splash, shown once per browser session.
 * Skipped for visitors who prefer reduced motion.
 */
const BootScreen = () => {
  const [phase, setPhase] = useState(() =>
    alreadyBooted() || prefersReducedMotion() ? "done" : "show"
  );

  useEffect(() => {
    if (phase === "show") {
      markBooted();
      const timer = setTimeout(() => setPhase("fade"), SHOW_MS);
      return () => clearTimeout(timer);
    }
    if (phase === "fade") {
      const timer = setTimeout(() => setPhase("done"), FADE_MS);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`fixed inset-0 z-[20000] flex flex-col items-center justify-center gap-6 bg-black transition-opacity ${
        phase === "fade" ? "opacity-0" : "opacity-100"
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <img src={asset("web_logo.png")} alt="" className="h-16 w-16" />
      <p className="font-mono text-sm tracking-wide text-gray-300">{profile.name}'s Portfolio</p>
      <div className="h-1 w-48 overflow-hidden rounded-full bg-white/15">
        <div className="boot-bar h-full rounded-full bg-blue-400" />
      </div>
    </div>
  );
};

export default BootScreen;
