

import LiquidMagneticTitle from "./LiquidMagneticTitle";
import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";


const FONT_WEIGHTS = {
  title: { MIN: 100, MAX: 900, default: 100 },
  subtitle: { MIN: 400, MAX: 900, default: 400 },
};

const renderText = (text, className, baseWeight = 400) => {
  return [...text].map((char, i) => (
    <span
      key={i}
      className={className + " char"}

      style={{
        fontVariationSettings: `"wght" ${baseWeight}`,
        display: "inline-block",
        willChange: "font-variation-settings",
      }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));
};

const setupTextHover = (container, type) => {
  if (!container) return () => {};

  const letters = Array.from(container.querySelectorAll("span"));
  const config = FONT_WEIGHTS[type];
  const min = config.MIN;
  const max = config.MAX;
  const base = config.default;

  const animateLetter = (letter, weight, duration = 0.25) =>
    gsap.to(letter, {
      duration,
      ease: "power2.out",
      overwrite: "auto",
      fontVariationSettings: `"wght" ${weight}`,
    });

  let rafId = null;

  const handleMouseMove = (e) => {
    if (rafId) cancelAnimationFrame(rafId);
    const clientX = e.clientX;

    rafId = requestAnimationFrame(() => {
      const containerRect = container.getBoundingClientRect();
      const containerLeft = containerRect.left;
      const containerWidth = containerRect.width;

      const mouseX = clientX - containerLeft;

      letters.forEach((letter) => {
        const rect = letter.getBoundingClientRect();

        const letterCenter = rect.left - containerLeft + rect.width / 2;

        const distance = Math.abs(mouseX - letterCenter);

        const intensity = Math.exp(-(distance ** 2) / (containerWidth * 10));

        const newWeight = Math.round(min + (max - min) * intensity);
        animateLetter(letter, newWeight, 0.18);
      });
    });
  };

  const handleMouseLeave = () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    letters.forEach((letter) => animateLetter(letter, base, 0.5));
  };

  container.addEventListener("mousemove", handleMouseMove);
  container.addEventListener("mouseleave", handleMouseLeave);

  return () => {
    container.removeEventListener("mousemove", handleMouseMove);
    container.removeEventListener("mouseleave", handleMouseLeave);
    if (rafId) cancelAnimationFrame(rafId);
  };
};

const Welcome = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useGSAP(() => {
    const titleCleanup = titleRef.current && setupTextHover(titleRef.current, "title");
    const subtitleCleanup = subtitleRef.current && setupTextHover(subtitleRef.current, "subtitle");

    return () => {
      titleCleanup && titleCleanup();
      subtitleCleanup && subtitleCleanup();
    };
  }, []);

  return (
    <section className="flex flex-col items-center justify-center min-h-screen text-center px-4 text-white">
      <div ref={subtitleRef} className="cursor-pointer text-georama text-3xl md:text-4xl ">
        {renderText(
          "Hallo, ich bin Dipesh! Willkommen zu meinem",
          "text-georama",
          FONT_WEIGHTS.subtitle.default
        )}

        {/* <LiquidMagneticTitle
          text="Hallo, ich bin Dipesh! Willkommen zu meinem"
          intensity={1.8}
          radius={null}
          className="text-georama"
        />*/}
      </div> 

      <h1 ref={titleRef} className="mt-6 cursor-pointer text-georama  text-6xl md:text-9xl italic">
        {renderText("Portfolio", "text-georama", FONT_WEIGHTS.title.default)}

        {/* <LiquidMagneticTitle
          text="Portfolio"
          intensity={1.8}
          radius={null}
          className="text-georama"
        /> */}
      </h1>

      <div className="hidden md:block mt-6">
        <p>This Portfolio is designed for desktop and tab only.</p>
      </div>
    </section>
  );
};

export default Welcome;
