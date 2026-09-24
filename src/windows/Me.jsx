import { me } from "../data/me.js";
import { profile } from "../data/profile.js";
import { timeline } from "../data/timeline.js";
import { useTranslation } from "../i18n/index.js";
import { asset } from "../lib/assets.js";
import { useWindowStore } from "../store/windowStore.js";
import { Heading, WindowPage } from "./ui.jsx";

const initials = (name) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

/** Avatar photo, or the person's initials if no photo is configured yet (see src/data/me.js). */
const Avatar = ({ name }) =>
  me.photo ? (
    <img
      src={asset(me.photo)}
      alt={name}
      className="h-24 w-24 shrink-0 rounded-full object-cover"
    />
  ) : (
    <div
      aria-hidden="true"
      className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-2xl font-semibold text-[var(--accent-text)]"
    >
      {initials(name)}
    </div>
  );

const Me = () => {
  const t = useTranslation();
  const openApp = useWindowStore((s) => s.openApp);

  return (
    <WindowPage title={t("apps.me")} subtitle={t("me.subtitle")}>
      <section className="flex flex-wrap items-center gap-5 border-b border-[var(--card-border)] pb-6">
        <Avatar name={profile.name} />
        <div className="min-w-0 flex-1">
          <Heading rel={1} className="mb-1 text-base font-semibold text-[var(--accent-text)]">
            {t("me.about")}
          </Heading>
          <p className="text-sm text-[var(--content-text)]">{me.bio}</p>
        </div>
      </section>

      <section className="mt-6">
        <Heading rel={1} className="mb-4 text-base font-semibold text-[var(--accent-text)]">
          {t("me.story")}
        </Heading>

        <ol className="space-y-8 border-l border-[var(--card-border)] pl-5">
          {timeline.map((entry) => (
            <li key={entry.id} className="relative">
              <span className="absolute top-1.5 -left-[25px] h-2.5 w-2.5 rounded-full bg-blue-400" />
              <p className="text-xs text-[var(--muted-text)]">{entry.period}</p>
              <Heading rel={2} className="text-base font-semibold text-[var(--titlebar-text)]">
                {entry.title}
              </Heading>
              <p className="mt-1 text-sm text-[var(--content-text)]">{entry.description}</p>

              {entry.photos?.length > 0 && (
                <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {entry.photos.map((photo, index) => (
                    <li key={photo.id} className="shrink-0">
                      <button
                        type="button"
                        aria-label={t("gallery.openImage", { name: photo.name })}
                        onClick={() => openApp("viewer", { images: entry.photos, index })}
                        className="block h-20 w-20 cursor-pointer overflow-hidden rounded-md transition-transform hover:scale-105"
                      >
                        <img
                          src={asset(photo.src)}
                          alt={photo.description ?? photo.name}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </section>
    </WindowPage>
  );
};

export default Me;
