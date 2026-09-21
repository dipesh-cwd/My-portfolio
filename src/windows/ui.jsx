import { ExternalLink as ExternalLinkIcon } from "lucide-react";

/** Shared page wrapper so every content window looks consistent. */
export const WindowPage = ({ title, subtitle, children }) => (
  <div className="min-h-full bg-[#1e1e1e] p-5 font-sans text-gray-200">
    {title && (
      <header className="mb-4">
        <h1 className="text-xl font-semibold text-white">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
      </header>
    )}
    {children}
  </div>
);

export const Tag = ({ children }) => (
  <li className="rounded-full bg-blue-500/15 px-2 py-0.5 text-xs text-blue-300">{children}</li>
);

/** Link that opens in a new tab safely. */
export const ExternalLink = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer noopener"
    className="inline-flex items-center gap-1 text-blue-300 underline-offset-2 hover:underline"
  >
    {children}
    <ExternalLinkIcon size={13} aria-hidden="true" />
  </a>
);
