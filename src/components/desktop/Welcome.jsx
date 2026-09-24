import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef } from "react";
import { useTranslation } from "../../i18n/index.js";
import { usePreferencesStore } from "../../store/preferencesStore.js";
import LiquidMagneticTitle from "./LiquidMagneticTitle.jsx";

const FONT_WEIGHTS = {
  title: { MIN: 400, MAX: 900, default: 400 },
  subtitle: { MIN: 100, MAX: 900, default: 100 },
};

const renderText = (text, className, baseWeight = 400) =>
  [...text].map((char, i) => (
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

/**
 * The desktop welcome screen: a greeting plus the animated "Portfolio" title.
 * Hidden entirely when the visitor turns off "Show welcome screen" in Settings; the letter
 * hover/magnetic effects are separately skipped when "Animate the title" is off.
 */
const Welcome = () => {
  const t = useTranslation();
  const welcomeVisible = usePreferencesStore((s) => s.welcomeVisible);
  const welcomeAnimation = usePreferencesStore((s) => s.welcomeAnimation);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useGSAP(
    () => {
      if (!welcomeAnimation) return;
      const titleCleanup = titleRef.current && setupTextHover(titleRef.current, "title");
      const subtitleCleanup =
        subtitleRef.current && setupTextHover(subtitleRef.current, "subtitle");

      return () => {
        titleCleanup && titleCleanup();
        subtitleCleanup && subtitleCleanup();
      };
    },
    { dependencies: [welcomeAnimation] }
  );

  if (!welcomeVisible) return null;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center px-4 text-white">
      <div ref={subtitleRef} className="cursor-pointer text-georama text-3xl md:text-4xl ">
        {renderText(t("welcome.greeting"), "text-georama", FONT_WEIGHTS.subtitle.default)}
      </div>

      <h1 ref={titleRef} className="mt-6 cursor-pointer text-georama  text-6xl md:text-9xl italic">
        <LiquidMagneticTitle
          text={t("welcome.title")}
          intensity={1.8}
          radius={null}
          className="text-georama"
          animate={welcomeAnimation}
        />
      </h1>
    </main>
  );
};

export default Welcome;
