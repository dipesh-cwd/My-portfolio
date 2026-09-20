import Gallery from "./Gallery.jsx";
import ImageViewer from "./ImageViewer.jsx";
import Terminal from "./Terminal.jsx";

/**
 * appKey -> component shown inside that app's window.
 *
 * To add a window: 1) add the app to src/config/apps.js, 2) build its component,
 * 3) register it here. Apps without an entry fall back to <Placeholder />.
 *
 * Every component receives { windowId, appKey, data }.
 */
export const WINDOW_COMPONENTS = {
  skill: Terminal,
  photos: Gallery,
  viewer: ImageViewer,
};
