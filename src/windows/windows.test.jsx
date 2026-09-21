import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App.jsx";
import { archiveItems } from "../data/archive.js";
import { education } from "../data/education.js";
import { experience } from "../data/experience.js";
import { profile } from "../data/profile.js";
import { projects } from "../data/projects.js";
import { sendContact } from "../lib/contact.js";

// Keep the real validation, but never send anything.
vi.mock("../lib/contact.js", async (importOriginal) => ({
  ...(await importOriginal()),
  sendContact: vi.fn(),
}));

const openApp = (name) => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name }));
  return screen.getByRole("dialog", { name });
};

const hrefs = (win) =>
  within(win)
    .getAllByRole("link")
    .map((a) => a.getAttribute("href"));

describe("Portfolio (projects) window", () => {
  it("lists every project with tech tags", () => {
    const win = openApp("Portfolio");
    for (const project of projects) {
      expect(within(win).getByRole("heading", { name: project.title })).toBeTruthy();
    }
    expect(within(win).getAllByText("React").length).toBeGreaterThan(0);
  });

  it("links out to code and demos that exist, safely", () => {
    const win = openApp("Portfolio");
    const links = within(win).getAllByRole("link");
    const expected = projects.flatMap((p) => [p.github, p.live]).filter(Boolean);

    expect(links.map((a) => a.getAttribute("href"))).toEqual(expected);
    for (const link of links) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toContain("noopener");
    }
  });
});

describe("Education window", () => {
  it("shows every entry", () => {
    const win = openApp("Education");
    for (const item of education) {
      expect(within(win).getByRole("heading", { name: item.program })).toBeTruthy();
      expect(within(win).getByText(item.institution)).toBeTruthy();
    }
  });
});

describe("Archive window", () => {
  it("shows every archive item", () => {
    const win = openApp("Archive");
    for (const item of archiveItems) {
      expect(within(win).getByText(item.title, { exact: false })).toBeTruthy();
    }
  });
});

describe("CV window", () => {
  afterEach(() => {
    profile.cvFile = null;
  });

  it("shows profile, skills, experience and education", () => {
    const win = openApp("CV");
    expect(within(win).getByRole("heading", { name: profile.name })).toBeTruthy();
    expect(within(win).getByText("Frontend")).toBeTruthy();
    expect(within(win).getByText(experience[0].role, { exact: false })).toBeTruthy();
    expect(within(win).getByText(education[0].program)).toBeTruthy();
  });

  it("hides the download button until a CV file is configured", () => {
    const win = openApp("CV");
    expect(within(win).queryByRole("link", { name: /download cv/i })).toBeNull();
  });

  it("shows a download button pointing at the configured file", () => {
    profile.cvFile = "cv.pdf";
    const win = openApp("CV");
    const link = within(win).getByRole("link", { name: /download cv/i });
    expect(link.getAttribute("href")).toMatch(/cv\.pdf$/);
    expect(link.hasAttribute("download")).toBe(true);
  });
});

describe("Contact window", () => {
  beforeEach(() => {
    sendContact.mockReset();
  });

  const fill = (win, { name, email, message }) => {
    fireEvent.change(within(win).getByLabelText("Name"), { target: { value: name } });
    fireEvent.change(within(win).getByLabelText("Email"), { target: { value: email } });
    fireEvent.change(within(win).getByLabelText("Message"), { target: { value: message } });
  };
  const submit = (win) => fireEvent.click(within(win).getByRole("button", { name: /send/i }));

  it("shows the email and GitHub links, and hides LinkedIn while it is empty", () => {
    const win = openApp("Contact");
    expect(hrefs(win)).toContain(`mailto:${profile.email}`);
    expect(hrefs(win)).toContain(profile.github);
    expect(within(win).queryByText("LinkedIn")).toBeNull();
  });

  it("blocks an empty submit and shows a message for each field", () => {
    const win = openApp("Contact");
    submit(win);

    expect(within(win).getAllByRole("alert")).toHaveLength(3);
    expect(sendContact).not.toHaveBeenCalled();
  });

  it("sends a valid message, confirms it and clears the form", async () => {
    sendContact.mockResolvedValue({ mode: "api" });
    const win = openApp("Contact");
    fill(win, { name: "Sam", email: "sam@example.com", message: "Hello, nice portfolio!" });
    submit(win);

    await waitFor(() => expect(within(win).getByText(/your message was sent/i)).toBeTruthy());
    expect(sendContact).toHaveBeenCalledWith({
      name: "Sam",
      email: "sam@example.com",
      message: "Hello, nice portfolio!",
    });
    expect(within(win).getByLabelText("Name").value).toBe("");
    expect(within(win).queryAllByRole("alert")).toHaveLength(0);
  });

  it("explains the email-app fallback when there is no backend", async () => {
    sendContact.mockResolvedValue({ mode: "mailto" });
    const win = openApp("Contact");
    fill(win, { name: "Sam", email: "sam@example.com", message: "Hello, nice portfolio!" });
    submit(win);

    await waitFor(() => expect(within(win).getByText(/email app should open/i)).toBeTruthy());
  });

  it("keeps what was typed and shows an error when sending fails", async () => {
    sendContact.mockRejectedValue(new Error("boom"));
    const win = openApp("Contact");
    fill(win, { name: "Sam", email: "sam@example.com", message: "Hello, nice portfolio!" });
    submit(win);

    await waitFor(() => expect(within(win).getByText(/something went wrong/i)).toBeTruthy());
    expect(within(win).getByLabelText("Name").value).toBe("Sam");
  });
});
