import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

const defaultProps = {
  text: "Portfolio",
  intensity: 1.6,
  radius: null,
  className: "",
};

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const LiquidMagneticTitle = (props) => {
  const { text, intensity, radius, className } = { ...defaultProps, ...props };
  const containerRef = useRef(null);
  const lettersRef = useRef([]);
  const stateRef = useRef({
    mouseX: -9999,
    mouseY: -9999,
    containerRect: null,
    perLetter: [],
    running: false,
    rafId: null,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const spans = Array.from(container.querySelectorAll("span.lm-char"));
    lettersRef.current = spans;

    const rect = container.getBoundingClientRect();
    stateRef.current.containerRect = rect;

    stateRef.current.perLetter = spans.map((el) => {
      const r = el.getBoundingClientRect();
      // center relative to container
      const cx = r.left - rect.left + r.width / 2;
      const cy = r.top - rect.top + r.height / 2;
      return {
        cx,
        cy,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        lastPull: 0,
      };
    });

    let isTouch = false;
    const onMove = (e) => {
      isTouch = e.type.startsWith("touch");
      const clientX = isTouch ? e.touches[0].clientX : e.clientX;
      const clientY = isTouch ? e.touches[0].clientY : e.clientY;

      const r = container.getBoundingClientRect();
      stateRef.current.containerRect = r;
      stateRef.current.mouseX = clientX - r.left;
      stateRef.current.mouseY = clientY - r.top;

      if (!stateRef.current.running) {
        stateRef.current.running = true;
        loop();
      }
    };
    const onLeave = () => {
      stateRef.current.mouseX = -9999;
      stateRef.current.mouseY = -9999;
    };

    container.addEventListener("mousemove", onMove);
    container.addEventListener("touchmove", onMove, { passive: true });
    container.addEventListener("mouseleave", onLeave);
    container.addEventListener("touchend", onLeave);

    const onResize = () => {
      const rect = container.getBoundingClientRect();
      stateRef.current.containerRect = rect;
      stateRef.current.perLetter.forEach((s, i) => {
        const r = spans[i].getBoundingClientRect();
        s.cx = r.left - rect.left + r.width / 2;
        s.cy = r.top - rect.top + r.height / 2;
      });
    };
    window.addEventListener("resize", onResize);

    return () => {
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("touchmove", onMove);
      container.removeEventListener("mouseleave", onLeave);
      container.removeEventListener("touchend", onLeave);
      window.removeEventListener("resize", onResize);
      if (stateRef.current.rafId) cancelAnimationFrame(stateRef.current.rafId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  // main loop: physics + apply transforms
  const loop = () => {
    const st = stateRef.current;
    const letters = lettersRef.current;
    const perLetter = st.perLetter;
    if (!letters || perLetter.length === 0) return;

    const r = st.containerRect || containerRef.current.getBoundingClientRect();
    const effRadius = radius || Math.max(r.width * 0.25, 160);

    const dt = 1 / 60; // assume ~60fps for stable physics steps
    const pullFactor = 0.35 * intensity;
    const damping = 0.85;
    const snap = 0.12;

    for (let i = 0; i < letters.length; i++) {
      const el = letters[i];
      const s = perLetter[i];

      const mx = st.mouseX;
      const my = st.mouseY;
      const dx = mx - s.cx;
      const dy = my - s.cy;
      const dist = Math.hypot(dx, dy);

      let pull = 0;
      if (mx > -9000) {
        const influence = clamp(1 - dist / effRadius, 0, 1); // 0..1
        pull = Math.pow(influence, 1.2) * pullFactor;
      }

      let ax = 0;
      let ay = 0;
      if (pull > 0) {
        const inv = 1;
        ax = dx * pull * inv;
        ay = dy * pull * inv;
      }

      const sx = -s.x * snap;
      const sy = -s.y * snap;

      s.vx = (s.vx + (ax + sx) * dt) * damping;
      s.vy = (s.vy + (ay + sy) * dt) * damping;

      s.x += s.vx;
      s.y += s.vy;

      const vx = s.vx;

      const translateX = s.x;
      const translateY = s.y * 0.6;
      const stretch = clamp(1 + Math.hypot(s.x, s.y) * 0.004 * intensity, 0.9, 1.35);
      const squash = clamp(1 - Math.hypot(s.x, s.y) * 0.0025 * intensity, 0.88, 1.08);

      const rot = clamp(vx * 0.08 * intensity, -12, 12);

      const baseWeight = 200;
      const minW = 120;
      const maxW = 900;
      const weightIntensity = clamp(1 + Math.hypot(s.x, s.y) * 0.02 * intensity, 1, 4);
      const fontW = clamp(Math.round(baseWeight * weightIntensity), minW, maxW);

      const transform = `translate3d(${translateX}px, ${translateY}px, 0) rotate(${rot}deg) scale(${stretch}, ${squash})`;
      el.style.transform = transform;
      el.style.fontVariationSettings = `"wght" ${fontW}`;
      el.style.transition = "none";
      el.style.willChange = "transform, font-variation-settings";
    }

    let maxOffset = 0;
    for (let s of perLetter) {
      maxOffset = Math.max(maxOffset, Math.abs(s.x), Math.abs(s.y), Math.abs(s.vx), Math.abs(s.vy));
    }

    if (maxOffset > 0.01) {
      st.rafId = requestAnimationFrame(loop);
    } else {
      perLetter.forEach((s, i) => {
        const el = letters[i];
        gsap.to(el, {
          duration: 0.45,
          ease: "power3.out",
          overwrite: true,
          transform: "translate3d(0px,0px,0px) rotate(0deg) scale(1,1)",
          onComplete: () => {
            el.style.willChange = "";
          },
        });
        gsap.to(el, {
          duration: 0.45,
          ease: "power3.out",
          overwrite: true,

          onStart: () => {},
          onUpdate: () => {},
        });
        el.style.fontVariationSettings = `"wght" 100`;
      });
      st.running = false;
      st.rafId = null;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`lm-wrapper ${className} select-none`}
      style={{ display: "inline-block", lineHeight: 1 }}
      role="presentation"
    >
      {Array.from(text).map((ch, i) => (
        <span
          key={i}
          className="lm-char"
          style={{
            display: "inline-block",
            transformOrigin: "50% 50%",
            fontVariationSettings: `"wght" 100`,
            transition: "font-variation-settings 0.18s linear",
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
          }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </div>
  );
};

export default LiquidMagneticTitle;
