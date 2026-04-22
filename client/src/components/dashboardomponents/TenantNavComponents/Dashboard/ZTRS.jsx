import React, { useState } from "react";

const ZTRS = ({ finalScore, timeline = [], loading }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Convert finalScore (1-5) to percentage (0-100)
  const percentage = finalScore != null ? (finalScore / 5) * 100 : 0;
  const hasData = finalScore != null;

  // SVG circle settings
  const size = 200;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  // Score color based on value
  const getScoreGradient = () => {
    if (!hasData) return { start: "#9ca3af", end: "#6b7280" };
    if (finalScore >= 4) return { start: "#00d2ff", end: "#7b2ff7" };
    if (finalScore >= 3) return { start: "#f7971e", end: "#ffd200" };
    return { start: "#ff416c", end: "#ff4b2b" };
  };

  const gradient = getScoreGradient();

  // Score label
  const getScoreLabel = () => {
    if (!hasData) return "N/A";
    if (finalScore >= 4.5) return "Excellent";
    if (finalScore >= 3.5) return "Good";
    if (finalScore >= 2.5) return "Average";
    return "Needs Improvement";
  };

  // Timeline ZTRS color badge
  const getZtrsColor = (score) => {
    if (score >= 4) return { bg: "rgba(16, 185, 129, 0.15)", text: "#10b981", border: "rgba(16, 185, 129, 0.3)" };
    if (score >= 3) return { bg: "rgba(245, 158, 11, 0.15)", text: "#f59e0b", border: "rgba(245, 158, 11, 0.3)" };
    return { bg: "rgba(239, 68, 68, 0.15)", text: "#ef4444", border: "rgba(239, 68, 68, 0.3)" };
  };

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center rounded-2xl p-5 box-border">
        <div className="flex flex-col items-center justify-center gap-3 w-full h-full rounded-2xl p-5">
          <div className="w-9 h-9 border-[3px] border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          <span className="text-base text-gray-400 font-medium">Loading ZTRS...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full cursor-pointer"
      style={{ perspective: "1200px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="w-full h-full relative transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* ====== FRONT FACE ====== */}
        <div
          className="absolute w-full h-full"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
          onClick={() => hasData && timeline.length > 0 && setIsFlipped(true)}
        >
          <div className="w-full h-full flex flex-col items-center justify-center rounded-2xl p-5 box-border relative overflow-hidden">
            {/* Header */}
            <h2 className="text-xl text-gray-600 font-medium text-center mb-3 tracking-wide flex items-center gap-1.5">
              <span className="text-lg text-[#d72638]">◈</span>
              ZTRS
            </h2>

            {/* Circular Progress */}
            <div className="relative flex items-center justify-center">
              <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
                <defs>
                  <linearGradient id="ztrs-gradient" x1="1" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={gradient.start} />
                    <stop offset="100%" stopColor={gradient.end} />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {/* Background circle */}
                <circle
                  stroke="rgba(200, 200, 210, 0.25)"
                  fill="transparent"
                  strokeWidth={strokeWidth}
                  r={radius}
                  cx={size / 2}
                  cy={size / 2}
                />
                {/* Foreground circle */}
                {hasData && (
                  <circle
                    stroke="url(#ztrs-gradient)"
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    filter="url(#glow)"
                    style={{
                      transition: "stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />
                )}
              </svg>

              {/* Center content */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-sm font-bold text-[#777777] tracking-[3px] uppercase mb-0.5">ZTRS</span>
                <span
                  className="text-4xl font-bold leading-tight"
                  style={{
                    background: hasData
                      ? `linear-gradient(135deg, ${gradient.start}, ${gradient.end})`
                      : "#9ca3af",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {hasData ? `${finalScore.toFixed(1)}` : "—"}
                </span>
                <span className="text-sm text-[#777777] font-medium mt-0.5">{hasData ? "/ 5.0" : ""}</span>
              </div>
            </div>

            {/* Score Label */}
            <div className="mt-3 px-4 py-1 rounded-full bg-[#777777]">
              <span
                className="text-medium font-medium tracking-wide"
                style={{ color: hasData ? gradient.end : "#9ca3af" }}
              >
                {getScoreLabel()}
              </span>
            </div>

            {/* Hover hint */}
            <div
              className="absolute bottom-4 left-0 right-0 text-center text-sm text-[#d72638] font-medium transition-all duration-300 pointer-events-none"
              style={{
                opacity: isHovered && hasData && timeline.length > 0 ? 1 : 0,
                transform: isHovered && hasData && timeline.length > 0
                  ? "translateY(0)"
                  : "translateY(8px)",
              }}
            >
              <span className="inline-block mr-1 text-base">↻</span> Click to see timeline
            </div>
          </div>
        </div>

        {/* ====== BACK FACE ====== */}
        <div
          className="absolute w-full h-full"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
          onClick={() => setIsFlipped(false)}
        >
          <div className="w-full h-full flex flex-col items-center justify-center rounded-2xl p-5 box-border relative overflow-hidden">
            {/* Back Header */}
            <div className="w-full flex items-center justify-between mb-3 shrink-0">
              <h2 className="text-lg text-gray-600 font-semibold m-0 flex items-center gap-1.5">
                <span className="text-base text-[#d72638]">◷</span>
                ZTRS Timeline
              </h2>
              <button
                className="w-7 h-7 rounded-full border-none bg-black/5 text-gray-500 text-sm cursor-pointer flex items-center justify-center transition-all duration-200 shrink-0 hover:bg-purple-100 hover:text-purple-600"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
              >
                ✕
              </button>
            </div>

            {/* Timeline List */}
            <div
              className="flex-1 w-full overflow-y-auto overflow-x-hidden pr-1"
              style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(123,47,247,0.2) transparent" }}
            >
              {timeline.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-2">
                  <span className="text-4xl opacity-50">📋</span>
                  <p className="text-base text-gray-400 font-medium">No timeline entries yet</p>
                </div>
              ) : (
                timeline.map((entry, idx) => {
                  const colors = getZtrsColor(entry.ztrs);
                  return (
                    <div key={idx} className="flex gap-3 mb-1">
                      {/* Timeline connector */}
                      <div className="flex flex-col items-center shrink-0 w-4">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0 mt-1"
                          style={{
                            background: `linear-gradient(135deg, ${colors.text}, ${colors.text}dd)`,
                            boxShadow: `0 0 8px ${colors.text}44`,
                          }}
                        />
                        {idx < timeline.length - 1 && (
                          <div
                            className="w-0.5 flex-1 mt-1 rounded-sm min-h-[16px]"
                            style={{
                              background: "linear-gradient(to bottom, rgba(123,47,247,0.2), rgba(123,47,247,0.05))",
                            }}
                          />
                        )}
                      </div>

                      {/* Entry content */}
                      <div className="flex-1 pb-3.5 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-base font-semibold text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap">
                            {entry.pgName}
                          </span>
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded-lg shrink-0"
                            style={{
                              background: colors.bg,
                              color: colors.text,
                              border: `1px solid ${colors.border}`,
                            }}
                          >
                            {entry.ztrs}/5
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 m-0 leading-relaxed break-words">{entry.reason}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Back footer hint */}
            <div className="w-full text-center pt-2 shrink-0">
              <span className="text-xs text-gray-400 font-medium">Click anywhere to flip back</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZTRS;
