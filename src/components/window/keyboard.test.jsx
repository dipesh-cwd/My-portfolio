import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../../App.jsx";
import { useWindowStore } from "../../store/windowStore.js";

const dock = (name) => screen.getAllByRole("button", { name }).find((b) => b.closest("#dock"));
const dialog = (name) => screen.getByRole("dialog", { name });
const windows = () => useWindowStore.getState().windows;

describe("window keyboard support", () => {
  it("moves focus into a newly opened window", () => {
    render(<App />);
    fireEvent.click(dock("Skill"));
    expect(document.activeElement).toBe(dialog(/TechStack/));
  });

  it("does not steal focus from content that takes it (image viewer arrows keep working)", () => {
    render(<App />);
    fireEvent.click(dock("Gallery"));
    fireEvent.click(within(dialog(/gallery/)).getByRole("button", { name: "Open image1.jpg" }));

    const viewer = dialog("image1.jpg");
    expect(document.activeElement).not.toBe(viewer);
    expect(viewer.contains(document.activeElement)).toBe(true);

    fireEvent.keyDown(document.activeElement, { key: "ArrowRight" });
    expect(dialog("image2.jpg")).toBeTruthy();
  });

  it("Escape closes the focused window", () => {
    render(<App />);
    fireEvent.click(dock("Skill"));
    fireEvent.keyDown(document.activeElement, { key: "Escape" });
    expect(windows()).toEqual({});
  });

  it("Escape closes only the window it happens in", () => {
    render(<App />);
    fireEvent.click(dock("Skill"));
    fireEvent.click(dock("Education"));
    fireEvent.keyDown(dialog("Education"), { key: "Escape" });
    expect(Object.keys(windows())).toEqual(["skill"]);
  });

  it("Escape while typing in a form does not close the window", () => {
    render(<App />);
    fireEvent.click(dock("Contact"));
    const win = dialog("Contact");

    for (const field of [
      within(win).getByLabelText("Name"),
      within(win).getByLabelText("Message"),
    ]) {
      fireEvent.keyDown(field, { key: "Escape" });
    }
    expect(windows().contact).toBeDefined();
  });

  it("Escape closes an open Start menu first and leaves the window alone", () => {
    render(<App />);
    fireEvent.click(dock("Skill"));
    fireEvent.click(screen.getByRole("button", { name: "Start" }));

    fireEvent.keyDown(dialog(/TechStack/), { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Start menu" })).toBeNull();
    expect(windows().skill).toBeDefined();
  });

  it("other keys do nothing", () => {
    render(<App />);
    fireEvent.click(dock("Skill"));
    fireEvent.keyDown(dialog(/TechStack/), { key: "Enter" });
    fireEvent.keyDown(dialog(/TechStack/), { key: "a" });
    expect(windows().skill).toBeDefined();
  });

  it("windows opened from the store (not the dock) also take focus", () => {
    render(<App />);
    act(() => {
      useWindowStore.getState().openApp("archive");
    });
    expect(document.activeElement).toBe(dialog("Archive"));
  });
});
