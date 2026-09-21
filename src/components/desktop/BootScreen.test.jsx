import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "../../App.jsx";
import BootScreen from "./BootScreen.jsx";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

const advance = (ms) =>
  act(() => {
    vi.advanceTimersByTime(ms);
  });

describe("BootScreen", () => {
  it("shows, then fades, then removes itself", () => {
    render(<BootScreen />);
    const splash = screen.getByRole("status", { name: "Loading" });
    expect(splash.className).toContain("opacity-100");

    advance(1400);
    expect(screen.getByRole("status").className).toContain("opacity-0");

    advance(400);
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("only shows once per browser session", () => {
    const first = render(<BootScreen />);
    advance(2000);
    first.unmount();

    render(<BootScreen />);
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("is skipped for visitors who prefer reduced motion", () => {
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: true }));
    render(<BootScreen />);
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("still shows if session storage is blocked", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });

    render(<BootScreen />);
    expect(screen.getByRole("status")).toBeTruthy();
    vi.restoreAllMocks();
  });

  it("App only renders it when asked (boot prop)", () => {
    const { unmount } = render(<App />);
    expect(screen.queryByRole("status")).toBeNull();
    unmount();

    render(<App boot />);
    expect(screen.getByRole("status")).toBeTruthy();
  });
});
