import BootScreen from "./components/desktop/BootScreen.jsx";
import Welcome from "./components/desktop/Welcome.jsx";
import Taskbar from "./components/taskbar/Taskbar.jsx";
import WindowManager from "./components/window/WindowManager.jsx";

/** `boot` shows the short start-up splash (enabled in main.jsx, off by default for tests). */
const App = ({ boot = false }) => (
  <>
    <Welcome />
    <WindowManager />
    <Taskbar />
    {boot && <BootScreen />}
  </>
);

export default App;
