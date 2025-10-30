import React from "react";
import SavedPGTemp from "../Dashboard/SavedPGTemp";

const RoomsHistory = ({rentalHistory}) => {
  return (
    <div className="w-full flex flex-col gap-4 bg-[#d9d9d9] p-4 rounded-[20px]">
      <div className="p-2">
        <p className="text-[#464646] text-[32px] font-medium">Rooms History</p>
      </div>
      <div className="flex flex-col gap-4">
        {rentalHistory.map((pg, i) => (
          <div className="w-full" key={i}>
            <SavedPGTemp data={pg} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomsHistory;
