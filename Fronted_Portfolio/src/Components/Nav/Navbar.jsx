import { ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { icons, iconMap } from "../../constants/Index.jsx";
const Navbar = () => {
  const [footerOpen, setFooterOpen] = useState(false);

  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(dayjs()); // update the time every second
    }, 1000); // 1000ms = 1 second

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  return (
    <>
      <div
        className={`fixed left-0 w-full bg-white/50 backdrop-blur-3xl
    transition-all duration-500 ease-in-out z-0
    ${footerOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-00"}`}
        style={{ bottom: "40px", height: "256px" }}
      >
        <div
          onClick={() => setFooterOpen((p) => !p)}
          className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-3/3 z-0
    px-5 rounded-t-xl cursor-pointer select-none bg-white/50 backdrop-blur-3xl 
    hover:bg-white/65
    transition-all ease-in-out duration-200 hover:scale-105"
        >
          <div
            className={`transform transition-transform duration-300 ${
              footerOpen ? "rotate-180" : "rotate-0"
            }`}
          >
            <ChevronUp
              size={20}
              className="text-black/70 transition-colors duration-200 hover:text-black/90"
            />
          </div>
        </div>
      </div>

      <nav
        className="fixed bottom-0 left-0 w-full flex justify-between items-center
        bg-white/50 backdrop-blur-3xl px-5 py-2 select-none z-30 h-10"
      >
        <div className="flex items-center gap-2">
          <img src="web_logo.png" alt="logo" className="w-7 h-7" />
          <p className="font-semibold text-sm tracking-wide">Dipesh's Portfolio</p>
        </div>

        <div className="flex items-center gap-2">
          {icons.map(({ id, icon }) => {
            const IconComponent = iconMap[icon];
            return (
              <div
                key={id}
                className="p-2 rounded-full  transition-all
                 hover:shadow-md hover:scale-120 hover:bg-gray-100/50 duration-200 cursor-pointer "
              >
                <IconComponent className="w-3.5 h-3.5 text-black" />
              </div>
            );
          })}

          <div className="ml-4 flex flex-col items-end leading-tight hover:bg-gray-100 p-1 rounded-md cursor-pointer transition">
            <p className="text-xs font-semibold text-black/80">{now.format("h:mm A")}</p>
            <p className="text-[10px] text-black/60">{now.format("ddd, MMM D")}</p>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
