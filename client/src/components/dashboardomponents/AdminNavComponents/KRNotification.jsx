import { useState } from "react";

const KRNotification = ({ data, onAccept }) => {
  const [showForm, setShowForm]   = useState(false);
  const [ztrsScore, setZtrsScore] = useState(null);
  const [reason, setReason]       = useState("");
  const [submitting, setSubmitting] = useState(false);

  const dateTime      = new Date(data.createdAt);
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

  const tenantIds = data.metadata?.tenantIds || [];
  const RID       = typeof data.pg === "object" ? data.pg?.RID : data.pg;

  const handleSubmit = async () => {
    if (ztrsScore === null || !reason.trim()) return;
    setSubmitting(true);
    try {
      await onAccept(tenantIds, RID, reason.trim(), ztrsScore, data._id);
    } catch (err) {
      console.error("KR accept error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="font-dm-mono bg-[#111111] border border-[#1f1f1f] rounded-xl p-4 flex flex-col gap-4">

      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="block w-1 h-1 rounded-full bg-[#60a5fa]" />
          <p className="text-[0.75rem] tracking-[0.18em] text-[#60a5fa] uppercase">Kick Request</p>
        </div>
        <p className="text-[#e8e8e0] font-medium text-medium">
          {data.metadata?.tenantName || "Multiple Tenants"}
        </p>
        <p className="text-[0.75rem] text-[#555550] leading-relaxed">{data.message}</p>
      </div>

      {/* Detail grid */}
      <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
        {[
          ["PG",         RID || "N/A"],
          ["Room",       data.metadata?.roomId || "N/A"],
          ["Move-out",   moveOutDate],
          ["Reason",     data.metadata?.reason || "Not specified"],
          ["Tenants",    tenantIds.length > 0
            ? tenantIds.map((id) => `···${String(id).slice(-6)}`).join(", ")
            : "N/A"
          ],
        ].map(([label, value]) => (
          <>
            <span
              key={label + "l"}
              className="text-[0.7rem] tracking-[0.1em] text-[#555550] uppercase self-start pt-0.5"
            >
              {label}
            </span>
            <span
              key={label + "v"}
              className="text-[0.78rem] text-[#e8e8e0] leading-relaxed break-all"
            >
              {value}
            </span>
          </>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-[#1f1f1f]" />

      {/* ZTRS button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.72rem] tracking-[0.12em] uppercase border border-[#60a5fa]/30 text-[#60a5fa] hover:bg-[#60a5fa]/5 transition-colors duration-200 cursor-pointer self-start"
        >
          ★ Update ZTRS & Accept
        </button>
      )}

      {/* ZTRS form */}
      {showForm && (
        <div className="flex flex-col gap-3 p-3 rounded-lg border border-[#1f1f1f] bg-[#0a0a0a]/60">
          <p className="text-[0.72rem] tracking-[0.15em] text-[#555550] uppercase">ZTRS Score</p>

          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                onClick={() => setZtrsScore(score)}
                className={`w-9 h-9 rounded-lg text-[0.85rem] font-medium border transition-all duration-200 cursor-pointer
                  ${ztrsScore === score
                    ? "bg-[#60a5fa] text-[#0a0a0a] border-[#60a5fa]"
                    : "border-[#1f1f1f] text-[#555550] hover:border-[#60a5fa]/40 hover:text-[#60a5fa]"
                  }`}
              >
                {score}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[0.72rem] tracking-[0.15em] text-[#555550] uppercase">Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for ZTRS score..."
              rows={2}
              className="w-full bg-[#111111] border border-[#1f1f1f] rounded-lg px-3 py-2 text-[0.78rem] text-[#e8e8e0] placeholder-[#3a3a3a] resize-none focus:outline-none focus:border-[#60a5fa]/40 transition-colors duration-200"
            />
          </div>

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
              {submitting ? "Submitting…" : "✓ Submit & Accept"}
            </button>
            <button
              onClick={() => { setShowForm(false); setZtrsScore(null); setReason(""); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.72rem] tracking-[0.12em] uppercase border border-[#1f1f1f] text-[#555550] hover:text-[#60a5fa] hover:border-[#60a5fa]/30 transition-colors duration-200 cursor-pointer"
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

export default KRNotification;