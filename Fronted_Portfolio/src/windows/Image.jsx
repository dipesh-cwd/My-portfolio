// import React from "react";
// import WindowControles from "../Components/WindowControles";
// import WindowWrapper from "../hoc/WindowWrapper.jsx";
// import { dummyImages } from "../constants/Index.jsx";
// import Masonry from "react-masonry-css";
// import ImageViewer from "./ImageViewer.jsx";
// import useImageStore from "../store/window.js";

// const Image = (props) => {
//   const breakpointColumnsObj = {
//     default: 3,
//     1024: 2,
//     640: 1,
//   };

//   const { openWindow, closeWindow, imageWindows } = useImageStore();

//   const toggleapp = (app) => {
//     if (!app.canOpen) return;
//     const window = imageWindows[app.id];
//     if (!window) {
//       return;
//     }

//     if (window.isOpen) {
//       closeWindow(app.id);
//     } else {
//       openWindow(app.id);
//     }
//   };

//   return (
//     <>
//       <div
//         data-drag-handle
//         className=" titlebar no-scrollbar flex justify-between items-center px-4 py-2 bg-[#1f1f1f] border-b border-gray-700 select-none cursor-grab"
//         onDoubleClick={props.onTitleDoubleClick}
//       >
//         <h2 className="text-sm">C:\Users\dipesh\gallery</h2>

//         <WindowControles target="photos" />
//       </div>

//       <div className="p-3 no-scrollbar overflow-auto h-[calc(100%-3rem)] ">
//         <Masonry
//           breakpointCols={breakpointColumnsObj}
//           className="flex gap-2"
//           columnClassName="flex flex-col gap-2"
//         >
//           {dummyImages.map((img, index, canOpen) => (
//             <div
//               key={img.id}
//               onClick={() => toggleapp(index, canOpen)}
//               className="rounded-md overflow-hidden cursor-pointer hover:scale-105 transition-transform"
//             >
//               <img src={img.src} alt={img.name} className="w-full h-auto object-cover" />
//             </div>
//           ))}
//         </Masonry>
//       </div>

//       {/* Image Viewer Window */}
//       {viewerOpen && (
//         <ImageViewer
//           images={dummyImages}
//           startIndex={startIndex}

//         />
//       )}
//     </>
//   );
// };

// const ImageWindow = WindowWrapper(Image, "photos");

// export default ImageWindow;

import React from "react";
import WindowControles from "../Components/WindowControles";
import WindowWrapper from "../hoc/WindowWrapper.jsx";
import { dummyImages } from "../constants/Index.jsx";
import Masonry from "react-masonry-css";
import { useImageStore } from "../store/window.js";

const Image = (props) => {
  const breakpointColumnsObj = {
    default: 3,
    1024: 2,
    640: 1,
  };

  // NEW STORE API
  const { openViewerInstance } = useImageStore();

  return (
    <>
      {/* TOP BAR */}
      <div
        data-drag-handle
        className="titlebar no-scrollbar flex justify-between items-center px-4 py-2 
        bg-[#1f1f1f] border-b border-gray-700 select-none cursor-grab"
        onDoubleClick={props.onTitleDoubleClick}
      >
        <h2 className="text-sm">C:\Users\dipesh\gallery</h2>
        <WindowControles target="photos" />
      </div>

      {/* GALLERY CONTENT */}
      <div className="p-3 no-scrollbar overflow-auto h-[calc(100%-3rem)]">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex gap-2"
          columnClassName="flex flex-col gap-2"
        >
          {dummyImages.map((img, index) => (
            <div
              key={img.id}
              onClick={() => openViewerInstance(dummyImages, index)}
              className="rounded-md overflow-hidden cursor-pointer hover:scale-105 
              transition-transform"
            >
              <img src={img.src} alt={img.name} className="w-full h-auto object-cover" />
            </div>
          ))}
        </Masonry>
      </div>
    </>
  );
};

const ImageWindow = WindowWrapper(Image, "photos");

export default ImageWindow;
