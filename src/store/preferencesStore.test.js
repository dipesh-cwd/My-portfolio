import { beforeEach, describe, expect, it, vi } from "vitest";
import { defaultPreferences, usePreferencesStore } from "./preferencesStore.js";

const store = () => usePreferencesStore.getState();

beforeEach(() => {
  localStorage.clear();
  usePreferencesStore.setState({ ...defaultPreferences });
});

describe("preferencesStore", () => {
  it("starts with the defaults", () => {
    expect(store()).toMatchObject(defaultPreferences);
  });

  it("setLanguage updates state and persists it", () => {
    store().setLanguage("de");
    expect(store().language).toBe("de");
    expect(JSON.parse(localStorage.getItem("portfolio:preferences")).language).toBe("de");
  });

  it("ignores an unknown language or theme", () => {
    store().setLanguage("fr");
    expect(store().language).toBe("en");
    store().setTheme("blue");
    expect(store().theme).toBe("dark");
  });

  it("setTheme, setWelcomeAnimation and setWelcomeVisible all persist", () => {
    store().setTheme("light");
    store().setWelcomeAnimation(false);
    store().setWelcomeVisible(false);

    const saved = JSON.parse(localStorage.getItem("portfolio:preferences"));
    expect(saved).toEqual({
      language: "en",
      theme: "light",
      welcomeAnimation: false,
      welcomeVisible: false,
    });
  });

  it("resetPreferences restores every default and persists it", () => {
    store().setLanguage("np");
    store().setTheme("light");
    store().resetPreferences();
    expect(store()).toMatchObject(defaultPreferences);
    expect(JSON.parse(localStorage.getItem("portfolio:preferences"))).toEqual(defaultPreferences);
  });

  it("a freshly loaded module picks up a value saved in an earlier session", async () => {
    localStorage.setItem(
      "portfolio:preferences",
      JSON.stringify({
        language: "de",
        theme: "light",
        welcomeAnimation: false,
        welcomeVisible: true,
      })
    );

    vi.resetModules();
    const fresh = await import("./preferencesStore.js");
    expect(fresh.usePreferencesStore.getState()).toMatchObject({
      language: "de",
      theme: "light",
      welcomeAnimation: false,
    });
  });

  it("ignores corrupt JSON in storage without throwing", () => {
    localStorage.setItem("portfolio:preferences", "{not json");
    expect(() => usePreferencesStore.getState()).not.toThrow();
  });
});
