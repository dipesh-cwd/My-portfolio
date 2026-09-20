/**
 * App registry: static metadata for every kind of window.
 *
 * - This file is pure data (no React imports) so the store can use it without cycles.
 * - The component rendered inside each window lives in `src/windows/registry.js`.
 *
 * Fields
 *   title          Name shown in the dock tooltip and the default window title.
 *   windowTitle    Optional fancy title shown in the window's title bar.
 *   getTitle(data) Optional dynamic title (e.g. the image being viewed). Wins over windowTitle.
 *   icon           File in /public used for the dock icon.
 *   width/height   Default window size in px.
 *   minWidth/minHeight  Smallest size the user can resize to.
 *   multiInstance  true = every open() creates a new window (image viewer).
 *                  false = one window per app; opening again just focuses it.
 */
export const APPS = {
  portfolio: {
    title: "Portfolio",
    icon: "portfolio.png",
    width: 720,
    height: 480,
  },
  photos: {
    title: "Gallery",
    windowTitle: "C:\\Users\\dipesh\\gallery",
    icon: "gallery2.png",
    width: 650,
    height: 420,
    minWidth: 440,
    minHeight: 360,
  },
  contact: {
    title: "Contact",
    icon: "contact.png",
    width: 560,
    height: 420,
  },
  skill: {
    title: "Skill",
    windowTitle: "C:\\Users\\dipesh\\TechStack",
    icon: "cmd.png",
    width: 650,
    height: 420,
    minWidth: 440,
    minHeight: 360,
  },
  education: {
    title: "Education",
    icon: "education.png",
    width: 600,
    height: 420,
  },
  cv: {
    title: "CV",
    icon: "cv.png",
    width: 640,
    height: 480,
  },
  archive: {
    title: "Archive",
    icon: "archive.png",
    width: 600,
    height: 420,
  },

  // Not in the dock: opened by the gallery, one window per image.
  viewer: {
    title: "Image Viewer",
    getTitle: (data) => data?.images?.[data.index]?.name ?? "Image Viewer",
    width: 700,
    height: 500,
    minWidth: 360,
    minHeight: 280,
    multiInstance: true,
  },
};

/** Order of the apps in the dock. */
export const DOCK_APPS = ["portfolio", "photos", "contact", "skill", "education", "cv", "archive"];

export const DEFAULT_MIN_WIDTH = 400;
export const DEFAULT_MIN_HEIGHT = 300;

export const getWindowTitle = (appKey, data) => {
  const app = APPS[appKey];
  if (!app) return "";
  return app.getTitle?.(data) ?? app.windowTitle ?? app.title;
};
