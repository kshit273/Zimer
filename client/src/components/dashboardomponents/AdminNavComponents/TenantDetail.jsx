// TenantDetail.jsx
// Props:
//   tenant       — the tenant sub-doc from pg.room.tenants (has tenantId, joinDate, leaveDate, payments)
//   tenantData   — full tenant object fetched from backend (firstName, lastName, email, phone, ztrs, rentalHistory…)
//                  Pass null/undefined while loading; component shows a skeleton.
//   pgContext    — { pgName, RID, roomId, roomType, rent } — context of the room this tenant is in
//   onBack       — callback to go back to PGDetail

const fmt = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

const fmtCurrency = (n) =>
  n != null ? `₹${Number(n).toLocaleString("en-IN")}` : "—";

// ── ZTRS score bar ────────────────────────────────────────────────────────────
const ZTRSBar = ({ score }) => {
  // Score range is open-ended; clamp visual between -100 and +100 for display
  const clamped = Math.max(-100, Math.min(100, score ?? 0));
  const pct = ((clamped + 100) / 200) * 100; // map [-100,100] → [0%,100%]

  const color =
    clamped >= 60
      ? "#c8f135"       // excellent — chartreuse
      : clamped >= 20
      ? "#4ade80"       // good — green
      : clamped >= -20
      ? "#facc15"       // neutral — yellow
      : "#f87171";      // poor — red

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[0.95rem] tracking-[0.15em] text-[#555550] uppercase">ZTRS Score</span>
        <span className="text-base font-medium" style={{ color }}>
          {score ?? 0}
        </span>
      </div>
      {/* Track */}
      <div className="h-1.5 w-full bg-[#1a1a1a] rounded-full overflow-hidden border border-[#2a2a2a]">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <div className="flex justify-between">
        <span className="text-[0.8rem] text-[#2a2a2a]">−100</span>
        <span className="text-[0.8rem] text-[#2a2a2a]">0</span>
        <span className="text-[0.8rem] text-[#2a2a2a]">+100</span>
      </div>
    </div>
  );
};

