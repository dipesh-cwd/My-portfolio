import { education } from "../data/education.js";
import { WindowPage } from "./ui.jsx";

const Education = () => (
  <WindowPage title="Education" subtitle="Where I studied.">
    <ol className="space-y-5 border-l border-gray-700 pl-5">
      {education.map((item) => (
        <li key={item.id} className="relative">
          <span className="absolute top-1.5 -left-[25px] h-2.5 w-2.5 rounded-full bg-blue-400" />
          <p className="text-xs text-gray-400">{item.period}</p>
          <h2 className="text-base font-semibold text-white">{item.program}</h2>
          <p className="text-sm text-blue-300">{item.institution}</p>
          {item.details && <p className="mt-1 text-sm text-gray-300">{item.details}</p>}
        </li>
      ))}
    </ol>
  </WindowPage>
);

export default Education;
