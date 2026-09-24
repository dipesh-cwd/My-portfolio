import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { useTranslation } from "../i18n/index.js";
import { asset } from "../lib/assets.js";
import { useWindowStore } from "../store/windowStore.js";

const navButtonClass =
  "absolute top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/50 p-2 text-white hover:bg-black/80";

/** Content of an "image viewer" window. `data` is { images, index }. */
const ImageViewer = ({ windowId, data }) => {
  const t = useTranslation();
  const updateWindowData = useWindowStore((s) => s.updateWindowData);
  const rootRef = useRef(null);

  const images = data?.images ?? [];
  const index = data?.index ?? 0;
  const image = images[index];

  // Focus the viewer when it opens so the arrow keys work immediately.
  useEffect(() => {
    rootRef.current?.focus();
  }, []);

  if (!image) {
    return <p className="p-4 text-sm text-gray-400">{t("gallery.empty")}</p>;
  }

  const goTo = (next) => {
    updateWindowData(windowId, { index: (next + images.length) % images.length });
  };

  const onKeyDown = (event) => {
    if (event.key === "ArrowLeft") goTo(index - 1);
    if (event.key === "ArrowRight") goTo(index + 1);
  };

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="relative flex h-full w-full items-center justify-center bg-black outline-none"
    >
      <img
        src={asset(image.src)}
        alt={image.description ?? image.name}
        draggable={false}
        className="max-h-full max-w-full object-contain"
      />

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label={t("gallery.prev")}
            className={`${navButtonClass} left-2`}
            onClick={() => goTo(index - 1)}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            aria-label={t("gallery.next")}
            className={`${navButtonClass} right-2`}
            onClick={() => goTo(index + 1)}
          >
            <ChevronRight size={20} />
          </button>
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded bg-black/60 px-2 py-0.5 text-xs text-gray-200">
            {index + 1} / {images.length}
          </span>
        </>
      )}
    </div>
  );
};

export default ImageViewer;
