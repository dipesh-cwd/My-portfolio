import { galleryImages } from "../../data/gallery.js";
import { useTranslation } from "../../i18n/index.js";
import { asset } from "../../lib/assets.js";
import { WindowPage } from "../../windows/ui.jsx";

/** Phone version of the gallery: a simple grid; tapping a photo opens it full size. */
const MobileGallery = () => {
  const t = useTranslation();

  return (
    <WindowPage title={t("apps.photos")}>
      <ul className="grid grid-cols-2 gap-2">
        {galleryImages.map((img) => (
          <li key={img.id}>
            <a
              href={asset(img.src)}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={t("gallery.openFullSize", { name: img.name })}
              className="block overflow-hidden rounded-md"
            >
              <img
                src={asset(img.src)}
                alt={img.description ?? img.name}
                loading="lazy"
                decoding="async"
                className="h-auto w-full object-cover"
              />
            </a>
          </li>
        ))}
      </ul>
    </WindowPage>
  );
};

export default MobileGallery;
