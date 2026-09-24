import { Download } from "lucide-react";
import { APPS } from "../../config/apps.js";
import { profile } from "../../data/profile.js";
import { useTranslation } from "../../i18n/index.js";
import { asset } from "../../lib/assets.js";
import Archive from "../../windows/Archive.jsx";
import Contact from "../../windows/Contact.jsx";
import Cv from "../../windows/Cv.jsx";
import Projects from "../../windows/Projects.jsx";
import { ExternalLink } from "../../windows/ui.jsx";
import MobileGallery from "./MobileGallery.jsx";

const SECTIONS = [
  { id: "projects", appKey: "projects", Component: Projects },
  { id: "cv", appKey: "cv", Component: Cv },
  { id: "gallery", appKey: "photos", Component: MobileGallery },
  { id: "archive", appKey: "archive", Component: Archive },
  { id: "contact", appKey: "contact", Component: Contact },
];

/**
 * The phone layout: one scrolling page that reuses the same content components as the desktop
 * windows. Its own scroll container is needed because the desktop shell locks page scrolling.
 */
const MobileSite = () => {
  const t = useTranslation();

  return (
    <div className="fixed inset-0 overflow-y-auto overscroll-contain bg-[var(--content-bg)] font-sans text-[var(--content-text)]">
      <header className="px-5 pt-10 pb-6">
        <h1 className="text-3xl font-semibold text-[var(--titlebar-text)]">{profile.name}</h1>
        <p className="mt-1 text-[var(--accent-text)]">
          {profile.role}
          {profile.location && (
            <span className="text-[var(--muted-text)]"> · {profile.location}</span>
          )}
        </p>
        <p className="mt-3 text-sm text-[var(--content-text)]">{profile.summary}</p>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <ExternalLink href={profile.github}>{t("contact.linkGithub")}</ExternalLink>
          {profile.linkedin && (
            <ExternalLink href={profile.linkedin}>{t("contact.linkLinkedin")}</ExternalLink>
          )}
          <a href={`mailto:${profile.email}`} className="text-[var(--accent-text)] hover:underline">
            {t("contact.linkEmail")}
          </a>
          {profile.cvFile && (
            <a
              href={asset(profile.cvFile)}
              download
              className="inline-flex items-center gap-1.5 text-[var(--accent-text)] hover:underline"
            >
              <Download size={14} aria-hidden="true" />
              {t("cv.download")}
            </a>
          )}
        </div>
      </header>

      <nav
        aria-label={t("mobile.sections")}
        className="sticky top-0 z-10 flex gap-5 overflow-x-auto border-y border-[var(--card-border)] bg-[var(--content-bg)]/95 px-5 py-3 text-sm backdrop-blur"
      >
        {SECTIONS.map(({ id, appKey }) => (
          <a
            key={id}
            href={`#${id}`}
            className="shrink-0 text-[var(--muted-text)] hover:text-[var(--titlebar-text)]"
          >
            {t(APPS[appKey].titleKey)}
          </a>
        ))}
      </nav>

      <main>
        {SECTIONS.map(({ id, Component }) => (
          <section key={id} id={id} className="scroll-mt-12 border-b border-[var(--card-border)]">
            <Component />
          </section>
        ))}
      </main>

      <footer className="px-5 py-8 text-center text-xs text-[var(--muted-text)]">
        © {new Date().getFullYear()} {profile.name}
      </footer>
    </div>
  );
};

export default MobileSite;
