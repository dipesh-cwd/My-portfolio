import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App.jsx";
import { APPS } from "./config/apps.js";
import { useWindowStore } from "./store/windowStore.js";

const SKILL = "C:\\Users\\dipesh\\TechStack";
const GALLERY = "C:\\Users\\dipesh\\gallery";

const dockButton = (name) => screen.getByRole("button", { name });
const dialog = (name) => screen.getByRole("dialog", { name });
const queryDialog = (name) => screen.queryByRole("dialog", { name });

describe("desktop", () => {
  it("renders the welcome screen and the dock with every app", () => {
    render(<App />);
    // The greeting is split into one <span> per letter, so check the combined text.
    expect(document.body.textContent).toContain("Welcome");
    for (const name of [
      "Projects",
      "Gallery",
      "Contact",
      "Skill",
      "Education",
      "CV",
      "Archive",
      "Me",
      "Settings",
    ]) {
      expect(dockButton(name)).toBeTruthy();
    }
    expect(screen.queryAllByRole("dialog")).toHaveLength(0);
  });

  it("opens a window from the dock and closes it with the close button", () => {
    render(<App />);
    fireEvent.click(dockButton("Skill"));
    const win = dialog(SKILL);
    expect(within(win).getByText("Frontend")).toBeTruthy(); // tech stack rendered

    fireEvent.click(within(win).getByRole("button", { name: "Close" }));
    expect(queryDialog(SKILL)).toBeNull();
  });

  it("minimizes on a second dock click and restores on a third", () => {
    render(<App />);
    fireEvent.click(dockButton("Skill"));
    fireEvent.click(dockButton("Skill"));
    expect(queryDialog(SKILL)).toBeNull(); // hidden

    fireEvent.click(dockButton("Skill"));
    expect(dialog(SKILL)).toBeTruthy();
  });

  it("an app with no registered component opens the placeholder instead of crashing", () => {
    APPS.mystery = { title: "Mystery", width: 400, height: 300 };
    try {
      render(<App />);
      act(() => {
        useWindowStore.getState().openApp("mystery");
      });
      expect(within(dialog("Mystery")).getByText(/under construction/i)).toBeTruthy();
    } finally {
      delete APPS.mystery;
    }
  });

  it("maximizes on title bar double-click", () => {
    render(<App />);
    fireEvent.click(dockButton("Skill"));
    const titleBar = dialog(SKILL).querySelector("[data-drag-handle]");

    fireEvent.doubleClick(titleBar);
    expect(useWindowStore.getState().windows.skill.isMaximized).toBe(true);
    expect(within(dialog(SKILL)).getByRole("button", { name: "Restore" })).toBeTruthy();
  });

  it("shows an indicator under dock icons whose window is open", () => {
    const { container } = render(<App />);
    const indicators = () => container.querySelectorAll("#dock span[aria-hidden]").length;

    expect(indicators()).toBe(0);
    fireEvent.click(dockButton("Skill"));
    expect(indicators()).toBe(1);
    fireEvent.click(dockButton("Gallery"));
    expect(indicators()).toBe(2);
  });
});

