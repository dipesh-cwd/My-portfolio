import { create } from "zustand";

/**
 * User-facing preferences, changed from the Settings app: language, theme, and the welcome
 * screen's motion/visibility. Persisted to localStorage so they survive a reload.
 */
export const LANGUAGES = ["en", "np", "de"];
export const THEMES = ["dark", "light"];

const STORAGE_KEY = "portfolio:preferences";

export const defaultPreferences = {
  language: "en",
  theme: "dark",
  welcomeAnimation: true,
  welcomeVisible: true,
};

const readStored = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return {
      ...(LANGUAGES.includes(parsed.language) && { language: parsed.language }),
      ...(THEMES.includes(parsed.theme) && { theme: parsed.theme }),
      ...(typeof parsed.welcomeAnimation === "boolean" && {
        welcomeAnimation: parsed.welcomeAnimation,
      }),
      ...(typeof parsed.welcomeVisible === "boolean" && { welcomeVisible: parsed.welcomeVisible }),
    };
  } catch {
    return {}; // corrupt or blocked storage: fall back to defaults
  }
};

const persist = (state) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        language: state.language,
        theme: state.theme,
        welcomeAnimation: state.welcomeAnimation,
        welcomeVisible: state.welcomeVisible,
      })
    );
  } catch {
    // storage full or blocked: preference still applies for this session
  }
};

export const usePreferencesStore = create((set) => ({
  ...defaultPreferences,
  ...readStored(),

  setLanguage: (language) =>
    set((state) => {
      if (!LANGUAGES.includes(language)) return state;
      const next = { ...state, language };
      persist(next);
      return next;
    }),

  setTheme: (theme) =>
    set((state) => {
      if (!THEMES.includes(theme)) return state;
      const next = { ...state, theme };
      persist(next);
      return next;
    }),

  setWelcomeAnimation: (welcomeAnimation) =>
    set((state) => {
      const next = { ...state, welcomeAnimation };
      persist(next);
      return next;
    }),

  setWelcomeVisible: (welcomeVisible) =>
    set((state) => {
      const next = { ...state, welcomeVisible };
      persist(next);
      return next;
    }),

  resetPreferences: () =>
    set(() => {
      persist(defaultPreferences);
      return { ...defaultPreferences };
    }),
}));
