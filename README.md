# Dipesh's Portfolio

A desktop-style portfolio that runs in the browser: a wallpaper, a taskbar with a magnifying dock, and
draggable, resizable windows for each app (Skills terminal, Gallery, image viewer, ...).

Desktop and tablet get the windowed desktop; phones get a simple scrolling page.

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
  store/uiStore.js        Which taskbar popup (Start menu / quick panel) is open
  store/preferencesStore.js  Language, theme, welcome-screen options (persisted)
  i18n/                   Translation dictionaries (en/np/de) + the useTranslation() hook
  windows/registry.js     Which component is shown inside which app's window
  windows/*.jsx           Window contents (Terminal, Gallery, ImageViewer, Settings, Placeholder)
  components/window/      WindowManager, WindowFrame (title bar, drag, resize), controls
  components/taskbar/     Taskbar, Dock, Clock, StartMenu, QuickPanel (window switcher)
  components/mobile/      Phone layout: one scrolling page reusing the same content
  components/desktop/     Welcome screen, BootScreen (start-up splash, once per session)
  data/                   Your content as data: profile, projects, education, experience,
                          archive, tech stack, gallery images
  lib/contact.js          Contact form validation + sending (mailto fallback / optional API)
```

- A window exists in the store only while it is open. Single-instance apps use the app key as id
  (`"skill"`); multi-instance apps get `"viewer#3"`, `"viewer#4"`, ...
- Open things with `useWindowStore.getState().openApp("viewer", { images, index })` or, inside a
  component, `const openApp = useWindowStore((s) => s.openApp)`.
- Always subscribe with a selector (`useWindowStore((s) => s.windows[id])`), never `useWindowStore()`,
  so components only re-render when their own data changes.

### Adding a new window

1. Add the app to `src/config/apps.js`: give it a `titleKey` (see `src/i18n/translations.js`)
   and add it to `DOCK_APPS` if it should be in the dock.
2. Build its content component in `src/windows/`. It receives `{ windowId, appKey, data }`; call
   `useTranslation()` for any of its own UI text.
3. Register it in `src/windows/registry.js`.

Apps without a registered component show a "under construction" placeholder.

## Editing your content

You never need to touch JSX to change what the windows show. Edit the files in `src/data/`:

| File            | Used by                                 |
| --------------- | --------------------------------------- |
| `profile.js`    | Contact + CV (name, role, email, links) |
| `projects.js`   | Projects window                         |
| `education.js`  | Education + CV                          |
| `experience.js` | CV                                      |
| `archive.js`    | Archive window                          |
| `techStack.js`  | Skill terminal + CV                     |
| `gallery.js`    | Gallery + image viewer                  |

Entries marked "Placeholder" are examples to replace.

This data is not translated — it's your own writing, kept as you wrote it in every language
(see "Language" below for what IS translated).

### Contact form

Without a backend the form opens the visitor's email app with the message pre-filled. To send to an
API instead, set `VITE_CONTACT_ENDPOINT` (see `.env.example`); the form then POSTs
`{ name, email, message }` as JSON.

## Language, theme and the Settings app

The **Settings** app (gear icon in the dock) lets a visitor change:

- **Language** — English, नेपाली (Nepali) or Deutsch (German). This translates the interface
  chrome: dock and window titles, buttons, field labels, section headings. It does **not**
  translate your own content in `src/data/` — see "Editing your content" above.
- **Appearance** — dark or light. Applied via `data-theme` on `<html>` and a set of CSS
  variables in `src/index.css` (`--win-bg`, `--content-text`, ...); most window chrome and
  content windows use these variables so they adapt automatically.
- **Welcome screen** — turn the magnetic title animation off, or skip the welcome screen
  entirely.
- **Layout** — close every open window, or reset all settings to default.

The choice is saved to `localStorage`, so it persists across visits.

To add a new language: copy the `en` object in `src/i18n/translations.js`, translate every
value, then add the language code to `LANGUAGES` in `src/store/preferencesStore.js` and to
`LANGUAGE_LABELS` in `src/windows/Settings.jsx`. A test in `src/i18n/translations.test.js`
fails the build if any language is missing a key, so a partial translation can't ship silently.

To add a new theme-aware color, add the CSS variable to both `:root` and `[data-theme="light"]`
in `src/index.css`, then reference it with Tailwind's arbitrary-value syntax, e.g.
`bg-[var(--win-bg)]`.

## Deploying (free)

The site is a static Vite build, so any static host works. **Vercel** is the easiest:

1. Push the repo to GitHub.
2. On [vercel.com](https://vercel.com), sign in with GitHub, click **Add New → Project** and import the repo.
3. Leave the detected settings (Framework: Vite, build `npm run build`, output `dist`) and click **Deploy**.
4. You get `https://<project>.vercel.app`. To change the name: **Project → Settings → Domains**.

Every push to `main` redeploys automatically; pull requests get preview URLs.

Vercel's free Hobby plan is for personal, non-commercial use. If you take paid client work through
the site, use **Cloudflare Pages** instead (free, unlimited bandwidth): build command
`npm run build`, output directory `dist`, and set `NODE_VERSION` to `22`. `vercel.json` (security
headers) is ignored there.

### Before you publish

- Replace every "Placeholder" in `src/data/` and set your real email in `profile.js`.
- Edit the title/description in `index.html` and, if your name or tagline changed, replace
  `public/og-image.png` (1200x630) so link previews match.
- Add your CV PDF to `public/` and set `cvFile` in `profile.js`.
- Replace the gallery photos (`public/image1.jpg` ... `image10.jpg`, ideally under ~300 KB each).
- After the first deploy, paste your URL into a link-preview checker (e.g. the LinkedIn Post
  Inspector or opengraph.xyz) to confirm the preview image shows.

### Phones

Below 768px wide the desktop UI is replaced by a simple scrolling page built from the same content
(`components/mobile/`). Tablets and up get the windowed desktop.

## Conventions

- Prettier formats everything (2 spaces, double quotes, 100 columns); ESLint must pass with zero
  errors.
- Use `asset("file.png")` from `src/lib/assets.js` for files in `/public`.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/)
  (`feat:`, `fix:`, `refactor:`, `chore:`, ...).
