const JRNotification = ({ data }) => {
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
          ["PG",        data.pg                     || "N/A"],
          ["Room",      data.metadata?.roomId       || "N/A"],
          ["Email",     data.metadata?.tenantEmail  || "N/A"],
          ["Phone",     data.metadata?.tenantPhone  || "N/A"],
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

      {/* Timestamp */}
      <div className="flex justify-between text-[0.68rem] text-[#3a3a3a] pt-1 border-t border-[#1f1f1f]">
        <span>{formattedDate}</span>
        <span>{formattedTime}</span>
      </div>

    </div>
  );
};

export default JRNotification;