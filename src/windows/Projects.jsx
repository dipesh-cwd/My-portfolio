import { projects } from "../data/projects.js";
import { useTranslation } from "../i18n/index.js";
import { ExternalLink, Heading, Tag, WindowPage } from "./ui.jsx";

const Projects = () => {
  const t = useTranslation();

  return (
    <WindowPage title={t("apps.projects")} subtitle={t("projects.subtitle")}>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
        {projects.map((project) => (
          <li
            key={project.id}
            className="flex flex-col rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4"
          >
            <Heading rel={1} className="text-base font-semibold text-[var(--accent-text)]">
              {project.title}
            </Heading>
            <p className="mt-1 flex-1 text-sm text-[var(--content-text)]">{project.description}</p>

            <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={t("terminal.technologies")}>
              {project.tech.map((tech) => (
                <Tag key={tech}>{tech}</Tag>
              ))}
            </ul>

            {(project.github || project.live) && (
              <div className="mt-3 flex gap-4 text-sm">
                {project.github && (
                  <ExternalLink href={project.github}>{t("projects.code")}</ExternalLink>
                )}
                {project.live && (
                  <ExternalLink href={project.live}>{t("projects.live")}</ExternalLink>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </WindowPage>
  );
};

export default Projects;
