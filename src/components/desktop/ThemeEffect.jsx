import { useEffect } from "react";
import { usePreferencesStore } from "../../store/preferencesStore.js";

/** Renders nothing; just keeps <html data-theme="..."> in sync with the Settings choice. */
const ThemeEffect = () => {
  const theme = usePreferencesStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return null;
};

export default ThemeEffect;
