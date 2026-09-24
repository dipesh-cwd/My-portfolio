/**
 * App registry: static metadata for every kind of window.
 *
 * - This file is pure data (no React imports) so the store can use it without cycles.
 * - The component rendered inside each window lives in `src/windows/registry.js`.
 *
 * Fields
 *   titleKey       Translation key (src/i18n/translations.js) for the dock tooltip and the
 *                  default window title. Resolve it with useTranslation(): t(APPS[key].titleKey).
 *   windowTitle    Optional fancy title shown in the window's title bar (kept as flavor text,
 *                  not translated — a fake file path reads the same in every language).
 *   getTitle(data, t)  Optional dynamic title (e.g. the image being viewed). Wins over windowTitle.
 *   icon           File in /public used for the dock icon.
 *   width/height   Default window size in px.
 *   minWidth/minHeight  Smallest size the user can resize to.
 *   multiInstance  true = every open() creates a new window (image viewer).
 *                  false = one window per app; opening again just focuses it.
 */
export const APPS = {
  projects: {
    titleKey: "apps.projects",
    icon: "portfolio.png",
    width: 760,
    height: 520,
    minWidth: 480,
    minHeight: 360,
  },
  photos: {
    titleKey: "apps.photos",
    windowTitle: "C:\\Users\\dipesh\\gallery",
    icon: "gallery2.png",
    width: 650,
    height: 420,
    minWidth: 440,
    minHeight: 360,
  },
  contact: {
    titleKey: "apps.contact",
    icon: "contact.png",
    width: 560,
    height: 540,
    minWidth: 420,
    minHeight: 460,
  },
  skill: {
    titleKey: "apps.skill",
    windowTitle: "C:\\Users\\dipesh\\TechStack",
    icon: "cmd.png",
    width: 650,
    height: 420,
    minWidth: 440,
    minHeight: 360,
  },
  education: {
    titleKey: "apps.education",
    icon: "education.png",
    width: 620,
    height: 440,
    minWidth: 420,
    minHeight: 300,
  },
  cv: {
    titleKey: "apps.cv",
    icon: "cv.png",
    width: 680,
    height: 580,
    minWidth: 480,
    minHeight: 400,
  },
  archive: {
    titleKey: "apps.archive",
    icon: "archive.png",
    width: 620,
    height: 440,
    minWidth: 420,
    minHeight: 300,
  },
  me: {
    titleKey: "apps.me",
    icon: "me.png",
    width: 700,
    height: 540,
    minWidth: 460,
    minHeight: 380,
  },
  settings: {
    titleKey: "apps.settings",
    icon: "setting.png",
    width: 560,
    height: 520,
    minWidth: 420,
    minHeight: 420,
  },

  // Not in the dock: opened by the gallery, one window per image.
  viewer: {
    titleKey: "apps.viewer",
    icon: "gallery2.png",
    getTitle: (data, t) => data?.images?.[data.index]?.name ?? t("apps.viewer"),
    width: 700,
    height: 500,
    minWidth: 360,
    minHeight: 280,
    multiInstance: true,
  },
};

/** Order of the apps in the dock. */
export const DOCK_APPS = [
  "projects",
  "photos",
  "contact",
  "skill",
  "education",
  "cv",
  "archive",
  "me",
  "settings",
];

export const DEFAULT_MIN_WIDTH = 400;
export const DEFAULT_MIN_HEIGHT = 300;

/**
 * Resolve a window's title. Needs a translator (from useTranslation()) since titles are
 * language-dependent; call this from inside a component, not from the store.
 */
export const getWindowTitle = (appKey, data, t) => {
  const app = APPS[appKey];
  if (!app) return "";
  // `app.title` (a literal string) is supported too, so ad-hoc apps in tests don't need a
  // translation key.
  return (
    app.getTitle?.(data, t) ??
    app.windowTitle ??
    (app.titleKey ? t(app.titleKey) : (app.title ?? ""))
  );
};
