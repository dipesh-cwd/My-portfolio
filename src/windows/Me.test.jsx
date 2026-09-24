import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "../App.jsx";
import { me } from "../data/me.js";
import { profile } from "../data/profile.js";
import { timeline } from "../data/timeline.js";

afterEach(() => {
  me.photo = null;
});

const dock = (name) => screen.getAllByRole("button", { name }).find((b) => b.closest("#dock"));
const openMe = () => {
  render(<App />);
  fireEvent.click(dock("Me"));
  return screen.getByRole("dialog", { name: "Me" });
};

describe("Me window", () => {
  it("shows the about section with the bio text", () => {
    const win = openMe();
    expect(within(win).getByRole("heading", { name: "About Me" })).toBeTruthy();
    expect(within(win).getByText(me.bio)).toBeTruthy();
  });

  it("shows initials when no photo is configured", () => {
    const win = openMe();
    expect(within(win).queryByRole("img", { name: profile.name })).toBeNull();
    const initials = profile.name.slice(0, 2).toUpperCase();
    expect(within(win).getByText(initials)).toBeTruthy();
  });

  it("shows the photo instead of initials once one is configured", () => {
    me.photo = "image1.jpg";
    const win = openMe();
    const avatar = within(win).getByRole("img", { name: profile.name });
    expect(avatar.getAttribute("src")).toContain("image1.jpg");
  });

  it("lists every timeline entry in order, with its period and description", () => {
    const win = openMe();
    const headings = within(win)
      .getAllByRole("heading", { level: 4 })
      .map((h) => h.textContent);
    expect(headings).toEqual(timeline.map((entry) => entry.title));

    const first = timeline[0];
    expect(within(win).getAllByText(first.period).length).toBeGreaterThan(0);
    expect(within(win).getByText(first.description)).toBeTruthy();
  });

  it("opens a timeline photo in the image viewer, scoped to that entry's own photos", () => {
    const win = openMe();
    const school = timeline.find((entry) => entry.id === "school");
    const secondPhoto = school.photos[1];

    fireEvent.click(within(win).getByRole("button", { name: `Open ${secondPhoto.name}` }));
    const viewer = screen.getByRole("dialog", { name: secondPhoto.name });
    expect(within(viewer).getByText(`2 / ${school.photos.length}`)).toBeTruthy();

    // Next should wrap within this entry's 2 photos, not roll into another entry's photos.
    fireEvent.click(within(viewer).getByRole("button", { name: "Next image" }));
    expect(screen.getByRole("dialog", { name: school.photos[0].name })).toBeTruthy();
  });

  it("an entry with no photos renders fine without a photo strip", () => {
    const originalPhotos = timeline[0].photos;
    timeline[0].photos = [];
    try {
      const win = openMe();
      const expectedButtons = timeline
        .slice(1)
        .reduce((sum, entry) => sum + (entry.photos?.length ?? 0), 0);
      expect(within(win).queryAllByRole("button", { name: /^Open /i })).toHaveLength(
        expectedButtons
      );
    } finally {
      timeline[0].photos = originalPhotos;
    }
  });
});
