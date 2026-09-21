import { useEffect } from "react";

/**
 * While `active`, call `onDismiss` when the user presses a pointer outside every element in
 * `refs`, or presses Escape. `onDismiss(reason)` receives "outside" or "escape".
 */
export function useDismiss(active, refs, onDismiss) {
  useEffect(() => {
    if (!active) return;

    const onPointerDown = (event) => {
      const inside = refs.some((ref) => ref.current?.contains(event.target));
      if (!inside) onDismiss("outside");
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") onDismiss("escape");
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [active, refs, onDismiss]);
}
