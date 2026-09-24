import { education } from "../data/education.js";
import { useTranslation } from "../i18n/index.js";
import { Heading, WindowPage } from "./ui.jsx";

const Education = () => {
  const t = useTranslation();

  return (
    <WindowPage title={t("apps.education")} subtitle={t("education.subtitle")}>
      <ol className="space-y-5 border-l border-[var(--card-border)] pl-5">
        {education.map((item) => (
          <li key={item.id} className="relative">
            <span className="absolute top-1.5 -left-[25px] h-2.5 w-2.5 rounded-full bg-blue-400" />
            <p className="text-xs text-[var(--muted-text)]">{item.period}</p>
            <Heading rel={1} className="text-base font-semibold text-[var(--titlebar-text)]">
              {item.program}
            </Heading>
            <p className="text-sm text-[var(--accent-text)]">{item.institution}</p>
            {item.details && (
              <p className="mt-1 text-sm text-[var(--content-text)]">{item.details}</p>
            )}
          </li>
        ))}
      </ol>
    </WindowPage>
  );
};

export default Education;
