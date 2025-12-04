import { Wifi, Search, Earth, User, Lightbulb } from "lucide-react";
const nav_btn = [
  { id: 1, name: "Projects" },
  { id: 2, name: "Skills" },
  { id: 3, name: "About" },
  { id: 4, name: "Contact" },
];
const iconMap = {
  Search: Search,
  Wifi: Wifi,
  Earth: Earth,
  User: User,
  Lightbulb: Lightbulb,
};
const icons = [
  { id: 2, icon: "Search" },
  { id: 3, icon: "Wifi" },

  { id: 4, icon: "Earth" },
  { id: 5, icon: "User" },
  { id: 6, icon: "Lightbulb" },
];

const dockApps = [
  { id: "portfolio", name: "Portfolio", icon: "portfolio.png", canOpen: true },
  { id: "photos", name: "Gallery", icon: "gallery.png", canOpen: true },
  { id: "contact", name: "Contact", icon: "contact.png", canOpen: true },
  { id: "skill", name: "Skill", icon: "cmd.png", canOpen: true },
  { id: "education", name: "Education", icon: "education.png", canOpen: true },
  { id: "cv", name: "CV", icon: "cv.png", canOpen: true },
  { id: "archive", name: "Archive", icon: "archive.png", canOpen: true },
];





const INITIAL_Z_INDEX = 1000;
const FIXED_MIN_WIDTH = 440;
const FIXED_MIN_HEIGHT = 360;

const WINDOW_CONFIG = {
  portfolio: { isOpen : false, zIndex: INITIAL_Z_INDEX, data:null },
  photos: { isOpen : false, zIndex: INITIAL_Z_INDEX, data:null },
  contact: { isOpen : false, zIndex: INITIAL_Z_INDEX, data:null },








  // skill: { isOpen : false, zIndex: INITIAL_Z_INDEX, data:null },


skill: {
    isOpen: false,
    zIndex: INITIAL_Z_INDEX,
    x: window.innerWidth / 2 - 325,   
    y: window.innerHeight / 2 - 210,
    width: 650,
    height: 420,
    isMaximized: false,
    prev: null,
    data: null
  },











  education: { isOpen : false, zIndex: INITIAL_Z_INDEX, data:null },
  cv: { isOpen : false, zIndex: INITIAL_Z_INDEX, data:null },
  archive: { isOpen : false, zIndex: INITIAL_Z_INDEX, data:null },
};  




const techStack = [
  {
    category: "Frontend", 
    items : ["HTML", "JavaScript", "React.js"]
  },
  
  {
    category: "Backend", 
    items : ["Node.js", "Express.js"]
  },

  {
    category: "Database", 
    items : ["MongoDB", "MySQL"]
  },

  {
    category: "Version Control", 
    items : ["Git", "GitHub"]
  },  
  {
    category: "Styling", 
    items : ["CSS", "Tailwind CSS"]
  },  
];



export {dockApps, nav_btn, icons, iconMap, WINDOW_CONFIG, INITIAL_Z_INDEX,techStack,FIXED_MIN_WIDTH,FIXED_MIN_HEIGHT};
