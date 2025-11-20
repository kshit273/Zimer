import React from "react";

const PlanDetails = ({ months = 11, days = 25, searches = 8175 }) => {
  // SVG circle settings
  const size = 250;
  const strokeWidth = 13;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="bg-[#E2E2E2] rounded-[30px] p-6 flex flex-col gap-2 w-full mt-4">
      {/* Top Row */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-[28px] font-medium text-[#5c5c5c]">
          Popular Plan
        </span>
        <button className="bg-[#e6e6e6] text-[#7c7c7c] px-4 py-1 rounded-full text-[12px] hover:bg-[#dcdcdc] transition">
          View contract details
        </button>
      </div>
      {/* Main Content */}
      <div className="flex items-center gap-12">
        {/* Circular Progress */}
        <div className="relative flex items-center justify-center">
          <svg width={size} height={size} className="-rotate-90">
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
              <linearGradient id="plan-gradient" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff0077" />
                <stop offset="100%" stopColor="#7b00ff" />
              </linearGradient>
            </defs>
            {/* Foreground circle (full, for border effect) */}
            <circle
              stroke="url(#plan-gradient)"
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={0}
              r={radius}
              cx={size / 2}
              cy={size / 2}
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[#7b00ff] text-[22px] font-medium">
              {months} months {days}
            </span>
            <span className="text-[#7b00ff] text-[22px] font-medium">
              days remaining
            </span>
          </div>
        </div>
        {/* Right Section */}
        <div className="flex flex-col justify-center ml-2">
          <span className="text-[#5c5c5c] text-[32px] font-medium">
            You appeared in
          </span>
          <span className="text-[#38d430] text-[40px] font-semibold leading-tight">
            {searches}
          </span>
          <span className="text-[#5c5c5c] text-[32px] font-medium">
            more searches
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlanDetails;
