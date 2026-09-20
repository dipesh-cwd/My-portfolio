import { techStack } from "../data/techStack.js";

const Terminal = () => (
  <div className="p-3 text-[14px] leading-relaxed">
    <span className="font-bold text-green-400">C:\Users\HP\Dipesh\tech_stack</span>

    <br />

    <p className="text-blue-300">Loading tech stack...</p>
    <br />

    <div className="mb-4 ml-9 flex gap-12 text-gray-300">
      <p className="w-32 font-semibold">Category</p>
      <p className="font-semibold">Technologies</p>
    </div>

    <ul className="ml-2 space-y-1 border-t border-b border-dotted border-gray-600 pt-2 pb-2">
      {techStack.map(({ category, items }) => (
        <li key={category} className="flex items-start gap-6">
          <span className="mt-1 text-green-400">✔</span>

          <h3 className="w-40 font-bold text-blue-300">{category}</h3>

          <ul className="flex flex-wrap text-gray-200">
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
      <p className="text-blue-300">
        {techStack.length} of {techStack.length} stacks loaded successfully (100%)
      </p>
      <p className="text-blue-300">Render time : 4ms</p>
      <span className="font-bold text-green-400">C:\Users\HP\Dipesh&gt;</span>
      <br />
    </div>
  </div>
);

export default Terminal;
