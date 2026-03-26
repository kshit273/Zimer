import React from "react";

const ZTRS = ({ percentage }) => {
  // SVG circle settings
  const size = 220; // diameter
  const strokeWidth = 15;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="w-full flex flex-col  items-center justify-center rounded-[20px] p-4 ">
      {/* Heading */}
      <h2 className="text-[24px] text-[#5c5c5c] font-medium text-left leading-6 mb-4">
        Zimer Tenant Reliability Score
      </h2>

      {/* Circular Progress */}
      <div className="relative flex items-center justify-center">
        <svg
          width={size}
          height={size}
          className="-rotate-90" // start from top
        >
          {/* Background circle */}
          <circle
            stroke="#e6e6e6"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff0077" />
              <stop offset="100%" stopColor="#7b00ff" />
            </linearGradient>
          </defs>
          {/* Foreground circle */}
          <circle
            stroke="url(#gradient)"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            r={radius}
            cx={size / 2}
            cy={size / 2}
            style={{ transition: "stroke-dashoffset 0.7s ease" }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-[#6b009c] text-[28px] font-semibold">ZTRS</span>
          <span className="text-[#9e9e9e] text-[32px] font-medium">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Bottom button */}
      <div className="w-full flex justify-end">
        <button className="mt-4 bg-[#e6e6e6] text-[#7c7c7c] px-4 py-1 rounded-full text-[12px] hover:bg-[#dcdcdc] transition">
          Know about RTRS ?
        </button>
      </div>
    </div>
  );
};

export default ZTRS;
