import { describe, expect, it } from "vitest";
import siteMeta, { applySiteUrl } from "./vite-plugin-site-meta.js";

const html = `<head>
    <title>Hi</title>
    <link rel="canonical" href="__SITE_URL__/" />
    <meta property="og:image" content="__SITE_URL__/og-image.png" />
    <meta
      property="og:url"
      content="__SITE_URL__/"
    />
    <meta name="description" content="keep me" />
  </head>`;

describe("applySiteUrl", () => {
  it("fills in the URL everywhere", () => {
    const out = applySiteUrl(html, "https://me.vercel.app");
    expect(out).not.toContain("__SITE_URL__");
    expect(out).toContain('href="https://me.vercel.app/"');
    expect(out).toContain('content="https://me.vercel.app/og-image.png"');
  });

  it("ignores trailing slashes on the URL", () => {
    expect(applySiteUrl(html, "https://me.dev///")).toContain(
      'content="https://me.dev/og-image.png"'
    );
  });

  it.each([
    undefined,
    "",
    "   ",
    "me.vercel.app",
    "javascript:alert(1)",
    'https://x.com/"><script>',
  ])("drops every tag that needs the URL when it is missing or invalid (%s)", (value) => {
    const out = applySiteUrl(html, value);
    expect(out).not.toContain("__SITE_URL__");
    expect(out).not.toContain("canonical");
    expect(out).not.toContain("og:image");
    expect(out).not.toContain("og:url"); // the multi-line tag too
    // ...but everything else stays and the HTML is still well-formed
    expect(out).toContain("<title>Hi</title>");
    expect(out).toContain('content="keep me"');
    expect(out).not.toMatch(/<(meta|link)\b[^>]*$/m);
  });
});

describe("siteMeta plugin", () => {
  it("transforms index.html before other plugins", () => {
    const plugin = siteMeta("https://me.dev");
    expect(plugin.transformIndexHtml.order).toBe("pre");
    expect(plugin.transformIndexHtml.handler(html)).toContain("https://me.dev/og-image.png");
  });
});
