import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../../App.jsx";
import { galleryImages } from "../../data/gallery.js";
import { profile } from "../../data/profile.js";
import { projects } from "../../data/projects.js";
import { mockMatchMedia } from "../../test/matchMedia.js";

afterEach(() => {
  vi.unstubAllGlobals();
  profile.cvFile = null;
});

describe("phone layout", () => {
  it("shows a single page with the profile as the only h1, and no desktop UI", () => {
    mockMatchMedia(true);
    const { container } = render(<App />);

    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0].textContent).toBe(profile.name);

    expect(container.querySelector("#dock")).toBeNull();
    expect(screen.queryByRole("button", { name: "Start" })).toBeNull();
    expect(screen.queryAllByRole("dialog")).toHaveLength(0);
  });

  it("has a section nav whose links all point at real sections", () => {
    mockMatchMedia(true);
    const { container } = render(<App />);

    const links = within(screen.getByRole("navigation", { name: "Sections" })).getAllByRole("link");
    expect(links.map((a) => a.getAttribute("href"))).toEqual([
      "#projects",
      "#cv",
      "#gallery",
      "#archive",
      "#contact",
    ]);
    for (const link of links) {
      expect(container.querySelector(link.getAttribute("href"))).not.toBeNull();
    }
  });

  it("renders the real content: projects, CV, gallery, archive and the contact form", () => {
    mockMatchMedia(true);
    render(<App />);

    for (const project of projects) {
      // section titles are h2, card titles h3
      expect(screen.getByRole("heading", { name: project.title, level: 3 })).toBeTruthy();
    }
    expect(screen.getByRole("heading", { name: "Projects", level: 2 })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Skills" })).toBeTruthy();
    expect(screen.getByRole("button", { name: /send message/i })).toBeTruthy();
    expect(screen.getAllByRole("img")).toHaveLength(galleryImages.length);
  });

  it("gallery photos open full size in a new tab", () => {
    mockMatchMedia(true);
    render(<App />);
    const link = screen.getByRole("link", { name: "Open image1.jpg full size" });
    expect(link.getAttribute("href")).toContain("image1.jpg");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });

  it("shows the CV download link only when a CV file is configured", () => {
    mockMatchMedia(true);
    const first = render(<App />);
    expect(screen.queryAllByRole("link", { name: /download cv/i })).toHaveLength(0);
    first.unmount();

    profile.cvFile = "cv.pdf";
    render(<App />);
    expect(screen.getAllByRole("link", { name: /download cv/i }).length).toBeGreaterThan(0);
  });

  it("switches between layouts live when the viewport crosses the breakpoint", () => {
    const media = mockMatchMedia(false);
    render(<App />);
    expect(screen.getByRole("button", { name: "Start" })).toBeTruthy();

    act(() => media.set(true));
    expect(screen.queryByRole("button", { name: "Start" })).toBeNull();
    expect(screen.getByRole("navigation", { name: "Sections" })).toBeTruthy();

    act(() => media.set(false));
    expect(screen.getByRole("button", { name: "Start" })).toBeTruthy();
    expect(screen.queryByRole("navigation", { name: "Sections" })).toBeNull();
  });

  it("the contact form works on the phone layout too", () => {
    mockMatchMedia(true);
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    expect(screen.getAllByRole("alert")).toHaveLength(3);
  });
});

describe("desktop layout is unchanged", () => {
  it("has no section nav", () => {
    render(<App />);
    expect(screen.queryByRole("navigation", { name: "Sections" })).toBeNull();
  });
});
