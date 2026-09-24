import { useCallback } from "react";
import { usePreferencesStore } from "../store/preferencesStore.js";
import { DEFAULT_LOCALE, translations } from "./translations.js";

const getPath = (dict, key) => key.split(".").reduce((node, part) => node?.[part], dict);

const interpolate = (template, vars) =>
  vars ? template.replace(/\{(\w+)\}/g, (match, name) => vars[name] ?? match) : template;

/**
 * const t = useTranslation();
 * t("apps.projects")                     -> "Projects" (or "Projekte", "प्रोजेक्टहरू", ...)
 * t("panel.closeWindow", { title: x })   -> "Close x" with {title} substituted
 *
 * Falls back to English for any key missing in the current language, so a partial
 * translation never shows a raw key to the visitor.
 */
export function useTranslation() {
  const language = usePreferencesStore((s) => s.language);

  return useCallback(
    (key, vars) => {
      const value =
        getPath(translations[language], key) ?? getPath(translations[DEFAULT_LOCALE], key);
      if (value === undefined) return key; // missing everywhere: still show something obvious
      return interpolate(value, vars);
    },
    [language]
  );
}
