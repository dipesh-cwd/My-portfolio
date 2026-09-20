import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";
import { createInitialState, useWindowStore } from "../store/windowStore.js";

// jsdom doesn't implement PointerEvent. Provide a minimal one so drag/resize can be tested.
if (typeof window.PointerEvent === "undefined") {
  window.PointerEvent = class PointerEvent extends MouseEvent {
    constructor(type, init = {}) {
      super(type, init);
      this.pointerId = init.pointerId ?? 1;
      this.pointerType = init.pointerType ?? "mouse";
    }
  };
}

// jsdom has no layout engine; give it a stable "desktop" size so window placement is predictable.
beforeEach(() => {
  window.innerWidth = 1280;
  window.innerHeight = 800;
  useWindowStore.setState(createInitialState());
});

afterEach(() => {
  cleanup();
});
