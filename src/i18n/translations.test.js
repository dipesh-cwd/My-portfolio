import { describe, expect, it } from "vitest";
import { translations } from "./translations.js";

const flatten = (obj, prefix = "") =>
  Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "object" && value !== null ? flatten(value, path) : [path];
  });

describe("translations", () => {
  it("every language defines exactly the same set of keys as English", () => {
    const enKeys = flatten(translations.en).sort();
    for (const locale of Object.keys(translations)) {
      if (locale === "en") continue;
      expect(flatten(translations[locale]).sort(), `locale "${locale}"`).toEqual(enKeys);
    }
  });

  it("no translated string is empty", () => {
    for (const [locale, dict] of Object.entries(translations)) {
      for (const key of flatten(dict)) {
        const value = key.split(".").reduce((node, part) => node[part], dict);
        expect(value.trim(), `${locale}.${key}`).not.toBe("");
      }
    }
  });

  it("every {placeholder} in English also appears in the other languages, for the same key", () => {
    const placeholders = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
    for (const key of flatten(translations.en)) {
      const enValue = key.split(".").reduce((node, part) => node[part], translations.en);
      for (const locale of Object.keys(translations)) {
        if (locale === "en") continue;
        const value = key.split(".").reduce((node, part) => node[part], translations[locale]);
        expect(placeholders(value), `${locale}.${key}`).toEqual(placeholders(enValue));
      }
    }
  });
});
