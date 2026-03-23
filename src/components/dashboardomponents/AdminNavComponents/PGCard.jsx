const PGCard = ({ pg, onClick }) => {
  const pgName      = pg?.pgName           || "Ajanta PG";
  const address     = pg?.address          || "C33J+88Q Maya PG, Bagryal Village, Near DIT College, Dehradun";
  const coverPhoto  = pg?.coverPhoto       || null;
  const emptyRooms  = pg?.emptyRoomsCount  ?? "—";
  const pendingRent = pg?.pendingRentCount ?? "—";
  const RID         = pg?.RID              || "N/A";

  return (
    <div
      onClick={onClick}
      className="font-dm-mono group flex gap-4 bg-[#0f0f0f] border border-[#1f1f1f] hover:border-[#c8f135]/25 rounded-2xl p-4 transition-all duration-300 cursor-pointer"
    >
      {/* Cover photo / placeholder */}
      <div className="flex-shrink-0 w-[140px] h-[140px] rounded-xl overflow-hidden bg-[#1a1a1a] border border-[#1f1f1f] relative">
        {coverPhoto ? (
          <img
            src={coverPhoto}
            alt={pgName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          >
            <span className="text-[#2a2a2a] text-[0.55rem] tracking-[0.18em] uppercase">No photo</span>
          </div>
        )}

        {/* RID pill */}
        <div className="absolute bottom-2 left-2 right-2">
          <div className="bg-[#0a0a0a]/90 backdrop-blur-sm px-1.5 py-0.5 rounded-sm text-center">
            <span className="text-[0.5rem] tracking-[0.12em] text-[#555550] uppercase truncate block">
              {RID}
            </span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col justify-between py-0.5 flex-1 min-w-0">
        <div className="flex flex-col gap-1.5">
          <p className="text-[#e8e8e0] font-medium text-base leading-tight truncate group-hover:text-[#c8f135] transition-colors duration-200">
            {pgName}
          </p>
          <p className="text-[0.68rem] text-[#555550] leading-relaxed line-clamp-2">{address}</p>
        </div>

        <div className="h-px bg-[#1f1f1f] my-2" />

        <div className="flex gap-4">
          <Stat label="Empty Rooms"  value={emptyRooms} />
          <Stat label="Rent Pending" value={pendingRent} accent />
        </div>
      </div>

      {/* Arrow */}
      <div className="flex-shrink-0 self-center pl-1">
        <span className="text-[#2a2a2a] group-hover:text-[#c8f135] group-hover:translate-x-0.5 transition-all duration-300 block text-base">
          →
        </span>
      </div>
    </div>
  );
};

const Stat = ({ label, value, accent = false }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[0.52rem] tracking-[0.16em] text-[#555550] uppercase">{label}</span>
    <span className={`text-sm font-medium ${accent ? "text-[#c8f135]" : "text-[#e8e8e0]"}`}>
      {value}
    </span>
  </div>
);

export default PGCard;