import { useState } from "react";

const LRNotification = ({ data, onAccept }) => {
  const [showForm, setShowForm] = useState(false);
  const [ztrsScore, setZtrsScore] = useState(null);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const dateTime = new Date(data.createdAt);

  const formattedDate = dateTime.toLocaleDateString("en-US", {
    day: "numeric", month: "long", year: "numeric",
  });
  const formattedTime = dateTime.toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit", hour12: true,
  });
  const moveOutDate = data.metadata?.moveOutDate
    ? new Date(data.metadata.moveOutDate).toLocaleDateString("en-US", {
        day: "numeric", month: "short", year: "numeric",
      })
    : "Not specified";

  const handleSubmit = async () => {
    if (ztrsScore === null || !reason.trim()) return;
    setSubmitting(true);
    try {
      // data.sender can be an object (populated) or a string/ObjectId
      const tenantId = typeof data.sender === "object" ? data.sender._id : data.sender;
      const RID = typeof data.pg === "object" ? data.pg.RID : data.pg;
      await onAccept(tenantId, RID, reason.trim(), ztrsScore, data._id);
    } catch (err) {
      console.error("ZTRS submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="font-dm-mono bg-[#111111] border border-[#1f1f1f] rounded-xl p-4 flex flex-col gap-4">

      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="block w-1 h-1 rounded-full bg-[#f87171]" />
          <p className="text-[0.75rem] tracking-[0.18em] text-[#f87171] uppercase">Leave Request</p>
        </div>
        <p className="text-[#e8e8e0] font-medium text-medium">
          {data.metadata?.tenantName || "Unknown User"}
        </p>
        <p className="text-[0.75rem] text-[#555550] leading-relaxed">{data.message}</p>
      </div>

      {/* Detail grid */}
      <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
        {[
          ["PG",        (typeof data.pg === "object" ? data.pg?.RID : data.pg) || "N/A"],
          ["Move-out",  moveOutDate],
          ...(data.metadata?.reason
            ? [["Reason", data.metadata.reason]]
            : []),
        ].map(([label, value]) => (
          <>
            <span key={label + "l"} className="text-[0.7rem] tracking-[0.1em] text-[#555550] uppercase self-start pt-0.5">{label}</span>
            <span key={label + "v"} className="text-[0.78rem] text-[#e8e8e0] leading-relaxed">{value}</span>
          </>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-[#1f1f1f]" />

      {/* Update ZTRS button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.72rem] tracking-[0.12em] uppercase border border-[#f87171]/30 text-[#f87171] hover:bg-[#f87171]/5 transition-colors duration-200 cursor-pointer self-start"
        >
          ★ Update ZTRS
        </button>
      )}

      {/* ZTRS Form */}
      {showForm && (
        <div className="flex flex-col gap-3 p-3 rounded-lg border border-[#1f1f1f] bg-[#0a0a0a]/60">
          <p className="text-[0.72rem] tracking-[0.15em] text-[#555550] uppercase">ZTRS Score</p>

          {/* Score buttons 1-5 */}
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                onClick={() => setZtrsScore(score)}
                className={`w-9 h-9 rounded-lg text-[0.85rem] font-medium border transition-all duration-200 cursor-pointer
                  ${ztrsScore === score
                    ? "bg-[#f87171] text-[#0a0a0a] border-[#f87171]"
                    : "border-[#1f1f1f] text-[#555550] hover:border-[#f87171]/40 hover:text-[#f87171]"
                  }`}
              >
                {score}
              </button>
            ))}
          </div>

          {/* Reason input */}
          <div className="flex flex-col gap-1">
            <label className="text-[0.72rem] tracking-[0.15em] text-[#555550] uppercase">Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for ZTRS score..."
              rows={2}
              className="w-full bg-[#111111] border border-[#1f1f1f] rounded-lg px-3 py-2 text-[0.78rem] text-[#e8e8e0] placeholder-[#3a3a3a] resize-none focus:outline-none focus:border-[#f87171]/40 transition-colors duration-200"
            />
          </div>

          {/* Submit / Cancel */}
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={ztrsScore === null || !reason.trim() || submitting}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.72rem] tracking-[0.12em] uppercase border transition-colors duration-200 cursor-pointer
                ${ztrsScore !== null && reason.trim() && !submitting
                  ? "border-[#4ade80]/30 text-[#4ade80] hover:bg-[#4ade80]/5"
                  : "border-[#1f1f1f] text-[#3a3a3a] cursor-not-allowed"
                }`}
            >
              {submitting ? "Submitting…" : "✓ Submit"}
            </button>
            <button
              onClick={() => { setShowForm(false); setZtrsScore(null); setReason(""); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.72rem] tracking-[0.12em] uppercase border border-[#1f1f1f] text-[#555550] hover:text-[#f87171] hover:border-[#f87171]/30 transition-colors duration-200 cursor-pointer"
            >
              ✕ Cancel
            </button>
          </div>
        </div>
      )}

      {/* Timestamp */}
      <div className="flex justify-between text-[0.68rem] text-[#3a3a3a] pt-1 border-t border-[#1f1f1f]">
        <span>{formattedDate}</span>
        <span>{formattedTime}</span>
      </div>

    </div>
  );
};

export default LRNotification;