import React from "react";

const AdminNotification = ({ data, onRead }) => {
  const formattedDate = new Date(data.createdAt).toLocaleString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div 
      className={`bg-[#1a1a1a] p-4 rounded-xl border flex justify-between items-center ${
        data.important ? "border-[#d72638]" : "border-[#333]"
      }`}
    >
      <div className="flex-1 pr-4">
        <p className="text-[14px] text-[#e8e8e0]">{data.message}</p>
        {data.metadata && (
          <div className="mt-2 text-[12px] text-[#888] flex flex-wrap gap-x-4 gap-y-1">
            {data.metadata.tenantName && <span><span className="text-[#555]">Name:</span> {data.metadata.tenantName}</span>}
            {data.metadata.tenantEmail && <span><span className="text-[#555]">Email:</span> {data.metadata.tenantEmail}</span>}
            {data.metadata.tenantPhone && <span><span className="text-[#555]">Phone:</span> {data.metadata.tenantPhone}</span>}
          </div>
        )}
      </div>
      <div className="flex-shrink-0 flex flex-col items-end gap-2 text-right">
        <span className="text-[12px] text-[#888]">{formattedDate}</span>
        {data.status !== "read" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRead && onRead(data._id);
            }}
            className="text-[11px] font-medium tracking-wider bg-[#222] hover:bg-[#333] border border-[#333] hover:border-[#444] text-[#e8e8e0] px-3 py-1.5 rounded transition-colors"
          >
            Mark as read
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminNotification;
