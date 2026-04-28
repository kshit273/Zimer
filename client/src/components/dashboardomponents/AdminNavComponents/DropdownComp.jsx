import { useEffect, useState } from "react";
import BRNotification from "./BRNotification";
import JRNotification from "./JRNotification";
import LRNotification from "./LRNotification";
import AdminCPRNotification from "./AdminCPRNotification";
import AdminNotification from "./AdminNotification";

// Accent colours per heading type
const TYPE_COLOR = {
  Booking: "text-[#c8f135]  border-[#c8f135]/20  bg-[#c8f135]/5",
  Join:    "text-[#4ade80]  border-[#4ade80]/20  bg-[#4ade80]/5",
  Leave:   "text-[#f87171]  border-[#f87171]/20  bg-[#f87171]/5",
  General:   "text-[#800080]  border-[#800080]/20  bg-[#800080]/5",
  Requests:   "text-[#3b82f6]  border-[#3b82f6]/20  bg-[#3b82f6]/5",
  Notifications:   "text-[#eab308]  border-[#eab308]/20  bg-[#eab308]/5",
};
const BADGE_COLOR = {
  Booking: "bg-[#c8f135]  text-[#0a0a0a]",
  Join:    "bg-[#4ade80]  text-[#0a0a0a]",
  Leave:   "bg-[#f87171]  text-[#0a0a0a]",
  General:   "bg-[#800080]  text-[#0a0a0a]",
  Requests:  "bg-[#3b82f6]  text-[#0a0a0a]",
  Notifications: "bg-[#eab308]  text-[#0a0a0a]",
};
const DOT_COLOR = {
  Booking: "bg-[#c8f135]",
  Join:    "bg-[#4ade80]",
  Leave:   "bg-[#f87171]",
  General:   "bg-[#800080]",
  Requests:  "bg-[#3b82f6]",
  Notifications: "bg-[#eab308]",
};

const DropdownComp = ({ heading, data, onBRResponse, onZTRSSubmit, onNotificationRead }) => {
  const [open, setOpen]     = useState(false);
  const [isRead, setIsRead] = useState(false);

  const unreadCount = Array.isArray(data)
  ? heading === "Booking"
    ? data.filter((item) => item.resTime === null).length  
    : (heading === "PG create" || heading === "Join")
    ? data.filter((item) => item.status !== "accepted").length
    : data.length
  : 0;

  useEffect(() => {
  if (unreadCount < 1) setIsRead(true);
  else setIsRead(false); 
}, [unreadCount]);

const handleToggle = () => {
  setOpen((prev) => !prev);
  if (heading !== "Booking") {
    setIsRead(true); 
  }
};


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
            {heading === "Notifications" ? heading : `${heading} requests`}
          </p>
          <p className="text-[0.75rem] text-[#555550] mt-0.5">
            {heading === "Booking"
              ? unreadCount > 0
                ? `${unreadCount} awaiting response`
                : `All requests responded`
              : !isRead
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
                name={`${item.sender.firstName} ${item.sender.lastName}`} contact={item.senderContact} email={item.senderEmail} brId={item._id} resTime={item.resTime} onBRResponse={onBRResponse}
                reqTime={new Date(item.reqTime).toLocaleString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        day: "2-digit",
        month: "short",
        year: "numeric",
      })} RID={item.RID} pgName={item.pgName}
              />
            ))}
          {heading === "Join" &&
            data.map((item, i) => (
              <JRNotification key={i} data={item}/>
            ))}
          {heading === "Leave" &&
            data.map((item, i) => (
              <LRNotification key={i} data={item}
                onAccept={onZTRSSubmit}
              />
            ))}
          {heading === "PG create" &&
            data.map((item, i) => (
              <AdminCPRNotification key={i} data={item} />
            ))}
          {heading === "Notifications" &&
            data.map((item, i) => (
              <AdminNotification key={i} data={item} onRead={onNotificationRead} />
            ))}
        </div>
      )}
    </div>
  );
};

export default DropdownComp;