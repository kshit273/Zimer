import { useState } from "react";

// ── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

const StarRow = ({ label, value }) => {
  const filled = Math.round(value || 0);
  return (
    <div className="flex items-center justify-between">
      <span className="text-[0.9rem] tracking-[0.12em] text-[#555550] uppercase">{label}</span>
      <div className="flex items-center gap-1.5">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <span
              key={s}
              className={`text-[15px] ${s <= filled ? "text-[#d72638]" : "text-[#2a2a2a]"}`}
            >
              ★
            </span>
          ))}
        </div>
        <span className="text-[0.92rem] text-[#e8e8e0]">{value ? value.toFixed(1) : "—"}</span>
      </div>
    </div>
  );
};

const Tag = ({ text, accent = false }) => (
  <span
    className={`inline-block px-2 py-0.5 rounded-md text-[0.9rem] tracking-[0.1em] uppercase border
      ${accent
        ? "border-[#d72638]/30 text-[#d72638] bg-[#d72638]/5"
        : "border-[#2a2a2a] text-[#555550] bg-[#111111]"
      }`}
  >
    {text}
  </span>
);

const TenantRow = ({ t, currentMonthKey, onSelectTenant }) => {
  const hasPaid  = t.payments?.some((p) => p.month === currentMonthKey);
  const isActive = !t.leaveDate;
 
  return (
    <button
      onClick={() => onSelectTenant && onSelectTenant(t)}
      className="w-full flex items-center gap-3 px-3 py-2.5 bg-[#111111] border border-[#1f1f1f] rounded-lg hover:border-[#c8f135]/25 hover:bg-[#c8f135]/[0.02] transition-all duration-200 text-left group"
    >
      {/* Avatar */}
      <div className="flex-shrink-0 w-7 h-7 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
        <span className="text-[0.6rem] text-[#555550] group-hover:text-[#c8f135] transition-colors duration-200">T</span>
      </div>
 
      <div className="flex-1 min-w-0">
        <p className="text-[0.65rem] text-[#e8e8e0] font-medium truncate group-hover:text-[#c8f135] transition-colors duration-200">
          ···{String(t.tenantId).slice(-8)}
        </p>
        <p className="text-[0.58rem] text-[#555550]">
          Joined {fmt(t.joinDate)}
          {t.leaveDate && ` · Left ${fmt(t.leaveDate)}`}
        </p>
      </div>
 
      {/* Status badges */}
      <div className="flex gap-1.5 flex-shrink-0 items-center">
        <span className={`text-[0.52rem] tracking-[0.08em] uppercase px-1.5 py-0.5 rounded border
          ${isActive ? "text-[#4ade80] border-[#4ade80]/30 bg-[#4ade80]/5" : "text-[#555550] border-[#2a2a2a]"}`}>
          {isActive ? "Active" : "Left"}
        </span>
        {isActive && (
          <span className={`text-[0.52rem] tracking-[0.08em] uppercase px-1.5 py-0.5 rounded border
            ${hasPaid ? "text-[#4ade80] border-[#4ade80]/30 bg-[#4ade80]/5" : "text-[#c8f135] border-[#c8f135]/30 bg-[#c8f135]/5"}`}>
            {hasPaid ? "Paid" : "Pending"}
          </span>
        )}
        {/* Click hint */}
        <span className="text-[#2a2a2a] group-hover:text-[#c8f135] transition-colors duration-200 text-xs ml-1">→</span>
      </div>
    </button>
  );
};

const SectionLabel = ({ text }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="w-3 h-px bg-[#d72638]" />
    <span className="text-[0.9rem] tracking-[0.22em] text-[#555550] uppercase">{text}</span>
  </div>
);

const Divider = () => <div className="h-px bg-[#1f1f1f] my-6" />;

// ── RoomCard ─────────────────────────────────────────────────────────────────

