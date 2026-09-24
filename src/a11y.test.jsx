import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App.jsx";
import { mockMatchMedia } from "./test/matchMedia.js";
import { axeViolations } from "./test/axe.js";
import { useWindowStore } from "./store/windowStore.js";

afterEach(() => vi.unstubAllGlobals());

describe("accessibility (axe-core)", () => {
  it("desktop: idle", async () => {
    render(<App />);
    expect(await axeViolations()).toEqual([]);
  });

  it("desktop: every window open, plus a viewer", async () => {
    render(<App />);
    act(() => {
      const { openApp } = useWindowStore.getState();
      for (const app of [
        "projects",
        "photos",
        "contact",
        "skill",
        "education",
        "cv",
        "archive",
        "me",
        "settings",
      ]) {
        openApp(app);
      }
      openApp("viewer", {
        images: [{ name: "a.jpg", src: "a.jpg", description: "A" }],
        index: 0,
      });
    });

    expect(await axeViolations()).toEqual([]);
  }, 10000);

  it("desktop: Start menu and quick panel open", async () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Start" }));
    expect(await axeViolations()).toEqual([]);

    fireEvent.click(screen.getByRole("button", { name: /expand panel/i }));
    expect(await axeViolations()).toEqual([]);
  });

  it("phone layout", async () => {
    mockMatchMedia(true);
    render(<App />);
    expect(await axeViolations()).toEqual([]);
  });
});
