import { vi } from "vitest";

/**
 * Stub window.matchMedia with a controllable query result.
 * Call vi.unstubAllGlobals() (or rely on the test's afterEach) to remove it.
 */
export const mockMatchMedia = (initial) => {
  let matches = initial;
  const listeners = new Set();
  const mql = {
    get matches() {
      return matches;
    },
    addEventListener: (_, fn) => listeners.add(fn),
    removeEventListener: (_, fn) => listeners.delete(fn),
  };
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => mql)
  );
  return {
    set(next) {
      matches = next;
      listeners.forEach((fn) => fn());
    },
    listenerCount: () => listeners.size,
  };
};