const RoomCard = ({ room, onSelectTenant }) => {
  const [open, setOpen] = useState(false);
 
  const activeTenants   = (room.tenants || []).filter((t) => !t.leaveDate);
  const now             = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const pendingCount    = activeTenants.filter(
    (t) => !t.payments?.some((p) => p.month === currentMonthKey)
  ).length;
 
  const ROOM_TYPE_COLOR = {
    single: "text-[#c8f135] border-[#c8f135]/30 bg-[#c8f135]/5",
    double: "text-[#60a5fa] border-[#60a5fa]/30 bg-[#60a5fa]/5",
    triple: "text-[#a78bfa] border-[#a78bfa]/30 bg-[#a78bfa]/5",
    quad:   "text-[#fb923c] border-[#fb923c]/30 bg-[#fb923c]/5",
    other:  "text-[#555550] border-[#555550]/30 bg-[#555550]/5",
  };
  const typeClass = ROOM_TYPE_COLOR[room.roomType] || ROOM_TYPE_COLOR.other;
 
  return (
    <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl overflow-hidden">
 
      {/* Collapsed header */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors duration-200 text-left"
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
          <span className="text-[0.55rem] tracking-[0.08em] text-[#555550] font-medium">
            {room.roomId?.slice(-3) || "—"}
          </span>
        </div>
 
        <div className="flex-1 min-w-0">
          <p className="text-[#e8e8e0] text-sm font-medium truncate">Room {room.roomId}</p>
          <p className="text-[0.6rem] text-[#555550] mt-0.5">
            {activeTenants.length} active tenant{activeTenants.length !== 1 ? "s" : ""}
            {pendingCount > 0 && <span className="ml-2 text-[#c8f135]">· {pendingCount} pending rent</span>}
          </p>
        </div>
 
        <span className={`flex-shrink-0 text-[0.55rem] tracking-[0.1em] uppercase px-2 py-0.5 rounded border ${typeClass}`}>
          {room.roomType}
        </span>
 
        <span className="flex-shrink-0 text-[0.72rem] text-[#e8e8e0] font-medium">
          ₹{room.rent?.toLocaleString()}<span className="text-[#555550] text-[0.55rem]">/mo</span>
        </span>
 
        <span className={`flex-shrink-0 text-[#555550] text-xs transition-transform duration-300 ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
 
      {/* Expanded */}
      {open && (
        <div className="border-t border-[#1f1f1f] px-4 py-4 flex flex-col gap-5 bg-[#0a0a0a]/50">
 
          {/* Security + description */}
          <div className="grid grid-cols-2 gap-4">
            {room.security != null && (
              <div className="flex flex-col gap-0.5">
                <span className="text-[0.55rem] tracking-[0.15em] text-[#555550] uppercase">Security deposit</span>
                <span className="text-sm text-[#e8e8e0] font-medium">₹{room.security?.toLocaleString()}</span>
              </div>
            )}
            {room.description && (
              <div className="col-span-2 flex flex-col gap-0.5">
                <span className="text-[0.55rem] tracking-[0.15em] text-[#555550] uppercase">Description</span>
                <p className="text-[0.7rem] text-[#888] leading-relaxed">{room.description}</p>
              </div>
            )}
          </div>
 
          {/* Amenities */}
          {room.amenities?.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-[0.55rem] tracking-[0.15em] text-[#555550] uppercase">Amenities</span>
              <div className="flex flex-wrap gap-1.5">
                {room.amenities.map((a, i) => <Tag key={i} text={a} />)}
              </div>
            </div>
          )}
 
          {/* Photos */}
          {room.photos?.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {room.photos.map((src, i) => (
                <img key={i} src={src} alt={`Room photo ${i + 1}`}
                  className="flex-shrink-0 w-20 h-20 rounded-lg object-cover border border-[#1f1f1f]" />
              ))}
            </div>
          )}
 
          {/* Tenants — now clickable rows */}
          {room.tenants?.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[0.55rem] tracking-[0.15em] text-[#555550] uppercase">
                  Tenants ({room.tenants.length})
                </span>
                <span className="text-[0.52rem] text-[#2a2a2a] italic">· click to view profile</span>
              </div>
              <div className="flex flex-col gap-2">
                {room.tenants.map((t, i) => (
                  <TenantRow
                    key={i}
                    t={t}
                    currentMonthKey={currentMonthKey}
                    onSelectTenant={onSelectTenant}
                  />
                ))}
              </div>
            </div>
          )}
 
        </div>
      )}
    </div>
  );
};

// ── PGDetail (main export) ────────────────────────────────────────────────────

const PGDetail = ({ pg, onBack }) => {
  if (!pg) return null;

  const avgRatings   = pg.averageRatings || {};
  const totalReviews = pg.totalReviews   || 0;

  // Derive quick stats
  const allActiveTenants = (pg.rooms || []).flatMap((r) =>
    (r.tenants || []).filter((t) => !t.leaveDate)
  );
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const pendingRentCount = allActiveTenants.filter(
    (t) => !t.payments?.some((p) => p.month === currentMonthKey)
  ).length;
  const emptyRooms = (pg.rooms || []).filter(
    (r) => !(r.tenants || []).some((t) => !t.leaveDate)
  ).length;

  return (
    <div className="font-dm-mono flex flex-col h-full">

      {/* ── Inner top bar ── */}
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#1f1f1f]">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[0.95rem] tracking-[0.2em] uppercase text-[#555550] hover:text-[#d72638] transition-colors duration-200 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-200 inline-block">←</span>
          All Properties
        </button>

        <span className="text-[0.85rem] tracking-[0.15em] text-[#2a2a2a] uppercase">{pg.RID}</span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pr-1 scrollbar-hide flex flex-col gap-0">

        {/* ── Hero ── */}
        <div className="flex gap-5 mb-6">
          {/* Cover photo */}
          <div className="flex-shrink-0 w-[200px] h-[180px] rounded-xl overflow-hidden bg-[#1a1a1a] border border-[#1f1f1f]">
            {pg.coverPhoto ? (
              <img src={pg.coverPhoto} alt={pg.pgName} className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
                  backgroundSize: "18px 18px",
                }}
              >
                <span className="text-[#2a2a2a] text-[0.85rem] tracking-[0.15em] uppercase">No photo</span>
              </div>
            )}
          </div>

          {/* Core info */}
          <div className="flex flex-col justify-between py-0.5 flex-1 min-w-0">
            <div>
              <h2 className="font-bebas text-[#e8e8e0] leading-none tracking-wide mb-1"
                style={{ fontSize: "clamp(1.6rem, 4vw, 4rem)" }}>
                {pg.pgName}
              </h2>
              <p className="text-[0.98rem] text-[#555550] leading-relaxed line-clamp-2">{pg.address}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <Tag text={pg.gender} accent />
                <Tag text={pg.plan || "basic"} />
                {pg.foodAvailable && <Tag text="Food available" />}
                {pg.selfCookingAllowed && <Tag text="Self cooking" />}
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex gap-5 mt-3">
              <QuickStat label="Total rooms"    value={pg.rooms?.length ?? "—"} />
              <QuickStat label="Empty rooms"    value={emptyRooms} />
              <QuickStat label="Pending rent"   value={pendingRentCount} accent />
              <QuickStat label="Reviews"        value={totalReviews} />
            </div>
          </div>
        </div>

        {/* Other photos strip */}
        {pg.otherPhotos?.length > 0 && (
          <>
            <SectionLabel text="Photos" />
            <div className="flex gap-2 overflow-x-auto pb-2 mb-2">
              {pg.otherPhotos.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`PG photo ${i + 1}`}
                  className="flex-shrink-0 w-28 h-20 rounded-xl object-cover border border-[#1f1f1f]"
                />
              ))}
            </div>
            <Divider />
          </>
        )}

        {/* Description */}
        {pg.description && (
          <>
            <SectionLabel text="About" />
            <p className="text-[1rem] text-[#888] leading-relaxed mb-2">{pg.description}</p>
            {pg.additionalInfo && (
              <p className="text-[0.98rem] text-[#555550] leading-relaxed mt-1">{pg.additionalInfo}</p>
            )}
            <Divider />
          </>
        )}

        {/* Amenities */}
        {pg.amenities?.length > 0 && (
          <>
            <SectionLabel text="Amenities" />
            <div className="flex flex-wrap gap-1.5 mb-2">
              {pg.amenities.map((a, i) => <Tag key={i} text={a} />)}
            </div>
            <Divider />
          </>
        )}

        {/* Rules */}
        {pg.rules?.length > 0 && (
          <>
            <SectionLabel text="House rules" />
            <ul className="flex flex-col gap-1.5 mb-2">
              {pg.rules.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#d72638] text-[0.55rem] mt-0.5">▸</span>
                  <span className="text-[0.98rem] text-[#888] leading-relaxed">{r}</span>
                </li>
              ))}
            </ul>
            <Divider />
          </>
        )}

        {/* Food */}
        {(pg.foodAvailable || pg.tiffinServiceAvailable) && (
          <>
            <SectionLabel text="Food & kitchen" />
            <div className="flex flex-col gap-1.5 mb-2">
              {pg.foodDescription && (
                <p className="text-[1rem] text-[#888] leading-relaxed">{pg.foodDescription}</p>
              )}
              {pg.menu?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {pg.menu.map((m, i) => <Tag key={i} text={m} />)}
                </div>
              )}
              <div className="flex gap-3 mt-1">
                {pg.tiffinServiceAvailable && <Tag text="Tiffin service" accent />}
                {pg.selfCookingAllowed && <Tag text="Self cooking allowed" />}
              </div>
            </div>
            <Divider />
          </>
        )}

        {/* Ratings */}
        {totalReviews > 0 && (
          <>
            <SectionLabel text={`Ratings · ${totalReviews} review${totalReviews !== 1 ? "s" : ""}`} />
            <div className="flex flex-col gap-2 mb-2 max-w-xs">
              <StarRow label="Overall"   value={avgRatings.overall} />
              <StarRow label="Community" value={avgRatings.community} />
              <StarRow label="Value"     value={avgRatings.value} />
              <StarRow label="Location"  value={avgRatings.location} />
              <StarRow label="Landlord"  value={avgRatings.landlord} />
            </div>
            <Divider />
          </>
        )}

        {/* Rooms */}
        {pg.rooms?.length > 0 && (
          <>
            <SectionLabel text={`Rooms · ${pg.rooms.length} total`} />
            <div className="flex flex-col gap-2 mb-4">
              {pg.rooms.map((room, i) => (
                <RoomCard
                  key={room.roomId || i}
                  room={room}
                  onSelectTenant={(t) =>
                    onSelectTenant &&
                    onSelectTenant(t, {
                      pgName:   pg.pgName,
                      RID:      pg.RID,
                      roomId:   room.roomId,
                      roomType: room.roomType,
                      rent:     room.rent,
                    })
                  }
                />
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

const QuickStat = ({ label, value, accent = false }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[0.82rem] tracking-[0.14em] text-[#555550] uppercase">{label}</span>
    <span className={`text-sm font-medium ${accent ? "text-[#d72638]" : "text-[#e8e8e0]"}`}>
      {value}
    </span>
  </div>
);

export default PGDetail;