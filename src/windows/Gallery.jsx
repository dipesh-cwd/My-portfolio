import Masonry from "react-masonry-css";
import { galleryImages } from "../data/gallery.js";
import { asset } from "../lib/assets.js";
import { useWindowStore } from "../store/windowStore.js";

const BREAKPOINTS = { default: 3, 1024: 2, 640: 1 };

const Gallery = () => {
  const openApp = useWindowStore((s) => s.openApp);

  return (
    <div className="p-3">
      <Masonry
        breakpointCols={BREAKPOINTS}
        className="flex gap-2"
        columnClassName="flex flex-col gap-2"
      >
        {galleryImages.map((img, index) => (
          <button
            key={img.id}
            type="button"
            aria-label={`Open ${img.name}`}
            onClick={() => openApp("viewer", { images: galleryImages, index })}
            className="block cursor-pointer overflow-hidden rounded-md transition-transform hover:scale-105"
          >
            <img
              src={asset(img.src)}
              alt={img.name}
              loading="lazy"
              className="h-auto w-full object-cover"
            />
          </button>
        ))}
      </Masonry>
    </div>
  );
};

export default Gallery;
