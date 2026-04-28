import React from "react";

const AdminNotification = ({ data }) => {
  const formattedDate = new Date(data.createdAt).toLocaleString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#333] flex justify-between items-center">
      <div className="flex-1 pr-4">
        <p className="text-[14px] text-[#e8e8e0]">{data.message}</p>
      </div>
      <div className="flex-shrink-0 text-right">
        <span className="text-[12px] text-[#888]">{formattedDate}</span>
      </div>
    </div>
  );
};

export default AdminNotification;
