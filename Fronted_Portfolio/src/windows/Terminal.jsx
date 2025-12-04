import React from "react";
import windowWrapper from "../hoc/WindowWrapper.jsx";
import { techStack } from "../constants/Index.jsx";
import WindowControles from "../Components/WindowControles.jsx";

const Terminal = (props) => {
  return (
    <>
      <div 
      
      data-drag-handle
      className=" titlebar no-scrollbar flex justify-between items-center px-4 py-2 bg-[#1f1f1f] border-b border-gray-700 select-none cursor-grab"   onDoubleClick={props.onTitleDoubleClick}>
        <h2 className="text-sm">C:\Users\dipesh\TechStack</h2>

        <WindowControles target="skill" />
      </div>

      <div className="p-3 no-scrollbar overflow-auto h-[calc(100%-3rem)] text-[14px] leading-relaxed">
        <span className="font-bold text-green-400">C:\Users\HP\Dipesh\tech_stack</span>

        <br />

        <p className="text-blue-300">Loading tech stack...</p>
        <br />

        <div className="label flex gap-12 mb-4 ml-9 text-gray-300">
          <p className="w-32 font-semibold">Category</p>
          <p className="font-semibold">Technologies</p>
        </div>

        <ul className="content space-y-1 border-t border-dotted  border-b border-gray-600 pt-2 pb-2 ml-2">
          {techStack.map(({ category, items }) => (
            <li key={category} className="flex items-start gap-6 transition">
              <span className="text-green-400 mt-1">✔</span>

              <h3 className="w-40 font-bold text-blue-300">{category}</h3>

              <ul className="flex flex-wrap  text-gray-200">
                {items.map((item, i) => (
                  <li key={i} className="px-1">
                    {item} {i < items.length - 1 && ","}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <div className="footnote pt-1">
          <p className="text-blue-300">5 of 5 stacks loaded successfully (100%)</p>

          <p className="text-blue-300">Render time : 4ms</p>

          <span className="font-bold text-green-400">C:\Users\HP\Dipesh&gt;</span>

          <br />
        </div>
      </div>
    </>
  );
};

const TerminalWindow = windowWrapper(Terminal, "skill");

export default TerminalWindow;
