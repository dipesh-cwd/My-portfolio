import { describe, expect, it } from "vitest";
import { BASE_Z, Z_LIMIT } from "../config/layout.js";
import { getTopVisibleZ, useWindowStore } from "./windowStore.js";

const state = () => useWindowStore.getState();

describe("openApp", () => {
  it("opens a single-instance app centered in the viewport above the taskbar", () => {
    const id = state().openApp("skill");
    const win = state().windows[id];

    expect(id).toBe("skill");
    expect(win).toMatchObject({ appKey: "skill", width: 650, height: 420, isMinimized: false });
    expect(win.x).toBe(Math.round((1280 - 650) / 2));
    expect(win.y).toBe(Math.round((800 - 40 - 420) / 2));
  });

  it("returns null and changes nothing for an unknown app", () => {
    expect(state().openApp("nope")).toBeNull();
    expect(state().windows).toEqual({});
  });

  it("opening an already-open single-instance app does not duplicate it", () => {
    state().openApp("skill");
    state().openApp("photos");
    state().openApp("skill");

    expect(Object.keys(state().windows).sort()).toEqual(["photos", "skill"]);
    // ...but it does bring it to the front
    expect(state().windows.skill.zIndex).toBeGreaterThan(state().windows.photos.zIndex);
  });

  it("restores a minimized single-instance window when opened again", () => {
    state().openApp("skill");
    state().minimizeWindow("skill");
    state().openApp("skill");
    expect(state().windows.skill.isMinimized).toBe(false);
  });

  it("multi-instance apps always create a new window with its own data", () => {
    const a = state().openApp("viewer", { images: [{ name: "a" }], index: 0 });
    const b = state().openApp("viewer", { images: [{ name: "b" }], index: 0 });

    expect(a).not.toBe(b);
    expect(state().windows[a].data.images[0].name).toBe("a");
    expect(state().windows[b].data.images[0].name).toBe("b");
  });

  it("staggers windows so they do not open exactly on top of each other", () => {
    state().openApp("viewer");
    state().openApp("viewer");
    const [first, second] = Object.values(state().windows);
    expect(second.x).toBeGreaterThan(first.x);
    expect(second.y).toBeGreaterThan(first.y);
  });

  it("keeps a new window inside a small viewport", () => {
    window.innerWidth = 500;
    window.innerHeight = 400;
    state().openApp("skill");
    const win = state().windows.skill;
    expect(win.x).toBeGreaterThanOrEqual(0);
    expect(win.y).toBeGreaterThanOrEqual(0);
    expect(win.x + win.width).toBeLessThanOrEqual(500);
    expect(win.y + win.height).toBeLessThanOrEqual(400 - 40);
  });
});

describe("closing, focus and z-order", () => {
  it("closeWindow removes the window; closing one instance leaves the others", () => {
    const a = state().openApp("viewer");
    const b = state().openApp("viewer");
    state().closeWindow(a);
    expect(Object.keys(state().windows)).toEqual([b]);
  });

  it("closing an unknown id is harmless", () => {
    state().closeWindow("ghost");
    expect(state().windows).toEqual({});
  });

  it("focusWindow raises a window above the others", () => {
    state().openApp("skill");
    state().openApp("photos");
    state().focusWindow("skill");
    expect(state().windows.skill.zIndex).toBeGreaterThan(state().windows.photos.zIndex);
  });

  it("focusing the window that is already in front does not touch the store", () => {
    state().openApp("skill");
    const before = state().windows;
    state().focusWindow("skill");
    expect(state().windows).toBe(before);
  });

  it("re-numbers z-indexes before they can grow past the taskbar", () => {
    state().openApp("skill");
    state().openApp("photos");
    useWindowStore.setState({ nextZ: Z_LIMIT }); // simulate a very long session
    state().focusWindow("skill");

    const { windows, nextZ } = state();
    expect(nextZ).toBeLessThan(Z_LIMIT);
    expect(windows.skill.zIndex).toBeGreaterThan(windows.photos.zIndex);
    for (const win of Object.values(windows)) {
      expect(win.zIndex).toBeGreaterThanOrEqual(BASE_Z);
      expect(win.zIndex).toBeLessThan(Z_LIMIT);
    }
  });
});

describe("minimize / maximize", () => {
  it("minimizes and restores", () => {
    state().openApp("skill");
    state().minimizeWindow("skill");
    expect(state().windows.skill.isMinimized).toBe(true);
    state().restoreWindow("skill");
    expect(state().windows.skill.isMinimized).toBe(false);
  });

  it("a minimized window is ignored when working out which window is in front", () => {
    state().openApp("skill");
    state().openApp("photos");
    state().minimizeWindow("photos");
    expect(getTopVisibleZ(state().windows)).toBe(state().windows.skill.zIndex);
  });

  it("toggles maximize without changing the stored size", () => {
    state().openApp("skill");
    const { width, height } = state().windows.skill;
    state().toggleMaximize("skill");
    expect(state().windows.skill).toMatchObject({ isMaximized: true, width, height });
    state().toggleMaximize("skill");
    expect(state().windows.skill.isMaximized).toBe(false);
  });
});

describe("setBounds / updateWindowData", () => {
  it("stores position and size, rounded", () => {
    state().openApp("skill");
    state().setBounds("skill", { x: 10.4, y: 20.6, width: 700.2, height: 500 });
    expect(state().windows.skill).toMatchObject({ x: 10, y: 21, width: 700, height: 500 });
  });

  it("never lets a window get smaller than the app's minimum", () => {
    state().openApp("skill"); // min 440 x 360
    state().setBounds("skill", { width: 100, height: 100 });
    expect(state().windows.skill).toMatchObject({ width: 440, height: 360 });
  });

  it("merges into window data", () => {
    const id = state().openApp("viewer", { images: [1, 2, 3], index: 0 });
    state().updateWindowData(id, { index: 2 });
    expect(state().windows[id].data).toEqual({ images: [1, 2, 3], index: 2 });
  });
});

describe("toggleApp (dock click)", () => {
  it("closed -> opens", () => {
    state().toggleApp("skill");
    expect(state().windows.skill).toBeDefined();
  });

  it("open and in front -> minimizes", () => {
    state().toggleApp("skill");
    state().toggleApp("skill");
    expect(state().windows.skill.isMinimized).toBe(true);
  });

  it("minimized -> restores", () => {
    state().toggleApp("skill");
    state().toggleApp("skill");
    state().toggleApp("skill");
    expect(state().windows.skill.isMinimized).toBe(false);
  });

  it("open but behind another window -> comes to the front (not minimized)", () => {
    state().toggleApp("skill");
    state().toggleApp("photos");
    state().toggleApp("skill");
    expect(state().windows.skill.isMinimized).toBe(false);
    expect(state().windows.skill.zIndex).toBeGreaterThan(state().windows.photos.zIndex);
  });
});
