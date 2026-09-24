import { useEffect, useRef, useState } from "react";
import { APPS, DOCK_APPS } from "../../config/apps.js";
import { profile } from "../../data/profile.js";
import { useTranslation } from "../../i18n/index.js";
import { asset } from "../../lib/assets.js";
import { useUiStore } from "../../store/uiStore.js";
import { useWindowStore } from "../../store/windowStore.js";

/** Start menu: search + launch any app. Rendered only while open (so search resets each time). */
const StartMenu = ({ menuRef }) => {
  const t = useTranslation();
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const openApp = useWindowStore((s) => s.openApp);
  const closeMenus = useUiStore((s) => s.closeMenus);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const needle = query.trim().toLowerCase();
  const matches = DOCK_APPS.filter((appKey) =>
    t(APPS[appKey].titleKey).toLowerCase().includes(needle)
  );

  const launch = (appKey) => {
    openApp(appKey); // opens, or restores + focuses if it is already open
    closeMenus();
  };

  return (
    <div
      ref={menuRef}
      role="dialog"
      aria-label={t("start.menuLabel")}
      className="fixed left-3 z-[8999] w-80 rounded-xl border border-white/10 bg-[#1f1f1f]/95 p-3 text-white shadow-2xl backdrop-blur-xl"
      style={{ bottom: "calc(var(--taskbar-h) + 8px)" }}
    >
      <input
        ref={inputRef}
        type="search"
        value={query}
        placeholder={t("start.searchPlaceholder")}
        aria-label={t("start.searchPlaceholder")}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && matches[0]) launch(matches[0]);
        }}
        className="mb-3 w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none placeholder:text-gray-500 focus:border-blue-400"
      />

      {matches.length > 0 ? (
        <ul className="grid grid-cols-2 gap-1">
          {matches.map((appKey) => (
            <li key={appKey}>
              <button
                type="button"
                onClick={() => launch(appKey)}
                className="flex w-full cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-left text-sm hover:bg-white/10"
              >
                <img src={asset(APPS[appKey].icon)} alt="" className="h-6 w-6 object-contain" />
                {t(APPS[appKey].titleKey)}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-2 py-4 text-center text-sm text-gray-400">{t("start.noResults")}</p>
      )}

      <div className="mt-3 border-t border-white/10 pt-2 text-xs text-gray-400">
        {profile.name} · {profile.role}
      </div>
    </div>
  );
};

export default StartMenu;
