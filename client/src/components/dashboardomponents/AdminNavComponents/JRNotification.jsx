const JRNotification = ({ data, onAccept, onReject }) => {
  const dateTime = new Date(data.createdAt);

  const formattedDate = dateTime.toLocaleDateString("en-US", {
    day: "numeric", month: "long", year: "numeric",
  });
  const formattedTime = dateTime.toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit", hour12: true,
  });
  const moveInDate = data.metadata?.moveInDate
    ? new Date(data.metadata.moveInDate).toLocaleDateString("en-US", {
        day: "numeric", month: "short", year: "numeric",
      })
    : "Not specified";

  return (
    <div className="font-dm-mono bg-[#111111] border border-[#1f1f1f] rounded-xl p-4 flex flex-col gap-4">

      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="block w-1 h-1 rounded-full bg-[#4ade80]" />
          <p className="text-[0.75rem] tracking-[0.18em] text-[#4ade80] uppercase">Join Request</p>
        </div>
        <p className="text-[#e8e8e0] font-medium text-medium">
          {data.metadata?.tenantName || "Unknown User"}
        </p>
        <p className="text-[0.75rem] text-[#555550] leading-relaxed">{data.message}</p>
      </div>

      {/* Detail grid */}
      <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
        {[
          ["PG",        data.RID        || "N/A"],
          ["Room",      data.roomId     || "N/A"],
          ["Email",     data.tenantEmail|| "N/A"],
          ["Phone",     data.tenantPhone|| "N/A"],
          ["Move-in",   moveInDate],
        ].map(([label, value]) => (
          <>
            <span key={label + "l"} className="text-[0.7rem] tracking-[0.1em] text-[#555550] uppercase self-center">{label}</span>
            <span key={label + "v"} className="text-[0.78rem] text-[#e8e8e0] self-center truncate">{value}</span>
          </>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-[#1f1f1f]" />

      {/* Actions / status */}
      {data.status === "pending" ? (
        <div className="flex gap-2">
          <button
            onClick={onAccept}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.72rem] tracking-[0.12em] uppercase border border-[#4ade80]/30 text-[#4ade80] hover:bg-[#4ade80]/5 transition-colors duration-200 cursor-pointer"
          >
            ✓ Accept
          </button>
          <button
            onClick={onReject}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.72rem] tracking-[0.12em] uppercase border border-[#f87171]/30 text-[#f87171] hover:bg-[#f87171]/5 transition-colors duration-200 cursor-pointer"
          >
            ✕ Reject
          </button>
        </div>
      ) : (
        <p className={`text-[0.75rem] font-medium ${data.status === "accepted" ? "text-[#4ade80]" : "text-[#f87171]"}`}>
          {data.status === "accepted" ? "✓ Accepted" : "✕ Rejected"}
        </p>
      )}

      {/* Timestamp */}
      <div className="flex justify-between text-[0.68rem] text-[#3a3a3a] pt-1 border-t border-[#1f1f1f]">
        <span>{formattedDate}</span>
        <span>{formattedTime}</span>
      </div>

    </div>
  );
};

export default JRNotification;