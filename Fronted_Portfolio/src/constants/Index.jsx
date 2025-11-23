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

export { nav_btn, icons, iconMap };
