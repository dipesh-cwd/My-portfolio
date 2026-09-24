import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { usePreferencesStore } from "../store/preferencesStore.js";
import { useTranslation } from "./index.js";

beforeEach(() => {
  usePreferencesStore.setState({ language: "en" });
});

describe("useTranslation", () => {
  it("resolves a key in the current language", () => {
    const { result } = renderHook(() => useTranslation());
    expect(result.current("apps.projects")).toBe("Projects");
  });

  it("switches language reactively", () => {
    const { result } = renderHook(() => useTranslation());
    act(() => usePreferencesStore.getState().setLanguage("de"));
    expect(result.current("apps.projects")).toBe("Projekte");
    act(() => usePreferencesStore.getState().setLanguage("np"));
    expect(result.current("apps.projects")).toBe("प्रोजेक्टहरू");
  });

  it("interpolates {placeholders}", () => {
    const { result } = renderHook(() => useTranslation());
    expect(result.current("panel.closeWindow", { title: "Skill" })).toBe("Close Skill");
  });

  it("falls back to a readable key rather than throwing on an unknown key", () => {
    const { result } = renderHook(() => useTranslation());
    expect(result.current("nope.nope")).toBe("nope.nope");
  });
});
