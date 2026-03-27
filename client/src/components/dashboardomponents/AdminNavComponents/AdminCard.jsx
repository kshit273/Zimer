const AdminCard = ({ admin }) => {
  const firstName   = admin?.firstName   || "Area";
  const lastName    = admin?.lastName    || "Manager";
  const managedArea = admin?.managedArea || "Rajpur Road";
  const email       = admin?.email       || "emailid@gmail.com";
  const phone       = admin?.phone       || "+91 9368578171";

  const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();

  return (
    <div className="font-dm-mono bg-[#111111] border border-[#1f1f1f] rounded-2xl p-4 flex items-center gap-4">

      {/* Avatar */}
      <div className="flex-shrink-0 w-[90px] h-[90px] rounded-xl bg-[#d72638]/10 border border-[#d72638]/20 flex items-center justify-center">
        <span className="font-bebas text-[#d72638] text-3xl tracking-wider">{initials}</span>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <p className="text-[#e8e8e0] font-medium text-xl leading-tight truncate">
          {firstName} {lastName}
        </p>
        <p className="text-[0.8rem] tracking-[0.12em] text-[#d72638] uppercase truncate">
          {managedArea}
        </p>
        <div className="mt-1.5 flex flex-col gap-0.5">
          <p className="text-[0.85rem] text-[#555550] truncate">{email}</p>
          <p className="text-[0.85rem] text-[#555550]">{phone}</p>
        </div>
      </div>

    </div>
  );
};

export default AdminCard;