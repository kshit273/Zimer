// MonthlyRentStatus.jsx
import React from "react";

// Helpers
const hexToRgb = (hex) => {
  const bigint = parseInt(hex.replace("#", ""), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
};

const interpolateColor = (color1, color2, factor) => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  const result = rgb1.map((c, i) => Math.round(c + factor * (rgb2[i] - c)));
  return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
};

const daysInMonth = (year, monthIndex) =>
  new Date(year, monthIndex + 1, 0).getDate();

/**
 * Color for current month based on days since the most recent cycle start
 */
const getColorFromStartCycle = (start) => {
  const green = "#61C428";
  const yellow = "#dfdf1a";
  const red = "#d72638";

  const today = new Date();
  const startDate = new Date(start);
  if (isNaN(startDate)) return "#d9d9d9";

  const anchorDay = startDate.getDate();
  const y = today.getFullYear();
  const m = today.getMonth();

  const dimCurrent = daysInMonth(y, m);
  const currentAnchor = new Date(y, m, Math.min(anchorDay, dimCurrent));

  let cycleStart;
  if (currentAnchor <= today) {
    cycleStart = currentAnchor;
  } else {
    const prevY = m === 0 ? y - 1 : y;
    const prevM = m === 0 ? 11 : m - 1;
    const dimPrev = daysInMonth(prevY, prevM);
    cycleStart = new Date(prevY, prevM, Math.min(anchorDay, dimPrev));
  }

  const msPerDay = 24 * 60 * 60 * 1000;
  const daysPassed = Math.floor((today - cycleStart) / msPerDay);

  if (daysPassed <= 15) {
    const factor = daysPassed / 15;
    return interpolateColor(green, yellow, factor);
  } else if (daysPassed <= 30) {
    const factor = (daysPassed - 15) / 15;
    return interpolateColor(yellow, red, factor);
  } else {
    return red;
  }
};

const MonthlyRentStatus = ({ start, paidMonths, residingPG }) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const startMonth = new Date(start).getMonth();

  const months = [
    "jan", "feb", "mar", "apr", "may", "jun",
    "jul", "aug", "sep", "oct", "nov", "dec",
  ];

  return (
    <div className={`p-4 bg-[#e2e2e2] rounded-[20px] max-w-sm ${!residingPG ? `blur pointer-events-none` : ``}`}>
      <p className="font-medium text-[24px] text-[#5c5c5c] mb-4">
        Monthly rent status
      </p>
      <div className="grid grid-cols-4 gap-3">
        {months.map((month, index) => {
          const isCurrentMonth = index === currentMonth;
          const isPaid = paidMonths.includes(index);

          let bgColor = "#d9d9d9";
          let textColor = "#444";

          if (isPaid) {
            bgColor = "#61C428";
            textColor = "#e8e8e8";
          } else if (isCurrentMonth) {
            bgColor = getColorFromStartCycle(start);
            textColor = "#e8e8e8";
          } else if (index >= startMonth && index < currentMonth) {
            bgColor = "#d72638";
            textColor = "#e8e8e8";
          }

          return (
            <div
              key={month}
              className="w-[75px] h-[75px] rounded-[12px] flex items-center justify-center font-normal capitalize cursor-default"
              style={{ backgroundColor: bgColor, color: textColor }}
            >
              {month}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthlyRentStatus;