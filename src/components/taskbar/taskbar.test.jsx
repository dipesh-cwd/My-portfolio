import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../../App.jsx";
import { useWindowStore } from "../../store/windowStore.js";

const ALL_APPS = [
  "Projects",
  "Gallery",
  "Contact",
  "Skill",
  "Education",
  "CV",
  "Archive",
  "Me",
  "Settings",
];

const startButton = () => screen.getByRole("button", { name: "Start" });
const startMenu = () => screen.queryByRole("dialog", { name: "Start menu" });
const openStart = () => fireEvent.click(startButton());
const dockButton = (name) =>
  screen.getAllByRole("button", { name }).find((b) => b.closest("#dock"));
const chevron = () => screen.getByRole("button", { name: /expand panel|collapse panel/i });
const openPanel = () => fireEvent.click(chevron());
const windows = () => useWindowStore.getState().windows;

describe("Start menu", () => {
  it("opens from the Start button, focuses the search box and lists every app", () => {
    render(<App />);
    expect(startMenu()).toBeNull();

    openStart();
    const menu = startMenu();
    expect(menu).toBeTruthy();
    expect(document.activeElement).toBe(within(menu).getByRole("searchbox"));
    for (const name of ALL_APPS) {
      expect(within(menu).getByRole("button", { name })).toBeTruthy();
    }
    expect(startButton().getAttribute("aria-expanded")).toBe("true");
  });

  it("filters apps as you type (case-insensitive)", () => {
    render(<App />);
    openStart();
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "  CONT " } });

    const menu = startMenu();
    expect(within(menu).getByRole("button", { name: "Contact" })).toBeTruthy();
    expect(within(menu).queryByRole("button", { name: "Gallery" })).toBeNull();
  });

  it("says so when nothing matches", () => {
    render(<App />);
    openStart();
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "zzz" } });
    expect(within(startMenu()).getByText(/no apps found/i)).toBeTruthy();
  });

  it("launches the app you click and closes itself", () => {
    render(<App />);
    openStart();
    fireEvent.click(within(startMenu()).getByRole("button", { name: "Education" }));

    expect(windows().education).toBeDefined();
    expect(startMenu()).toBeNull();
  });

  it("Enter launches the first match", () => {
    render(<App />);
    openStart();
    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "arch" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(Object.keys(windows())).toEqual(["archive"]);
    expect(startMenu()).toBeNull();
  });

  it("Enter with no match does nothing", () => {
    render(<App />);
    openStart();
    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "zzz" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(windows()).toEqual({});
    expect(startMenu()).toBeTruthy();
  });

  it("launching an app that is already open restores it instead of minimizing it", () => {
    render(<App />);
    fireEvent.click(dockButton("Skill"));
    fireEvent.click(dockButton("Skill")); // minimized
    expect(windows().skill.isMinimized).toBe(true);

    openStart();
    fireEvent.click(within(startMenu()).getByRole("button", { name: "Skill" }));
    expect(windows().skill.isMinimized).toBe(false);
  });

  it("Escape closes it and returns focus to the Start button", () => {
    render(<App />);
    openStart();
    fireEvent.keyDown(document.body, { key: "Escape" });

    expect(startMenu()).toBeNull();
    expect(document.activeElement).toBe(startButton());
  });

  it("closes when you press outside, but not inside, the menu", () => {
    render(<App />);
    openStart();

    fireEvent.pointerDown(within(startMenu()).getByRole("searchbox"));
    expect(startMenu()).toBeTruthy();

    fireEvent.pointerDown(document.body);
    expect(startMenu()).toBeNull();
  });

  it("the Start button toggles it closed again", () => {
    render(<App />);
    openStart();
    fireEvent.pointerDown(startButton()); // counts as "inside" so it isn't double-handled
    fireEvent.click(startButton());
    expect(startMenu()).toBeNull();
  });

  it("starts with an empty search each time it opens", () => {
    render(<App />);
    openStart();
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "gal" } });
    fireEvent.click(startButton());
    openStart();
    expect(screen.getByRole("searchbox").value).toBe("");
  });
});

