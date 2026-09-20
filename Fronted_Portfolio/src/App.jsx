import React from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
gsap.registerPlugin(Draggable);
import Navbar from "./Components/Nav/Navbar";
import Welcom from "./Components/Welcom";
import { Terminal, Image, ImageViewer } from "./windows/index.js";

const App = () => {
  return (
    <div>
      <Navbar />
      <Welcom />
      <Terminal />
      <Image />
      <ImageViewer />
    </div>
  );
};

export default App;
