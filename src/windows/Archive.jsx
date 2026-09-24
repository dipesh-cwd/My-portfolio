import { archiveItems } from "../data/archive.js";
import { useTranslation } from "../i18n/index.js";
import { ExternalLink, Heading, WindowPage } from "./ui.jsx";

const Archive = () => {
  const t = useTranslation();

  return (
    <WindowPage title={t("apps.archive")} subtitle={t("archive.subtitle")}>
      <ul className="divide-y divide-[var(--card-border)] rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
        {archiveItems.map((item) => (
          <li key={item.id} className="flex items-start gap-4 p-4">
            <span className="w-12 shrink-0 text-xs text-[var(--muted-text)]">{item.year}</span>
            <div className="min-w-0 flex-1">
              <Heading rel={1} className="text-sm font-semibold text-[var(--titlebar-text)]">
                {item.title}{" "}
                <span className="ml-1 rounded bg-gray-700/40 px-1.5 py-0.5 text-[10px] font-normal text-[var(--muted-text)]">
                  {item.kind}
                </span>
              </Heading>
              <p className="mt-0.5 text-sm text-[var(--content-text)]">{item.description}</p>
              {item.url && (
                <div className="mt-1 text-sm">
                  <ExternalLink href={item.url}>{t("archive.open")}</ExternalLink>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </WindowPage>
  );
};

export default Archive;
