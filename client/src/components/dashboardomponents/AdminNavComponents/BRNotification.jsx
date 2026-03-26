import { useState } from "react";

const BRNotification = ({ name, contact, email, reqTime, RID, pgName }) => {
  const [responded, setResponded] = useState(false);

  return (
    <div className="font-dm-mono bg-[#111111] border border-[#1f1f1f] rounded-xl p-4 flex flex-col gap-4">

      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="block w-1 h-1 rounded-full bg-[#c8f135]" />
          <p className="text-[0.75rem] tracking-[0.18em] text-[#c8f135] uppercase">Booking Request</p>
        </div>
        <p className="text-[#e8e8e0] font-medium text-medium">{name}</p>
        <p className="text-[0.85rem] text-[#555550] leading-relaxed">
          Requested PG <span className="text-[#e8e8e0]">{pgName}</span>{" "}
          <span className="text-[#3a3a3a]">({RID})</span> at {reqTime}.
        </p>
      </div>

      {/* Detail grid */}
      <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
        {[
          ["Name",     name],
          ["Contact",  contact],
          ["Email",    email],
          ["Req time", reqTime],
          ["Res time", "—"],
        ].map(([label, value]) => (
          <>
            <span key={label + "l"} className="text-[0.7rem] tracking-[0.1em] text-[#555550] uppercase self-center">{label}</span>
            <span key={label + "v"} className="text-[0.78rem] text-[#e8e8e0] self-center truncate">{value}</span>
          </>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-[#1f1f1f]" />

      {/* Action */}
      <button
        onClick={() => setResponded(true)}
        disabled={responded}
        className={`self-start flex items-center gap-2 px-3 py-1.5 rounded-lg text-[0.72rem] tracking-[0.12em] uppercase border transition-all duration-200
          ${responded
            ? "border-[#c8f135]/30 text-[#c8f135]/60 cursor-default"
            : "border-[#c8f135]/40 text-[#c8f135] hover:bg-[#c8f135]/5 cursor-pointer"
          }`}
      >
        <span>{responded ? "✓" : "○"}</span>
        {responded ? "Responded" : "Mark as responded"}
      </button>

    </div>
  );
};

export default BRNotification;