describe("Quick panel (window switcher)", () => {
  it("is collapsed at first: content is inert but the toggle stays usable", () => {
    render(<App />);
    const heading = screen.getByRole("heading", { name: "Open windows", hidden: true });
    expect(heading.closest("[inert]")).not.toBeNull();
    expect(chevron().closest("[inert]")).toBeNull();

    openPanel();
    expect(heading.closest("[inert]")).toBeNull();
    expect(chevron().getAttribute("aria-expanded")).toBe("true");
  });

  it("shows an empty state when no windows are open", () => {
    render(<App />);
    openPanel();
    expect(screen.getByText(/no windows open/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: "Close all" }).disabled).toBe(true);
    expect(screen.getByRole("button", { name: "Show desktop" }).disabled).toBe(true);
  });

  it("lists every open window, including viewer titles", () => {
    render(<App />);
    act(() => {
      useWindowStore.getState().openApp("skill");
      useWindowStore.getState().openApp("viewer", {
        images: [{ name: "sunset.jpg", src: "sunset.jpg" }],
        index: 0,
      });
    });
    openPanel();

    expect(screen.getByRole("button", { name: /^C:.*TechStack/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /^sunset\.jpg/ })).toBeTruthy();
  });

  it("clicking a minimized window restores it and collapses the panel", () => {
    render(<App />);
    fireEvent.click(dockButton("Skill"));
    fireEvent.click(dockButton("Skill")); // minimize
    openPanel();

    const row = screen.getByRole("button", { name: /^C:.*TechStack/ });
    expect(within(row).getByText("minimized")).toBeTruthy();
    fireEvent.click(row);

    expect(windows().skill.isMinimized).toBe(false);
    expect(chevron().getAttribute("aria-expanded")).toBe("false");
  });

  it("clicking a window that is behind another brings it to the front", () => {
    render(<App />);
    fireEvent.click(dockButton("Skill"));
    fireEvent.click(dockButton("Gallery"));
    openPanel();
    fireEvent.click(screen.getByRole("button", { name: /^C:.*TechStack/ }));

    expect(windows().skill.zIndex).toBeGreaterThan(windows().photos.zIndex);
  });

  it("the X on a row closes just that window", () => {
    render(<App />);
    fireEvent.click(dockButton("Skill"));
    fireEvent.click(dockButton("Gallery"));
    openPanel();
    fireEvent.click(screen.getByRole("button", { name: /^Close C:.*TechStack/ }));

    expect(Object.keys(windows())).toEqual(["photos"]);
  });

  it("Show desktop minimizes everything and then disables itself", () => {
    render(<App />);
    fireEvent.click(dockButton("Skill"));
    fireEvent.click(dockButton("Gallery"));
    openPanel();
    fireEvent.click(screen.getByRole("button", { name: "Show desktop" }));

    expect(Object.values(windows()).every((w) => w.isMinimized)).toBe(true);
    expect(chevron().getAttribute("aria-expanded")).toBe("false");

    openPanel();
    expect(screen.getByRole("button", { name: "Show desktop" }).disabled).toBe(true);
  });

  it("Close all closes everything", () => {
    render(<App />);
    fireEvent.click(dockButton("Skill"));
    fireEvent.click(dockButton("Gallery"));
    openPanel();
    fireEvent.click(screen.getByRole("button", { name: "Close all" }));

    expect(windows()).toEqual({});
  });

  it("opening the panel closes the Start menu and vice versa", () => {
    render(<App />);
    openStart();
    openPanel();
    expect(startMenu()).toBeNull();

    openStart();
    expect(chevron().getAttribute("aria-expanded")).toBe("false");
  });

  it("Escape and pressing outside collapse the panel", () => {
    render(<App />);
    openPanel();
    fireEvent.keyDown(document.body, { key: "Escape" });
    expect(chevron().getAttribute("aria-expanded")).toBe("false");

    openPanel();
    fireEvent.pointerDown(document.body);
    expect(chevron().getAttribute("aria-expanded")).toBe("false");
  });

  it("pressing inside the panel does not collapse it", () => {
    render(<App />);
    openPanel();
    fireEvent.pointerDown(screen.getByRole("heading", { name: "Open windows" }));
    expect(chevron().getAttribute("aria-expanded")).toBe("true");
  });
});
