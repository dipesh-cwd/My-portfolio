import { describe, expect, it } from "vitest";
import { useUiStore } from "./uiStore.js";

const ui = () => useUiStore.getState();

describe("uiStore", () => {
  it("starts with everything closed", () => {
    expect(ui()).toMatchObject({ startOpen: false, panelOpen: false });
  });

  it("toggles the Start menu", () => {
    ui().toggleStart();
    expect(ui().startOpen).toBe(true);
    ui().toggleStart();
    expect(ui().startOpen).toBe(false);
  });

  it("opening the panel closes the Start menu, and the other way round", () => {
    ui().toggleStart();
    ui().togglePanel();
    expect(ui()).toMatchObject({ startOpen: false, panelOpen: true });

    ui().toggleStart();
    expect(ui()).toMatchObject({ startOpen: true, panelOpen: false });
  });

  it("closeMenus closes both", () => {
    ui().toggleStart();
    ui().closeMenus();
    expect(ui()).toMatchObject({ startOpen: false, panelOpen: false });
  });
});
