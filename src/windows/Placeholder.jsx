import { APPS } from "../config/apps.js";

/** Shown for apps that don't have real content yet. */
const Placeholder = ({ appKey }) => (
  <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-gray-300">
    <p className="text-lg font-semibold text-blue-300">{APPS[appKey]?.title}</p>
    <p className="text-sm text-gray-400">This window is under construction.</p>
  </div>
);

export default Placeholder;