describe("gallery and image viewer", () => {
  const openGallery = () => {
    render(<App />);
    fireEvent.click(dockButton("Gallery"));
    return dialog(GALLERY);
  };

  it("opens the clicked image in a viewer window titled with the file name", () => {
    const gallery = openGallery();
    fireEvent.click(within(gallery).getByRole("button", { name: "Open image3.jpg" }));

    const viewer = dialog("image3.jpg");
    const img = within(viewer).getByRole("img");
    expect(img.getAttribute("src")).toContain("image3.jpg");
    expect(within(viewer).getByText("3 / 10")).toBeTruthy();
  });

  it("opens each clicked image in its own window", () => {
    const gallery = openGallery();
    fireEvent.click(within(gallery).getByRole("button", { name: "Open image1.jpg" }));
    fireEvent.click(within(gallery).getByRole("button", { name: "Open image2.jpg" }));

    expect(dialog("image1.jpg")).toBeTruthy();
    expect(dialog("image2.jpg")).toBeTruthy();
  });

  it("navigates with the buttons and the arrow keys, wrapping around", () => {
    const gallery = openGallery();
    fireEvent.click(within(gallery).getByRole("button", { name: "Open image10.jpg" }));

    let viewer = dialog("image10.jpg");
    fireEvent.click(within(viewer).getByRole("button", { name: "Next image" }));
    viewer = dialog("image1.jpg"); // wrapped, and the window title followed
    expect(within(viewer).getByText("1 / 10")).toBeTruthy();

    const focusTarget = viewer.querySelector("[tabindex='0']");
    fireEvent.keyDown(focusTarget, { key: "ArrowLeft" });
    expect(dialog("image10.jpg")).toBeTruthy();
  });

  it("closing one viewer leaves the gallery and other viewers open", () => {
    const gallery = openGallery();
    fireEvent.click(within(gallery).getByRole("button", { name: "Open image1.jpg" }));
    fireEvent.click(within(gallery).getByRole("button", { name: "Open image2.jpg" }));

    fireEvent.click(within(dialog("image1.jpg")).getByRole("button", { name: "Close" }));

    expect(queryDialog("image1.jpg")).toBeNull();
    expect(dialog("image2.jpg")).toBeTruthy();
    expect(dialog(GALLERY)).toBeTruthy();
  });
});

describe("dragging and resizing", () => {
  it("dragging the title bar moves the window and commits the position on release", () => {
    render(<App />);
    fireEvent.click(dockButton("Skill"));
    const win = dialog(SKILL);
    const { x, y } = useWindowStore.getState().windows.skill;

    fireEvent.pointerDown(win.querySelector("[data-drag-handle]"), {
      clientX: 500,
      clientY: 300,
      button: 0,
    });
    fireEvent.pointerMove(window, { clientX: 560, clientY: 340 });
    // While dragging only the DOM changes; the store is written once on release.
    expect(win.style.left).toBe(`${x + 60}px`);
    expect(useWindowStore.getState().windows.skill.x).toBe(x);

    fireEvent.pointerUp(window);
    expect(useWindowStore.getState().windows.skill).toMatchObject({ x: x + 60, y: y + 40 });
  });

  it("does not start a drag from the window control buttons", () => {
    render(<App />);
    fireEvent.click(dockButton("Skill"));
    const win = dialog(SKILL);
    const { x } = useWindowStore.getState().windows.skill;

    fireEvent.pointerDown(within(win).getByRole("button", { name: "Minimize" }), {
      clientX: 500,
      clientY: 300,
      button: 0,
    });
    fireEvent.pointerMove(window, { clientX: 700, clientY: 300 });
    fireEvent.pointerUp(window);

    expect(useWindowStore.getState().windows.skill.x).toBe(x);
  });

  it("resizing from the bottom-right corner grows the window", () => {
    render(<App />);
    fireEvent.click(dockButton("Skill"));
    const win = dialog(SKILL);
    const { width, height } = useWindowStore.getState().windows.skill;

    fireEvent.pointerDown(win.querySelector("[data-resize-dir='bottom-right']"), {
      clientX: 800,
      clientY: 600,
      button: 0,
    });
    fireEvent.pointerMove(window, { clientX: 850, clientY: 640 });
    fireEvent.pointerUp(window);

    expect(useWindowStore.getState().windows.skill).toMatchObject({
      width: width + 50,
      height: height + 40,
    });
  });

  it("clicking a window brings it to the front", () => {
    render(<App />);
    fireEvent.click(dockButton("Skill"));
    fireEvent.click(dockButton("Gallery"));
    const { windows } = useWindowStore.getState();
    expect(windows.photos.zIndex).toBeGreaterThan(windows.skill.zIndex);

    fireEvent.pointerDown(dialog(SKILL), { button: 0 });
    const after = useWindowStore.getState().windows;
    expect(after.skill.zIndex).toBeGreaterThan(after.photos.zIndex);
  });
});
