import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import App from "../App.jsx";
import { defaultPreferences, usePreferencesStore } from "../store/preferencesStore.js";
import { useWindowStore } from "../store/windowStore.js";

const dock = (name) => screen.getAllByRole("button", { name }).find((b) => b.closest("#dock"));
const openSettings = () => {
  render(<App />);
  fireEvent.click(dock("Settings"));
  return screen.getByRole("dialog", { name: "Settings" });
};

beforeEach(() => {
  localStorage.clear();
  usePreferencesStore.setState({ ...defaultPreferences });
});

describe("Settings window", () => {
  it("opens from the dock with every section", () => {
    const win = openSettings();
    expect(within(win).getByText("Language")).toBeTruthy();
    expect(within(win).getByText("Appearance")).toBeTruthy();
    expect(within(win).getByText("Welcome screen")).toBeTruthy();
    expect(within(win).getByText("Layout")).toBeTruthy();
  });

  it("changing the language relabels the dock and the Settings window itself, live", () => {
    const win = openSettings();
    fireEvent.click(within(win).getByRole("radio", { name: "Deutsch" }));

    expect(dock("Projekte")).toBeTruthy(); // dock relabeled
    expect(screen.getByRole("dialog", { name: "Einstellungen" })).toBeTruthy(); // window itself
    expect(within(win).getByText("Sprache")).toBeTruthy(); // and its own contents
  });

  it("switching to Nepali and back to English round-trips cleanly", () => {
    const win = openSettings();
    fireEvent.click(within(win).getByRole("radio", { name: "नेपाली" }));
    expect(dock("प्रोजेक्टहरू")).toBeTruthy();

    fireEvent.click(within(win).getByRole("radio", { name: "English" }));
    expect(dock("Projects")).toBeTruthy();
  });

  it("marks the active language and theme with aria-checked", () => {
    const win = openSettings();
    expect(within(win).getByRole("radio", { name: "English" }).getAttribute("aria-checked")).toBe(
      "true"
    );
    expect(within(win).getByRole("radio", { name: "Dark" }).getAttribute("aria-checked")).toBe(
      "true"
    );
  });

  it("switching theme updates the <html data-theme> attribute", () => {
    const win = openSettings();
    expect(document.documentElement.dataset.theme).toBe("dark");

    fireEvent.click(within(win).getByRole("radio", { name: "Light" }));
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(usePreferencesStore.getState().theme).toBe("light");
  });

  it("persists language and theme choices to localStorage", () => {
    const win = openSettings();
    fireEvent.click(within(win).getByRole("radio", { name: "Light" }));
    fireEvent.click(within(win).getByRole("radio", { name: "Deutsch" }));

    const saved = JSON.parse(localStorage.getItem("portfolio:preferences"));
    expect(saved).toMatchObject({ theme: "light", language: "de" });
  });

  it("toggling 'Show welcome screen' off hides the welcome screen", () => {
    const win = openSettings();
    // The greeting is split into one <span> per letter (using \u00A0 for spaces), so match a
    // single word from it rather than a phrase with spaces.
    expect(document.body.textContent).toContain("Hi,");

    fireEvent.click(within(win).getByRole("switch", { name: "Show welcome screen" }));
    expect(usePreferencesStore.getState().welcomeVisible).toBe(false);
    expect(document.body.textContent).not.toContain("Hi,");
  });

  it("'Animate the title' is on by default and can be turned off", () => {
    const win = openSettings();
    const toggle = within(win).getByRole("switch", { name: "Animate the title" });
    expect(toggle.checked).toBe(true);

    fireEvent.click(toggle);
    expect(usePreferencesStore.getState().welcomeAnimation).toBe(false);
  });

  it("'Close all open windows' closes other windows but leaves Settings open", () => {
    render(<App />);
    fireEvent.click(dock("Skill"));
    fireEvent.click(dock("Gallery"));
    fireEvent.click(dock("Settings"));

    const win = screen.getByRole("dialog", { name: "Settings" });
    fireEvent.click(within(win).getByRole("button", { name: "Close all open windows" }));

    expect(Object.keys(useWindowStore.getState().windows)).toEqual(["settings"]);
  });

  it("'Reset settings to default' restores every preference", () => {
    const win = openSettings();
    fireEvent.click(within(win).getByRole("radio", { name: "Light" }));
    fireEvent.click(within(win).getByRole("radio", { name: "Deutsch" }));
    fireEvent.click(screen.getByRole("button", { name: "Einstellungen zurücksetzen" }));

    expect(usePreferencesStore.getState()).toMatchObject(defaultPreferences);
  });

  it("an app with no content yet (Me) still opens as a placeholder", () => {
    render(<App />);
    fireEvent.click(dock("Me"));
    const win = screen.getByRole("dialog", { name: "Me" });
    expect(within(win).getByText(/under construction/i)).toBeTruthy();
  });
});
