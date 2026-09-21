import { archiveItems } from "../data/archive.js";
import { ExternalLink, WindowPage } from "./ui.jsx";

const Archive = () => (
  <WindowPage title="Archive" subtitle="Older experiments and notes.">
    <ul className="divide-y divide-gray-700 rounded-lg border border-gray-700 bg-[#252526]">
      {archiveItems.map((item) => (
        <li key={item.id} className="flex items-start gap-4 p-4">
          <span className="w-12 shrink-0 text-xs text-gray-400">{item.year}</span>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-white">
              {item.title}{" "}
              <span className="ml-1 rounded bg-gray-700 px-1.5 py-0.5 text-[10px] font-normal text-gray-300">
                {item.kind}
              </span>
            </h2>
            <p className="mt-0.5 text-sm text-gray-300">{item.description}</p>
            {item.url && (
              <div className="mt-1 text-sm">
                <ExternalLink href={item.url}>Open</ExternalLink>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  </WindowPage>
);

export default Archive;
