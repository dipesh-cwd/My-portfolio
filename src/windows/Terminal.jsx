import { techStack } from "../data/techStack.js";
import { useTranslation } from "../i18n/index.js";
import { Heading } from "./ui.jsx";

const Terminal = () => {
  const t = useTranslation();

  return (
    <div className="bg-[var(--content-bg)] p-3 text-[14px] leading-relaxed text-[var(--content-text)]">
      <span className="font-bold text-green-400">C:\Users\HP\Dipesh\tech_stack</span>

      <br />

      <p className="text-[var(--accent-text)]">{t("terminal.loading")}</p>
      <br />

      <div className="mb-4 ml-9 flex gap-12 text-[var(--content-text)]">
        <p className="w-32 font-semibold">{t("terminal.category")}</p>
        <p className="font-semibold">{t("terminal.technologies")}</p>
      </div>

      <ul className="ml-2 space-y-1 border-t border-b border-dotted border-[var(--card-border)] pt-2 pb-2">
        {techStack.map(({ category, items }) => (
          <li key={category} className="flex items-start gap-6">
            <span className="mt-1 text-green-400">✔</span>

            <Heading className="w-40 font-bold text-[var(--accent-text)]">{category}</Heading>

            <ul className="flex flex-wrap text-[var(--content-text)]">
              {items.map((item, i) => (
                <li key={item} className="px-1">
                  {item} {i < items.length - 1 && ","}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <div className="pt-1">
        <p className="text-[var(--accent-text)]">
          {t("terminal.loaded", { count: techStack.length })}
        </p>
        <p className="text-[var(--accent-text)]">{t("terminal.renderTime")}</p>
        <span className="font-bold text-green-400">C:\Users\HP\Dipesh&gt;</span>
        <br />
      </div>
    </div>
  );
};

export default Terminal;
