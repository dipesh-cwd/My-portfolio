import { projects } from "../data/projects.js";
import { ExternalLink, Tag, WindowPage } from "./ui.jsx";

const Projects = () => (
  <WindowPage title="Projects" subtitle="A few things I've built.">
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
      {projects.map((project) => (
        <li
          key={project.id}
          className="flex flex-col rounded-lg border border-gray-700 bg-[#252526] p-4"
        >
          <h2 className="text-base font-semibold text-blue-300">{project.title}</h2>
          <p className="mt-1 flex-1 text-sm text-gray-300">{project.description}</p>

          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Technologies">
            {project.tech.map((tech) => (
              <Tag key={tech}>{tech}</Tag>
            ))}
          </ul>

          {(project.github || project.live) && (
            <div className="mt-3 flex gap-4 text-sm">
              {project.github && <ExternalLink href={project.github}>Code</ExternalLink>}
              {project.live && <ExternalLink href={project.live}>Live demo</ExternalLink>}
            </div>
          )}
        </li>
      ))}
    </ul>
  </WindowPage>
);

export default Projects;
