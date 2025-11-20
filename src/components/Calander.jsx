import React from "react";

const AvailableFromCalendar = ({ date }) => {
  // treat empty / sentinel values as not available
  if (!date || date === "0" || date === "0-0-0") {
    return (
      <div className="bg-[#d3d3d3] w-full h-[350px] rounded-[30px]  mx-auto shadow-md grid items-center justify-center">
        <p className="text-center text-[#d72638] text-[28px] font-medium">
          Not available
        </p>
      </div>
    );
  }

  // parse ISO string (e.g. 2025-11-19T00:00:00.000Z) or plain date string
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) {
    // fallback: try splitting common formats (e.g. "2025-11-19")
    const parts = String(date).split(/[-T]/).map(Number);
    if (parts.length >= 3 && parts.every((p) => !isNaN(p))) {
      const [year, month, day] = parts;
      parsed.setUTCFullYear(year, month - 1, day);
    }
  }

  if (isNaN(parsed.getTime())) {
    return (
      <div className="bg-[#d3d3d3] w-full h-[350px] rounded-[30px]  mx-auto shadow-md grid items-center justify-center">
        <p className="text-center text-[#d72638] text-[28px] font-medium">
          Not available
        </p>
      </div>
    );
  }

  // use UTC parts so timezone shifts don't change the intended date
  const year = parsed.getUTCFullYear();
  const month = parsed.getUTCMonth() + 1; // 1-12
  const day = parsed.getUTCDate();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = monthNames[month - 1] || "";

  const getDaysInMonth = (m, y) => {
    // m is 1-12, Date(year, month, 0) returns last day of given month
    return new Date(y, m, 0).getDate();
  };

  const totalDays = getDaysInMonth(month, year);
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  return (
    <div className="bg-[#d3d3d3] p-4 rounded-[30px] w-fit mx-auto shadow-md">
      <h2 className="text-[28px] text-center text-[#4b4b4b] font-medium">
        Available from
      </h2>
      <p className="text-center text-[#d72638] text-[20px] mt-[-5px] font-medium">
        {monthName} {year}
      </p>

      <div className="grid grid-cols-9 gap-4 mt-4">
        {days.map((d) => (
          <div
            key={d}
            className={`w-[40px] h-[40px] flex items-center justify-center rounded-full text-[14px]
              ${
                d >= day
                  ? "bg-[#464646] text-white"
                  : "text-[#1a1a1a] border-[1px] border-[#1a1a1a]"
              }`}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableFromCalendar;
