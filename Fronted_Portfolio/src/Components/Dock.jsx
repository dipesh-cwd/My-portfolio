

import React from "react";
import { Tooltip } from "react-tooltip";
import { dockApps } from "../constants/Index.jsx";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const Dock = () => {
  const dockRef = React.useRef(null);

  useGSAP(() => {
    const dock = dockRef.current;
    if (!dock) return;
    const icons = dock.querySelectorAll(".dock-icon");
    const animations = (mousex) => {
      const { left } = dock.getBoundingClientRect();
      icons.forEach((icon) => {
        const { left: iconLeft, width } = icon.getBoundingClientRect();
        const center = iconLeft - left + width / 2;
        const distance = Math.abs(mousex - center);
        const intensity = Math.exp(-(distance ** 2.7) / 20000);

        gsap.to(icon, {
          scale: 1 + 0.25 * intensity,
          duration: 0.2,
          y: -15 * intensity,
          ease: "power1.out",
        });
      });
    };
    const handleMouseMove = (e) => {
      const { left } = dock.getBoundingClientRect();
      animations(e.clientX - left);
    };

    const resetIcons = () => {
      icons.forEach((icon) => {
        gsap.to(icon, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power1.out",
        });
      });
    };

    dock.addEventListener("mousemove", handleMouseMove);
    dock.addEventListener("mouseleave", resetIcons);
    return () => {
      dock.removeEventListener("mousemove", handleMouseMove);
      dock.removeEventListener("mouseleave", resetIcons);
    };
  }, []);

  const toggleapp = (app) => {
    console.log(`Opening ${app} application`);
  };

  return (
    <section id="dock">
      <div className="dock-container flex flex-row items-end gap-4 justify-center" ref={dockRef}>
        {dockApps.map(({ id, name, icon, canOpen }) => (
          <div
            key={id}
            className="relative flex justify-items-center
             
            duration-200 cursor-pointer"
          >
            <button
              type="button"
              className="dock-icon  w-7 h-7 object-contain cursor-pointer"
              aria-label={name}
              data-tooltip-id="dock-tooltip"
              data-tooltip-content={name}
              data-tooltip-delay-show={150}
              disabled={!canOpen}
              onClick={() => toggleapp(id, canOpen)}
            >
              <img
                src={`/${icon}`}
                alt={name}
                loading="lazy"
                className={`  ${canOpen ? "" : "opacity-60"}`}
              />
            </button>
          </div>
        ))}
        <Tooltip id="dock-tooltip" place="top" className="tooltip" />
      </div>
    </section>
  );
};

export default Dock;
