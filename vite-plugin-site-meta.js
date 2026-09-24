/**
 * Fills the site's public URL into index.html at build time.
 *
 * Open Graph / Twitter / canonical tags need ABSOLUTE URLs, but the URL isn't known until
 * you deploy. index.html uses the placeholder `__SITE_URL__`; this plugin
 *   - replaces it with the real URL when one is known, or
 *   - removes every <meta>/<link> tag that needs it (so no broken tags are published).
 */
const PLACEHOLDER = "__SITE_URL__";

const normalizeUrl = (value) => {
  const url = String(value ?? "")
    .trim()
    .replace(/\/+$/, "");
  return /^https?:\/\/[^\s"'<>]+$/.test(url) ? url : "";
};

export const applySiteUrl = (html, siteUrl) => {
  const base = normalizeUrl(siteUrl);
  if (base) return html.replaceAll(PLACEHOLDER, base);

  const tagsNeedingUrl = new RegExp(
    `<(?:meta|link)\\b[^>]*${PLACEHOLDER}[^>]*>[ \\t]*\\r?\\n?`,
    "g"
  );
  return html.replace(tagsNeedingUrl, "");
};

export default function siteMeta(siteUrl) {
  return {
    name: "site-meta",
    transformIndexHtml: {
      order: "pre",
      handler: (html) => applySiteUrl(html, siteUrl),
    },
  };
}
