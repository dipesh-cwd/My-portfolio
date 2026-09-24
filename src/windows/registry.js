import Archive from "./Archive.jsx";
import Contact from "./Contact.jsx";
import Cv from "./Cv.jsx";
import Education from "./Education.jsx";
import Gallery from "./Gallery.jsx";
import ImageViewer from "./ImageViewer.jsx";
import Me from "./Me.jsx";
import Projects from "./Projects.jsx";
import Settings from "./Settings.jsx";
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
  projects: Projects,
  photos: Gallery,
  contact: Contact,
  skill: Terminal,
  education: Education,
  cv: Cv,
  archive: Archive,
  settings: Settings,
  me: Me,
  viewer: ImageViewer,
};
