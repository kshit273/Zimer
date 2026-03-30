import { useState } from "react";

const BRNotification = ({ name, contact, email, reqTime, resTime, RID, pgName, brId, onBRResponse }) => {
  const [showInput, setShowInput]   = useState(false);
  const [responseText, setResponseText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isResponded = resTime !== null && resTime !== undefined;

  const handleSubmit = async () => {
    if (!responseText.trim()) return;
    setSubmitting(true);
    await onBRResponse(brId, responseText);
    setSubmitting(false);
    setShowInput(false);
  };

  const formattedResTime = isResponded
    ? new Date(resTime).toLocaleString("en-IN", {
        hour: "2-digit", minute: "2-digit", hour12: true,
        day: "2-digit", month: "short", year: "numeric",
      })
    : "—";

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
          ["Res time", formattedResTime],  // ✅ real resTime
        ].map(([label, value]) => (
          <div key={label}>
            <span className="text-[0.7rem] tracking-[0.1em] text-[#555550] uppercase self-center">{label}</span>
            <span className="text-[0.78rem] text-[#e8e8e0] self-center truncate">{value}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-[#1f1f1f]" />

      {/* Response input — shown on button click */}
      {showInput && (
        <div className="flex flex-col gap-2">
          <textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder="Enter the customer's response..."
            rows={3}
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-[0.78rem] text-[#e8e8e0] placeholder-[#555550] resize-none focus:outline-none focus:border-[#c8f135]/40 transition-colors duration-200"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={submitting || !responseText.trim()}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[0.72rem] tracking-[0.12em] uppercase border border-[#c8f135]/40 text-[#c8f135] hover:bg-[#c8f135]/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
            <button
              onClick={() => setShowInput(false)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[0.72rem] tracking-[0.12em] uppercase border border-[#3a3a3a] text-[#555550] hover:text-[#e8e8e0] transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Action button */}
      <button
        onClick={() => !isResponded && setShowInput((prev) => !prev)}
        disabled={isResponded}
        className={`self-start flex items-center gap-2 px-3 py-1.5 rounded-lg text-[0.72rem] tracking-[0.12em] uppercase border transition-all duration-200
          ${isResponded
            ? "border-[#c8f135]/30 text-[#c8f135]/60 cursor-default"
            : "border-[#c8f135]/40 text-[#c8f135] hover:bg-[#c8f135]/5 cursor-pointer"
          }`}
      >
        <span>{isResponded ? "✓" : "○"}</span>
        {isResponded ? "Responded" : "Mark as responded"}
      </button>

    </div>
  );
};

export default BRNotification;