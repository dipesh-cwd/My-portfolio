import dayjs from "dayjs";
import { useEffect, useState } from "react";

/** Lives in its own component so the once-a-second tick only re-renders the clock. */
const Clock = () => {
  const [now, setNow] = useState(() => dayjs());

  useEffect(() => {
    const interval = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ml-4 flex cursor-pointer flex-col items-end rounded-md p-1 leading-tight transition hover:bg-gray-100">
      <p className="text-xs font-semibold text-black/80">{now.format("h:mm A")}</p>
      <p className="text-[10px] text-black/60">{now.format("ddd, MMM D")}</p>
    </div>
  );
};

export default Clock;
