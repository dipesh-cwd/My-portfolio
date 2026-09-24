import axe from "axe-core";

/**
 * Run axe-core on the current document and return readable violation lines.
 * color-contrast is skipped: jsdom has no layout/painting, so axe can't measure it.
 */
export const axeViolations = async (context = document.body) => {
  const { violations } = await axe.run(context, {
    rules: { "color-contrast": { enabled: false } },
  });
  return violations.map(
    (v) =>
      `${v.id} (${v.impact}): ${v.help}\n` +
      v.nodes.map((n) => `    ${n.html.slice(0, 140)}`).join("\n")
  );
};
