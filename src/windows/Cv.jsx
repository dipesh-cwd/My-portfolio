import { Download } from "lucide-react";
import { education } from "../data/education.js";
import { experience } from "../data/experience.js";
import { profile } from "../data/profile.js";
import { techStack } from "../data/techStack.js";
import { asset } from "../lib/assets.js";
import { WindowPage } from "./ui.jsx";

const SectionTitle = ({ children }) => (
  <h2 className="mt-6 mb-2 border-b border-gray-700 pb-1 text-sm font-semibold tracking-wide text-blue-300 uppercase">
    {children}
  </h2>
);

const Cv = () => (
  <WindowPage>
    <header className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold text-white">{profile.name}</h1>
        <p className="text-sm text-gray-300">
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
          Download CV
        </a>
      )}
    </header>

    <p className="mt-4 text-sm text-gray-300">{profile.summary}</p>

    <SectionTitle>Skills</SectionTitle>
    <dl className="space-y-1 text-sm">
      {techStack.map(({ category, items }) => (
        <div key={category} className="flex gap-3">
          <dt className="w-32 shrink-0 text-gray-400">{category}</dt>
          <dd className="text-gray-200">{items.join(", ")}</dd>
        </div>
      ))}
    </dl>

    <SectionTitle>Experience</SectionTitle>
    <ul className="space-y-4">
      {experience.map((job) => (
        <li key={job.id}>
          <p className="text-xs text-gray-400">{job.period}</p>
          <h3 className="text-sm font-semibold text-white">
            {job.role} <span className="font-normal text-gray-400">· {job.place}</span>
          </h3>
          <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-gray-300">
            {job.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>

    <SectionTitle>Education</SectionTitle>
    <ul className="space-y-2 text-sm">
      {education.map((item) => (
        <li key={item.id}>
          <span className="font-semibold text-white">{item.program}</span>
          <span className="text-gray-400">
            {" "}
            · {item.institution} · {item.period}
          </span>
        </li>
      ))}
    </ul>
  </WindowPage>
);

export default Cv;
