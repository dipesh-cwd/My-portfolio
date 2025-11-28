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
  { id: "Portfolio", name: "Portfolio", icon: "portfolio.png", canOpen: true },
  { id: "photos", name: "Gallery", icon: "gallery.png", canOpen: true },
  { id: "contact", name: "Contact", icon: "contact.png", canOpen: true },
  { id: "skill", name: "Skill", icon: "skill.png", canOpen: true },
  { id: "education", name: "Education", icon: "education.png", canOpen: true },
  { id: "cv", name: "CV", icon: "cv.png", canOpen: true },
  { id: "archive", name: "Archive", icon: "archive.png", canOpen: true },
];

export {dockApps, nav_btn, icons, iconMap };
