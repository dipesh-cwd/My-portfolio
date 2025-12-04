import React from "react";
import { gsap } from "gsap"; 
import { Draggable } from "gsap/Draggable";
gsap.registerPlugin(Draggable);
import Navbar from "./Components/Nav/Navbar";
import Welcom from "./Components/Welcom";
import { Terminal } from "./windows/index.js";

const App = () => {
  return (
    <div>
      <Navbar />
      <Welcom />
      <Terminal />
    </div>
  );
};

export default App;
