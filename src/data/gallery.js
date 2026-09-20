// Placeholder gallery: files live in /public (image1.jpg ... image10.jpg).
// Replace `description` (and the files) with your real photos.
export const galleryImages = Array.from({ length: 10 }, (_, i) => ({
  id: `image${i + 1}`,
  name: `image${i + 1}.jpg`,
  src: `image${i + 1}.jpg`,
  description: "This is my image.",
}));
