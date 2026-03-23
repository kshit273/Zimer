import { useEffect, useState } from "react";
import BRNotification from "./BRNotification";
import JRNotification from "./JRNotification";
import LRNotification from "./LRNotification";

// Accent colours per heading type
const TYPE_COLOR = {
  Booking: "text-[#c8f135]  border-[#c8f135]/20  bg-[#c8f135]/5",
  Join:    "text-[#4ade80]  border-[#4ade80]/20  bg-[#4ade80]/5",
  Leave:   "text-[#f87171]  border-[#f87171]/20  bg-[#f87171]/5",
};
const BADGE_COLOR = {
  Booking: "bg-[#c8f135]  text-[#0a0a0a]",
  Join:    "bg-[#4ade80]  text-[#0a0a0a]",
  Leave:   "bg-[#f87171]  text-[#0a0a0a]",
};
const DOT_COLOR = {
  Booking: "bg-[#c8f135]",
  Join:    "bg-[#4ade80]",
  Leave:   "bg-[#f87171]",
};

const DropdownComp = ({ heading, data }) => {
  const [open, setOpen]     = useState(false);
  const [isRead, setIsRead] = useState(false);

  const unreadCount = Array.isArray(data) ? data.length : 0;

  useEffect(() => {
    if (unreadCount < 1) setIsRead(true);
  }, [unreadCount]);

  const handleToggle = () => {
    setOpen((prev) => !prev);
    setIsRead(true);
  };

  const handleJoinRequestAccept  = () => {};
  const handleJoinRequestReject  = () => {};
  const handleLeaveRequestAccept = () => {};
  const handleLeaveRequestReject = () => {};

  const accentClass = TYPE_COLOR[heading]  || TYPE_COLOR.Booking;
  const badgeClass  = BADGE_COLOR[heading] || BADGE_COLOR.Booking;
  const dotClass    = DOT_COLOR[heading]   || DOT_COLOR.Booking;

  return (
    <div className={`font-dm-mono border rounded-xl overflow-hidden transition-all duration-300 ${accentClass}`}>

      {/* Header row — always visible */}
      <button
        onClick={handleToggle}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-white/[0.02] transition-colors duration-200"
      >
        {/* Dot */}
        <span className={`flex-shrink-0 block w-2.5 h-2.5 rounded-full ${dotClass} ${!isRead ? "animate-pulse" : "opacity-30"}`} />

        {/* Labels */}
        <div className="flex-1 min-w-0">
          <p className="text-[0.85rem] font-medium tracking-[0.1em] text-[#e8e8e0] uppercase">
            {heading} requests
          </p>
          <p className="text-[0.75rem] text-[#555550] mt-0.5">
            {!isRead
              ? `${unreadCount} pending request${unreadCount !== 1 ? "s" : ""}`
              : `No pending ${heading.toLowerCase()} requests`}
          </p>
        </div>

        {/* Unread badge */}
        {!isRead && unreadCount > 0 && (
          <span className={`flex-shrink-0 text-[0.8rem] font-medium w-6 h-6 rounded-full flex items-center justify-center ${badgeClass}`}>
            {unreadCount}
          </span>
        )}

        {/* Chevron */}
        <span className={`flex-shrink-0 text-[#555550] text-xl transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}>
          ▾
        </span>
      </button>

      {/* Expanded items */}
      {open && (
        <div className="border-t border-[#1f1f1f] flex flex-col gap-2 p-3 bg-[#0a0a0a]/40">
          {heading === "Booking" &&
            data.map((item, i) => (
              <BRNotification key={i}
                name={item.name} contact={item.contact} email={item.email}
                reqTime={item.reqTime} RID={item.RID} pgName={item.pgName}
              />
            ))}
          {heading === "Join" &&
            data.map((item, i) => (
              <JRNotification key={i} data={item}
                onAccept={handleJoinRequestAccept} onReject={handleJoinRequestReject}
              />
            ))}
          {heading === "Leave" &&
            data.map((item, i) => (
              <LRNotification key={i} data={item}
                onAccept={handleLeaveRequestAccept} onReject={handleLeaveRequestReject}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default DropdownComp;