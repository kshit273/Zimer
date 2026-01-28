import React from "react";

const LeaveReq = ({ formData, data, onAccept, onReject }) => {
  const dateTime = new Date(data.createdAt);

  const isSender = formData.id === data.sender._id;

  // Format date nicely (e.g., "22 October 2025")
  const formattedDate = dateTime.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Format time nicely (e.g., "5:30 PM")
  const formattedTime = dateTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // Format move-out date if available
  const moveOutDate = data.metadata?.moveOutDate 
    ? new Date(data.metadata.moveOutDate).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Not specified";

  return (
    <div className={`${isSender ? `bg-[#b52f2f]` : `bg-[#e2e2e2]`} rounded-[20px] p-4 mb-4`}>
      <div className="flex flex-col justify-center gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-[19px] text-[#d72638] font-medium">Leave Request</p>
          <p className="text-[15px] text-[#1a1a1a] font-medium">
            {data.metadata?.tenantName || "Unknown User"}
          </p>
          <p className="text-[14px] text-[#5c5c5c]">{data.message}</p>
          
          {/* Additional details */}
          <div className="mt-2 space-y-1">
            <p className="text-[13px] text-[#5c5c5c]">
              <span className="font-medium">Room:</span> {data.metadata?.roomNumber || "N/A"}
            </p>
            <p className="text-[13px] text-[#5c5c5c]">
              <span className="font-medium">Move-out Date:</span> {moveOutDate}
            </p>
            {data.metadata?.reason && (
              <p className="text-[13px] text-[#5c5c5c]">
                <span className="font-medium">Reason:</span> {data.metadata.reason}
              </p>
            )}
          </div>
        </div>

        {/* Action buttons - only show if status is pending */}
        {data.status === "pending" && (
          <div className="flex gap-2">
            <button 
              onClick={onAccept}
              className="rounded-[20px] px-6 py-2 bg-[#49c800] hover:bg-[#3db300] transition-colors"
            >
              <img
                src="../images/whitetick.png"
                alt="Accept"
                className="h-[15px] w-[15px]"
              />
            </button>
            <button 
              onClick={onReject}
              className="rounded-[20px] px-6 py-2 bg-[#d72638] hover:bg-[#c41e30] transition-colors"
            >
              <img
                src="../images/cross.png"
                alt="Reject"
                className="h-[15px] w-[15px]"
              />
            </button>
          </div>
        )}

        {/* Status indicator for processed requests */}
        {data.status !== "pending" && (
          <div className="flex items-center gap-2">
            <span className={`text-[14px] font-medium ${
              data.status === "accepted" ? "text-[#49c800]" : "text-[#d72638]"
            }`}>
              {data.status === "accepted" ? "✓ Accepted" : "✗ Rejected"}
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-between text-[12px] text-gray-700 mt-4 pt-2 border-t border-gray-300">
        <span>{formattedDate}</span>
        <span>{formattedTime}</span>
      </div>
    </div>
  );
};

export default LeaveReq;