import { Copy, Minus, Square, X } from "lucide-react";
import { useTranslation } from "../../i18n/index.js";
import { useWindowStore } from "../../store/windowStore.js";

const buttonClass =
  "flex h-6 w-10 cursor-pointer items-center justify-center rounded-sm text-[var(--titlebar-text)] opacity-80 hover:bg-black/10 hover:opacity-100";

const WindowControls = ({ id }) => {
  const t = useTranslation();
  const isMaximized = useWindowStore((s) => s.windows[id]?.isMaximized ?? false);
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
  const toggleMaximize = useWindowStore((s) => s.toggleMaximize);
  const closeWindow = useWindowStore((s) => s.closeWindow);

  return (
    <div className="flex items-center space-x-1">
      <button
        type="button"
        aria-label={t("window.minimize")}
        className={buttonClass}
        onClick={() => minimizeWindow(id)}
      >
        <Minus size={14} />
      </button>
      <button
        type="button"
        aria-label={isMaximized ? t("window.restore") : t("window.maximize")}
        className={buttonClass}
        onClick={() => toggleMaximize(id)}
      >
        {isMaximized ? <Copy size={12} /> : <Square size={12} />}
      </button>
      <button
        type="button"
        aria-label={t("window.close")}
        className="flex h-6 w-10 cursor-pointer items-center justify-center rounded-sm bg-red-600 text-white hover:bg-red-700"
        onClick={() => closeWindow(id)}
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default WindowControls;