// ── Small label+value row ─────────────────────────────────────────────────────
const InfoRow = ({ label, value, accent = false }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[0.85rem] tracking-[0.15em] text-[#555550] uppercase">{label}</span>
    <span className={`text-[1.05rem] font-medium ${accent ? "text-[#c8f135]" : "text-[#e8e8e0]"}`}>
      {value || "—"}
    </span>
  </div>
);

// ── Section header ────────────────────────────────────────────────────────────
const SectionLabel = ({ text }) => (
  <div className="flex items-center gap-3 mb-3">
    <div className="w-3 h-px bg-[#c8f135]" />
    <span className="text-[0.9rem] tracking-[0.22em] text-[#555550] uppercase">{text}</span>
  </div>
);

const Divider = () => <div className="h-px bg-[#1f1f1f] my-5" />;

// ── Payment row ───────────────────────────────────────────────────────────────
const PaymentRow = ({ payment, index }) => (
  <div className="flex items-center gap-3 px-3 py-2.5 bg-[#0f0f0f] border border-[#1f1f1f] rounded-lg">
    {/* Index bubble */}
    <div className="flex-shrink-0 w-6 h-6 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
      <span className="text-[0.8rem] text-[#555550]">{index + 1}</span>
    </div>

    {/* Month */}
    <div className="flex-1 min-w-0">
      <p className="text-[0.98rem] text-[#e8e8e0] font-medium">{payment.month}</p>
      <p className="text-[0.88rem] text-[#555550]">Paid on {fmt(payment.paidOn)}</p>
    </div>

    {/* Amount */}
    <span className="flex-shrink-0 text-[1.02rem] font-medium text-[#4ade80]">
      {fmtCurrency(payment.amount)}
    </span>
  </div>
);

// ── Rental history row ────────────────────────────────────────────────────────
const HistoryRow = ({ entry, isCurrent }) => (
  <div className={`flex items-start gap-3 px-3 py-3 rounded-xl border transition-colors duration-200
    ${isCurrent
      ? "bg-[#c8f135]/5 border-[#c8f135]/20"
      : "bg-[#0f0f0f] border-[#1f1f1f]"
    }`}>
    {/* Timeline dot */}
    <div className="flex-shrink-0 mt-1 flex flex-col items-center gap-1">
      <div className={`w-1.5 h-1.5 rounded-full ${isCurrent ? "bg-[#c8f135]" : "bg-[#2a2a2a]"}`} />
    </div>

    <div className="flex-1 min-w-0 flex flex-col gap-1">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[0.95rem] font-medium text-[#e8e8e0]">{entry.RID}</span>
        {isCurrent && (
          <span className="text-[0.8rem] tracking-[0.12em] uppercase px-1.5 py-0.5 rounded border border-[#c8f135]/30 text-[#c8f135] bg-[#c8f135]/5">
            Current
          </span>
        )}
      </div>
      <p className="text-[0.9rem] text-[#555550]">
        Room {entry.roomId} · {fmtCurrency(entry.rent)}/mo
      </p>
      <p className="text-[0.88rem] text-[#3a3a3a]">
        {fmt(entry.joinedFrom)}
        {entry.leftOn ? ` → ${fmt(entry.leftOn)}` : " → Present"}
      </p>
    </div>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────
const TenantDetail = ({ tenant, tenantData, pgContext, onBack }) => {
  if (!tenant) return null;

  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const isActive = !tenant.leaveDate;

  const hasPaidThisMonth = tenant.payments?.some((p) => p.month === currentMonthKey);
  const totalPaid = (tenant.payments || []).reduce((sum, p) => sum + (p.amount || 0), 0);

  // Initials from tenantData if available, fallback to "T"
  const initials = tenantData
    ? `${tenantData.firstName?.[0] || ""}${tenantData.lastName?.[0] || ""}`.toUpperCase() || "T"
    : "T";

  const fullName = tenantData
    ? `${tenantData.firstName || ""} ${tenantData.lastName || ""}`.trim()
    : `Tenant ···${String(tenant.tenantId).slice(-6)}`;

  return (
    <div className="font-dm-mono flex flex-col h-full">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#1f1f1f] flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[0.95rem] tracking-[0.2em] uppercase text-[#555550] hover:text-[#c8f135] transition-colors duration-200 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-200 inline-block">←</span>
          Back to PG
        </button>

        <div className="flex items-center gap-2">
          <span className={`text-[0.82rem] tracking-[0.1em] uppercase px-2 py-0.5 rounded border
            ${isActive
              ? "text-[#4ade80] border-[#4ade80]/30 bg-[#4ade80]/5"
              : "text-[#555550] border-[#2a2a2a]"
            }`}>
            {isActive ? "Active" : "Past tenant"}
          </span>
          {isActive && (
            <span className={`text-[0.82rem] tracking-[0.1em] uppercase px-2 py-0.5 rounded border
              ${hasPaidThisMonth
                ? "text-[#4ade80] border-[#4ade80]/30 bg-[#4ade80]/5"
                : "text-[#c8f135] border-[#c8f135]/30 bg-[#c8f135]/5"
              }`}>
              {hasPaidThisMonth ? "Rent paid" : "Rent pending"}
            </span>
          )}
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-0">

        {/* ── Hero: avatar + identity ── */}
        <div className="flex gap-5 mb-6">
          {/* Avatar */}
          <div className="flex-shrink-0 w-[80px] h-[80px] rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center relative overflow-hidden">
            {tenantData?.profilePicture ? (
              <img
                src={`http://localhost:5000${tenantData.profilePicture}`}
                alt={fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                {/* Dot grid texture in avatar */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)",
                    backgroundSize: "12px 12px",
                  }}
                />
                <span className="font-bebas text-[#c8f135] text-2xl tracking-wider relative z-10">
                  {initials}
                </span>
              </>
            )}
          </div>

          {/* Name + meta */}
          <div className="flex flex-col justify-center gap-1.5 flex-1 min-w-0">
            <h2
              className="font-bebas text-[#e8e8e0] leading-none tracking-wide"
              style={{ fontSize: "clamp(1.4rem, 5vw, 4.9rem)" }}
            >
              {fullName}
            </h2>

            {tenantData && (
              <div className="flex flex-wrap gap-2 mt-0.5">
                {tenantData.gender && (
                  <span className="text-[0.88rem] tracking-[0.12em] text-[#555550] uppercase">
                    {tenantData.gender}
                  </span>
                )}
                {tenantData.dob && (
                  <span className="text-[0.88rem] tracking-[0.12em] text-[#555550]">
                    · DOB {tenantData.dob}
                  </span>
                )}
              </div>
            )}

            {/* Context pill */}
            {pgContext && (
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[0.85rem] tracking-[0.1em] text-[#555550] uppercase">
                  {pgContext.pgName}
                </span>
                <span className="text-[#2a2a2a]">·</span>
                <span className="text-[0.85rem] text-[#555550]">Room {pgContext.roomId}</span>
                <span className="text-[#2a2a2a]">·</span>
                <span className="text-[0.85rem] text-[#c8f135]">{fmtCurrency(pgContext.rent)}/mo</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Contact info ── */}
        {tenantData && (
          <>
            <SectionLabel text="Contact" />
            <div className="grid grid-cols-2 gap-3 mb-2">
              <InfoRow label="Email"  value={tenantData.email} />
              <InfoRow label="Phone"  value={tenantData.phone} />
            </div>
            <Divider />
          </>
        )}

        {/* ── Tenancy dates ── */}
        <SectionLabel text="Tenancy" />
        <div className="grid grid-cols-3 gap-3 mb-2">
          <InfoRow label="Joined"     value={fmt(tenant.joinDate)} />
          <InfoRow label="Left on"    value={fmt(tenant.leaveDate)} />
          <InfoRow label="Tenant ID"  value={`···${String(tenant.tenantId).slice(-8)}`} />
        </div>
        <Divider />

        {/* ── ZTRS ── */}
        {tenantData && (
          <>
            <SectionLabel text="Trust score (ZTRS)" />
            <div className="mb-2">
              <ZTRSBar score={tenantData.ztrs} />
            </div>
            <Divider />
          </>
        )}

        {/* ── Payment summary ── */}
        <SectionLabel text={`Payments · ${tenant.payments?.length || 0} months`} />
        <div className="grid grid-cols-2 gap-3 mb-4">
          <InfoRow label="Total paid" value={fmtCurrency(totalPaid)} accent />
          <InfoRow
            label="This month"
            value={hasPaidThisMonth ? "Paid ✓" : "Pending"}
            accent={!hasPaidThisMonth}
          />
        </div>

        {tenant.payments?.length > 0 ? (
          <div className="flex flex-col gap-2 mb-2">
            {[...(tenant.payments)].reverse().map((p, i) => (
              <PaymentRow key={i} payment={p} index={tenant.payments.length - 1 - i} />
            ))}
          </div>
        ) : (
          <p className="text-[0.95rem] text-[#2a2a2a] italic mb-2">No payment records.</p>
        )}

        {/* ── Rental history (from tenantData) ── */}
        {tenantData?.rentalHistory?.length > 0 && (
          <>
            <Divider />
            <SectionLabel text={`Rental history · ${tenantData.rentalHistory.length} PG${tenantData.rentalHistory.length !== 1 ? "s" : ""}`} />
            <div className="flex flex-col gap-2 mb-4">
              {tenantData.rentalHistory.map((entry, i) => (
                <HistoryRow
                  key={i}
                  entry={entry}
                  isCurrent={entry.RID === pgContext?.RID}
                />
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default TenantDetail;