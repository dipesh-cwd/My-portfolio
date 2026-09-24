import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef } from "react";
import { Tooltip } from "react-tooltip";
import { useShallow } from "zustand/react/shallow";
import { APPS, DOCK_APPS } from "../../config/apps.js";
import { useTranslation } from "../../i18n/index.js";
import { asset } from "../../lib/assets.js";
import { useWindowStore } from "../../store/windowStore.js";

const Dock = () => {
  const t = useTranslation();
  const dockRef = useRef(null);
  const toggleApp = useWindowStore((s) => s.toggleApp);
  // Which apps currently have a window open (used for the little indicator dot).
  const openApps = useWindowStore(
    useShallow((s) => Object.values(s.windows).map((win) => win.appKey))
  );

  // macOS-style magnify effect: icons near the cursor grow and lift.
  useGSAP(() => {
    const dock = dockRef.current;
    if (!dock) return;
    const icons = dock.querySelectorAll(".dock-icon");

    const handleMouseMove = (e) => {
      const { left } = dock.getBoundingClientRect();
      const mouseX = e.clientX - left;

      icons.forEach((icon) => {
        const { left: iconLeft, width } = icon.getBoundingClientRect();
        const center = iconLeft - left + width / 2;
        const distance = Math.abs(mouseX - center);
        const intensity = Math.exp(-(distance ** 2.7) / 20000);

        gsap.to(icon, {
          scale: 1 + 0.25 * intensity,
          y: -15 * intensity,
          duration: 0.2,
          ease: "power1.out",
        });
      });
    };

    const resetIcons = () => {
      icons.forEach((icon) => {
        gsap.to(icon, { scale: 1, y: 0, duration: 0.3, ease: "power1.out" });
      });
    };

    dock.addEventListener("mousemove", handleMouseMove);
    dock.addEventListener("mouseleave", resetIcons);
    return () => {
      dock.removeEventListener("mousemove", handleMouseMove);
      dock.removeEventListener("mouseleave", resetIcons);
    };
  }, []);

  return (
    <section id="dock">
      <div className="flex flex-row items-end justify-center gap-4" ref={dockRef}>
        {DOCK_APPS.map((appKey) => {
          const { titleKey, icon } = APPS[appKey];
          const title = t(titleKey);
          const isOpen = openApps.includes(appKey);

          return (
            <div key={appKey} className="relative flex justify-items-center">
              <button
                type="button"
                className="dock-icon h-7 w-7 cursor-pointer object-contain"
                aria-label={title}
                data-tooltip-id="dock-tooltip"
                data-tooltip-content={title}
                data-tooltip-delay-show={150}
                onClick={() => toggleApp(appKey)}
              >
                <img src={asset(icon)} alt="" loading="lazy" />
              </button>
              {isOpen && (
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-black/70"
                />
              )}
            </div>
          );
        })}
        <Tooltip id="dock-tooltip" place="top" className="tooltip" />
      </div>
    </section>
  );
};

export default Dock;
