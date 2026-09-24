import { Check } from "lucide-react";
import { useTranslation } from "../i18n/index.js";
import { LANGUAGES, THEMES, usePreferencesStore } from "../store/preferencesStore.js";
import { useWindowStore } from "../store/windowStore.js";
import { Heading, WindowPage } from "./ui.jsx";

/** Native-language label for each supported language, shown in its own script. */
const LANGUAGE_LABELS = { en: "English", np: "नेपाली", de: "Deutsch" };

const SectionTitle = ({ children }) => (
  <Heading
    rel={1}
    className="mb-2 text-sm font-semibold tracking-wide text-[var(--accent-text)] uppercase"
  >
    {children}
  </Heading>
);

const Row = ({ label, hint, children }) => (
  <div className="flex items-center justify-between gap-4 py-2.5">
    <div className="min-w-0">
      <p className="text-sm text-[var(--content-text)]">{label}</p>
      {hint && <p className="mt-0.5 text-xs text-[var(--muted-text)]">{hint}</p>}
    </div>
    {children}
  </div>
);

/** Accessible on/off switch (a checkbox styled as a toggle, not a bespoke widget). */
const Switch = ({ checked, onChange, label }) => (
  <label className="relative inline-flex shrink-0 cursor-pointer items-center">
    <input
      type="checkbox"
      role="switch"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      aria-label={label}
      className="peer sr-only"
    />
    <span
      aria-hidden="true"
      className="h-6 w-11 rounded-full bg-gray-500/40 transition-colors peer-checked:bg-blue-500 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-400"
    />
    <span
      aria-hidden="true"
      className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5"
    />
  </label>
);

const Settings = () => {
  const t = useTranslation();
  const language = usePreferencesStore((s) => s.language);
  const theme = usePreferencesStore((s) => s.theme);
  const welcomeAnimation = usePreferencesStore((s) => s.welcomeAnimation);
  const welcomeVisible = usePreferencesStore((s) => s.welcomeVisible);
  const setLanguage = usePreferencesStore((s) => s.setLanguage);
  const setTheme = usePreferencesStore((s) => s.setTheme);
  const setWelcomeAnimation = usePreferencesStore((s) => s.setWelcomeAnimation);
  const setWelcomeVisible = usePreferencesStore((s) => s.setWelcomeVisible);
  const resetPreferences = usePreferencesStore((s) => s.resetPreferences);

  const closeAllWindows = () => {
    // Close every other open window, leaving this Settings window open (so the button doesn't
    // close the window you're using it from).
    const { windows, closeWindow } = useWindowStore.getState();
    for (const id of Object.keys(windows)) {
      if (id !== "settings") closeWindow(id);
    }
  };

  return (
    <WindowPage title={t("apps.settings")} subtitle={t("settings.subtitle")}>
      <div className="max-w-lg divide-y divide-[var(--card-border)]">
        <section className="pb-4">
          <SectionTitle>{t("settings.language")}</SectionTitle>
          <div
            role="radiogroup"
            aria-label={t("settings.language")}
            className="flex flex-wrap gap-2"
          >
            {LANGUAGES.map((code) => {
              const active = language === code;
              return (
                <button
                  key={code}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setLanguage(code)}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors ${
                    active
                      ? "border-blue-500 bg-blue-500/15 text-[var(--accent-text)]"
                      : "border-[var(--card-border)] text-[var(--content-text)] hover:bg-black/5"
                  }`}
                >
                  {active && <Check size={14} aria-hidden="true" />}
                  {LANGUAGE_LABELS[code]}
                </button>
              );
            })}
          </div>
        </section>

        <section className="py-4">
          <SectionTitle>{t("settings.appearance")}</SectionTitle>
          <div role="radiogroup" aria-label={t("settings.appearance")} className="flex gap-2">
            {THEMES.map((mode) => {
              const active = theme === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setTheme(mode)}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors ${
                    active
                      ? "border-blue-500 bg-blue-500/15 text-[var(--accent-text)]"
                      : "border-[var(--card-border)] text-[var(--content-text)] hover:bg-black/5"
                  }`}
                >
                  {active && <Check size={14} aria-hidden="true" />}
                  {mode === "dark" ? t("settings.dark") : t("settings.light")}
                </button>
              );
            })}
          </div>
        </section>

        <section className="py-4">
          <SectionTitle>{t("settings.welcomeScreen")}</SectionTitle>
          <Row label={t("settings.showWelcome")} hint={t("settings.showWelcomeHint")}>
            <Switch
              checked={welcomeVisible}
              onChange={setWelcomeVisible}
              label={t("settings.showWelcome")}
            />
          </Row>
          <Row label={t("settings.animateTitle")} hint={t("settings.animateTitleHint")}>
            <Switch
              checked={welcomeAnimation}
              onChange={setWelcomeAnimation}
              label={t("settings.animateTitle")}
            />
          </Row>
        </section>

        <section className="py-4">
          <SectionTitle>{t("settings.layout")}</SectionTitle>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={closeAllWindows}
              className="cursor-pointer rounded-md border border-[var(--card-border)] px-3 py-1.5 text-sm text-[var(--content-text)] hover:bg-black/5"
            >
              {t("settings.closeAllWindows")}
            </button>
            <button
              type="button"
              onClick={resetPreferences}
              className="cursor-pointer rounded-md border border-[var(--card-border)] px-3 py-1.5 text-sm text-[var(--content-text)] hover:bg-black/5"
            >
              {t("settings.resetPreferences")}
            </button>
          </div>
        </section>

        <section className="pt-4">
          <SectionTitle>{t("settings.about")}</SectionTitle>
          <p className="text-sm text-[var(--muted-text)]">Dipesh's Portfolio</p>
        </section>
      </div>
    </WindowPage>
  );
};

export default Settings;
