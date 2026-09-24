import { APPS } from "../config/apps.js";
import { useTranslation } from "../i18n/index.js";

/** Shown for apps that don't have real content yet. */
const Placeholder = ({ appKey }) => {
  const t = useTranslation();
  const app = APPS[appKey];
  const title = app?.titleKey ? t(app.titleKey) : app?.title;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 bg-[var(--content-bg)] p-6 text-center text-[var(--content-text)]">
      <p className="text-lg font-semibold text-[var(--accent-text)]">{title}</p>
      <p className="text-sm text-[var(--muted-text)]">{t("placeholder.body")}</p>
    </div>
  );
};

export default Placeholder;
