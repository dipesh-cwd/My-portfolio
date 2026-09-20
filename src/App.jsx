import Welcome from "./components/desktop/Welcome.jsx";
import Taskbar from "./components/taskbar/Taskbar.jsx";
import WindowManager from "./components/window/WindowManager.jsx";

const App = () => (
  <>
    <Welcome />
    <WindowManager />
    <Taskbar />
  </>
);

export default App;
