# Dipesh's Portfolio

A desktop-style portfolio that runs in the browser: a wallpaper, a taskbar with a magnifying dock, and
draggable, resizable windows for each app (Skills terminal, Gallery, image viewer, ...).

Designed for desktop and tablet screens.

## Stack

React 19 · Vite 7 · Tailwind CSS 4 · Zustand + Immer (state) · GSAP (animations) · Vitest

## Getting started

```bash
npm install
npm run dev        # start the dev server
```

| Script                              | What it does                          |
| ----------------------------------- | ------------------------------------- |
| `npm run dev`                       | Dev server with hot reload            |
| `npm run build` / `npm run preview` | Production build / preview it locally |
| `npm run lint` / `lint:fix`         | ESLint                                |
| `npm run format` / `format:check`   | Prettier                              |
| `npm test` / `test:watch`           | Vitest (unit + UI tests)              |

A pre-commit hook (Husky + lint-staged) lints and formats staged files. CI runs lint, format check,
tests and build on every push and pull request.

## How the window system works

```
src/
  config/apps.js          What apps exist (title, icon, default size, single/multi instance)
  config/layout.js        Shared numbers (taskbar height, z-index range, ...)
  store/windowStore.js    ONE Zustand store for every open window
  windows/registry.js     Which component is shown inside which app's window
  windows/*.jsx           Window contents (Terminal, Gallery, ImageViewer, Placeholder)
  components/window/      WindowManager, WindowFrame (title bar, drag, resize), controls
  components/taskbar/     Taskbar, Dock, Clock
  components/desktop/     Welcome screen
  data/                   Content as data (tech stack, gallery images)
```

- A window exists in the store only while it is open. Single-instance apps use the app key as id
  (`"skill"`); multi-instance apps get `"viewer#3"`, `"viewer#4"`, ...
- Open things with `useWindowStore.getState().openApp("viewer", { images, index })` or, inside a
  component, `const openApp = useWindowStore((s) => s.openApp)`.
- Always subscribe with a selector (`useWindowStore((s) => s.windows[id])`), never `useWindowStore()`,
  so components only re-render when their own data changes.

### Adding a new window

1. Add the app to `src/config/apps.js` (and to `DOCK_APPS` if it should be in the dock).
2. Build its content component in `src/windows/`. It receives `{ windowId, appKey, data }`.
3. Register it in `src/windows/registry.js`.

Apps without a registered component show a "under construction" placeholder.

## Conventions

- Prettier formats everything (2 spaces, double quotes, 100 columns); ESLint must pass with zero
  errors.
- Use `asset("file.png")` from `src/lib/assets.js` for files in `/public`.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/)
  (`feat:`, `fix:`, `refactor:`, `chore:`, ...).
