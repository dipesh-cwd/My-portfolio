import { ExternalLink as ExternalLinkIcon } from "lucide-react";

/**
 * Page/section titles. The page's single <h1> is the desktop welcome title (or the hero on the
 * phone layout), so content headings start at <h2>: rel=0 -> h2, rel=1 -> h3, rel=2 -> h4.
 */
export const Heading = ({ rel = 0, children, ...props }) => {
  const Element = `h${Math.min(2 + rel, 6)}`;
  return <Element {...props}>{children}</Element>;
};

/** Shared page wrapper so every content window looks consistent. */
export const WindowPage = ({ title, subtitle, children }) => (
  <div className="min-h-full bg-[var(--content-bg)] p-5 font-sans text-[var(--content-text)]">
    {title && (
      <div className="mb-4">
        <Heading className="text-xl font-semibold text-[var(--titlebar-text)]">{title}</Heading>
        {subtitle && <p className="mt-1 text-sm text-[var(--muted-text)]">{subtitle}</p>}
      </div>
    )}
    {children}
  </div>
);

export const Tag = ({ children }) => (
  <li className="rounded-full bg-blue-500/15 px-2 py-0.5 text-xs text-[var(--accent-text)]">
    {children}
  </li>
);

/** Link that opens in a new tab safely. */
export const ExternalLink = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer noopener"
    className="inline-flex items-center gap-1 text-[var(--accent-text)] underline-offset-2 hover:underline"
  >
    {children}
    <ExternalLinkIcon size={13} aria-hidden="true" />
  </a>
);
