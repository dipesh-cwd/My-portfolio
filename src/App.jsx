import BootScreen from "./components/desktop/BootScreen.jsx";
import ThemeEffect from "./components/desktop/ThemeEffect.jsx";
import Welcome from "./components/desktop/Welcome.jsx";
import MobileSite from "./components/mobile/MobileSite.jsx";
import Taskbar from "./components/taskbar/Taskbar.jsx";
import WindowManager from "./components/window/WindowManager.jsx";
import { MOBILE_QUERY } from "./config/layout.js";
import { useMediaQuery } from "./hooks/useMediaQuery.js";

/**
 * Desktop and tablet get the windowed "desktop"; phones get a simple scrolling page.
 * `boot` shows the short start-up splash (enabled in main.jsx, off by default for tests).
 */
const App = ({ boot = false }) => {
  const isMobile = useMediaQuery(MOBILE_QUERY);

  return (
    <>
      <ThemeEffect />
      {isMobile ? (
        <MobileSite />
      ) : (
        <>
          <Welcome />
          <WindowManager />
          <Taskbar />
        </>
      )}
      {boot && <BootScreen />}
    </>
  );
};

export default App;
