/**
 * Build a URL for a file in /public that keeps working if the app is deployed under a
 * sub-path (e.g. GitHub Pages: https://user.github.io/repo/). Never hardcode "/file.png".
 */
export const asset = (path) => `${import.meta.env.BASE_URL}${String(path).replace(/^\/+/, "")}`;
