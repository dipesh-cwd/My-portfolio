import { Download } from "lucide-react";
import { education } from "../data/education.js";
import { experience } from "../data/experience.js";
import { profile } from "../data/profile.js";
import { techStack } from "../data/techStack.js";
import { useTranslation } from "../i18n/index.js";
import { asset } from "../lib/assets.js";
import { Heading, WindowPage } from "./ui.jsx";

const SectionTitle = ({ children }) => (
  <Heading
    rel={1}
    className="mt-6 mb-2 border-b border-[var(--card-border)] pb-1 text-sm font-semibold tracking-wide text-[var(--accent-text)] uppercase"
  >
    {children}
  </Heading>
);

const Cv = () => {
  const t = useTranslation();

  return (
    <WindowPage>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Heading className="text-2xl font-semibold text-[var(--titlebar-text)]">
            {profile.name}
          </Heading>
          <p className="text-sm text-[var(--content-text)]">
            {profile.role}
            {profile.location && ` · ${profile.location}`}
          </p>
        </div>

        {profile.cvFile && (
          <a
            href={asset(profile.cvFile)}
            download
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-500"
          >
            <Download size={14} aria-hidden="true" />
            {t("cv.download")}
          </a>
        )}
      </div>

      <p className="mt-4 text-sm text-[var(--content-text)]">{profile.summary}</p>

      <SectionTitle>{t("cv.skills")}</SectionTitle>
      <dl className="space-y-1 text-sm">
        {techStack.map(({ category, items }) => (
          <div key={category} className="flex gap-3">
            <dt className="w-32 shrink-0 text-[var(--muted-text)]">{category}</dt>
            <dd className="text-[var(--content-text)]">{items.join(", ")}</dd>
          </div>
        ))}
      </dl>

      <SectionTitle>{t("cv.experience")}</SectionTitle>
      <ul className="space-y-4">
        {experience.map((job) => (
          <li key={job.id}>
            <p className="text-xs text-[var(--muted-text)]">{job.period}</p>
            <Heading rel={2} className="text-sm font-semibold text-[var(--titlebar-text)]">
              {job.role} <span className="font-normal text-[var(--muted-text)]">· {job.place}</span>
            </Heading>
            <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-[var(--content-text)]">
              {job.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <SectionTitle>{t("cv.education")}</SectionTitle>
      <ul className="space-y-2 text-sm">
        {education.map((item) => (
          <li key={item.id}>
            <span className="font-semibold text-[var(--titlebar-text)]">{item.program}</span>
            <span className="text-[var(--muted-text)]">
              {" "}
              · {item.institution} · {item.period}
            </span>
          </li>
        ))}
      </ul>
    </WindowPage>
  );
};

export default Cv;
