import { useShallow } from "zustand/react/shallow";
import { useWindowStore } from "../../store/windowStore.js";
import WindowFrame from "./WindowFrame.jsx";

/** Renders one frame per open window. Add this once, near the root of the app. */
const WindowManager = () => {
  const ids = useWindowStore(useShallow((s) => Object.keys(s.windows)));

  return (
    <>
      {ids.map((id) => (
        <WindowFrame key={id} id={id} />
      ))}
    </>
  );
};

export default WindowManager;
