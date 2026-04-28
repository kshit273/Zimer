import React, { useState } from "react";
import axios from "axios";

/* ─── helpers ────────────────────────────────────────────────── */

const Badge = ({ children, color = "zinc" }) => {
  const map = {
    green: "bg-green-900/30 text-green-400 border-green-800/40",
    red:   "bg-red-900/30   text-red-400   border-red-800/40",
    blue:  "bg-blue-900/30  text-blue-400  border-blue-800/40",
    zinc:  "bg-zinc-800/60  text-zinc-400  border-zinc-700/40",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[0.65rem] tracking-widest uppercase font-medium ${map[color]}`}>
      {children}
    </span>
  );
};

const SectionLabel = ({ children }) => (
  <p className="text-[0.6rem] tracking-[0.22em] text-[#3a3a3a] uppercase mb-2 pt-1">{children}</p>
);

const Field = ({ label, value }) => {
  if (!value && value !== false) return null;
  const display =
    typeof value === "boolean"
      ? value ? "Yes" : "No"
      : String(value);
  if (!display || display === "N/A" || display === "") return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[0.6rem] tracking-[0.14em] text-[#3a3a3a] uppercase">{label}</span>
      <span className="text-[0.78rem] text-[#c8c8c0] leading-relaxed">{display}</span>
    </div>
  );
};

const Divider = () => <div className="h-px bg-[#1a1a1a] my-1" />;

/* ─── room card ──────────────────────────────────────────────── */

const RoomCard = ({ room, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#1f1f1f] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-[#161616] hover:bg-[#1a1a1a] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-[0.6rem] tracking-[0.18em] text-[#555550] uppercase">Room {index + 1}</span>
          {room.roomType && room.roomType !== "Select here" && (
            <Badge color="blue">{room.roomType}</Badge>
          )}
          {room.rent && (
            <span className="text-[0.72rem] text-[#c8c8c0]">₹{room.rent}/mo</span>
          )}
        </div>
        <svg
          className={`w-3.5 h-3.5 text-[#3a3a3a] transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-3 py-3 bg-[#0e0e0e] flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <Field label="Room Type"  value={room.roomType !== "Select here" ? room.roomType : null} />
            <Field label="Rent"       value={room.rent ? `₹${room.rent}` : null} />
            <Field label="Security"   value={room.security ? `₹${room.security}` : null} />
            <Field label="Description" value={room.description} />
          </div>

          {room.features?.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <SectionLabel>Room Features</SectionLabel>
              <div className="flex flex-wrap gap-1.5">
                {room.features.map((f, i) => <Badge key={i} color="zinc">{f}</Badge>)}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

/* ─── main component ─────────────────────────────────────────── */

const AdminCPRNotification = ({ data }) => {
  const [status, setStatus]   = useState(data.status);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleAccept = async () => {
    setLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:5000/pgs/", {
        pgData:         data.formData,
        city:           data.metadata.city,
        areaCode:       data.metadata.areaCode,
        notificationId: data._id,
        landlordId:     data.sender._id || data.sender,
      }, { withCredentials: true });
      setStatus("accepted");
    } catch (err) {
      console.error("Failed to accept PG request:", err);
      setError(err.response?.data?.error || "Failed to accept request");
    } finally {
      setLoading(false);
    }
  };

  const dateTime      = new Date(data.createdAt);
  const formattedDate = dateTime.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
  const formattedTime = dateTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

  const fd = data.formData || {};

  return (
    <div className="font-dm-mono bg-[#111111] border border-[#1f1f1f] rounded-xl p-4 flex flex-col gap-4 max-w-xl">

      {/* ── Header ── */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="block w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
          <p className="text-[0.65rem] tracking-[0.2em] text-[#4ade80] uppercase">Create PG Request</p>
        </div>
        <p className="text-[#e8e8e0] font-medium">{data.metadata?.senderName || "Unknown User"}</p>
        <p className="text-[0.73rem] text-[#555550] leading-relaxed">{data.message}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[0.65rem] text-[#333330]">{data.metadata?.senderPhone || "N/A"}</span>
        </div>
      </div>

      <Divider />

      {/* ── Basic Info ── */}
      <div className="flex flex-col gap-2">
        <SectionLabel>PG Details</SectionLabel>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
          <Field label="PG Name"    value={fd.pgName} />
          <Field label="Type"       value={fd.pgType} />
          <Field label="City"       value={data.metadata?.city} />
          <Field label="Area Code"  value={data.metadata?.areaCode} />
        </div>
        {fd.description && (
          <div className="flex flex-col gap-0.5 mt-1">
            <span className="text-[0.6rem] tracking-[0.14em] text-[#3a3a3a] uppercase">Description</span>
            <p className="text-[0.78rem] text-[#c8c8c0] leading-relaxed">{fd.description}</p>
          </div>
        )}
      </div>

      {/* ── Address ── */}
      <Divider />
      <div className="flex flex-col gap-2">
        <SectionLabel>Address</SectionLabel>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
          {fd.address}
        </div>
      </div>

      {/* ── Features ── */}
      {(fd.features?.length > 0 || fd.otherFeatures) && (
        <>
          <Divider />
          <div className="flex flex-col gap-2">
            <SectionLabel>Features</SectionLabel>
            {fd.features?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {fd.features.map((f, i) => <Badge key={i} color="zinc">{f}</Badge>)}
              </div>
            )}
            {fd.otherFeatures && (
              <p className="text-[0.75rem] text-[#c8c8c0] mt-1">{fd.otherFeatures}</p>
            )}
          </div>
        </>
      )}

      {/* ── Food ── */}
      {(fd.foodAvailable !== undefined || fd.selfCooking !== undefined || fd.tiffin !== undefined) && (
        <>
          <Divider />
          <div className="flex flex-col gap-2">
            <SectionLabel>Food</SectionLabel>
            <div className="grid grid-cols-3 gap-2">
              {[
                ["Meals Provided", fd.foodAvailable],
                ["Self Cooking",   fd.selfCooking],
                ["Tiffin",         fd.tiffin],
              ].map(([label, val]) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-[0.6rem] tracking-widest text-[#3a3a3a] uppercase">{label}</span>
                  <Badge color={val ? "green" : "zinc"}>{val ? "Yes" : "No"}</Badge>
                </div>
              ))}
            </div>

            {fd.foodAvailable && fd.foodAvailabilityDesc && (
              <div className="flex flex-col gap-0.5 mt-1">
                <span className="text-[0.6rem] tracking-[0.14em] text-[#3a3a3a] uppercase">Food Details</span>
                <p className="text-[0.75rem] text-[#c8c8c0]">{fd.foodAvailabilityDesc}</p>
              </div>
            )}

          </div>
        </>
      )}

      {/* ── Rules & Additional Info ── */}
      {(fd.rules || fd.addInfo) && (
        <>
          <Divider />
          <div className="flex flex-col gap-3">
            {fd.rules && (
              <div className="flex flex-col gap-0.5">
                <SectionLabel>Rules</SectionLabel>
                <p className="text-[0.75rem] text-[#c8c8c0] leading-relaxed">{fd.rules}</p>
              </div>
            )}
            {fd.addInfo && (
              <div className="flex flex-col gap-0.5">
                <SectionLabel>Additional Information</SectionLabel>
                <p className="text-[0.75rem] text-[#c8c8c0] leading-relaxed">{fd.addInfo}</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Rooms ── */}
      {fd.rooms?.length > 0 && (
        <>
          <Divider />
          <div className="flex flex-col gap-2">
            <SectionLabel>Rooms ({fd.rooms.length})</SectionLabel>
            <div className="flex flex-col gap-2">
              {fd.rooms.map((room, i) => (
                <RoomCard key={room.id || i} room={room} index={i} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Confirmations ── */}
      <Divider />
      <div className="flex flex-col gap-1.5">
        <SectionLabel>Declarations</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {[
            ["Info Confirmed",  fd.confirmInfo],
            ["Terms Agreed",    fd.agreeTerms],
            ["Allow Promos",    fd.allowPromo],
          ].map(([label, val]) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className={`block w-1 h-1 rounded-full ${val ? "bg-green-400" : "bg-[#3a3a3a]"}`} />
              <span className="text-[0.65rem] tracking-[0.12em] text-[#555550] uppercase">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-[0.72rem] text-red-400 bg-red-900/20 border border-red-800/30 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* ── Footer ── */}
      <Divider />
      <div className="flex justify-between items-center text-[0.65rem] text-[#3a3a3a]">
        <div className="flex gap-2.5">
          <span>{formattedDate}</span>
          <span className="text-[#2a2a2a]">·</span>
          <span>{formattedTime}</span>
        </div>

        <div>
          {status === "pending" ? (
            <button
              onClick={handleAccept}
              disabled={loading}
              className={`px-4 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
                loading
                  ? "bg-[#252525] text-[#555] cursor-not-allowed"
                  : "bg-[#3b82f6] text-white hover:bg-[#2563eb] active:scale-95"
              }`}
            >
              {loading ? "Accepting…" : "Accept"}
            </button>
          ) : (
            <Badge color={status === "accepted" ? "green" : "red"}>
              {status === "accepted" ? "Accepted" : "Rejected"}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCPRNotification;