import React, { useEffect, useState } from "react";
import SavedPGTemp from "./SavedPGTemp";
import axios from "axios";

const SavedPGs = ({savedPGs}) => {
  return (
    <div className="flex flex-col gap-4 bg-[#d9d9d9] p-4 rounded-[20px]">
      <div className="p-2">
        <p className="text-[#464646] text-[32px] font-medium">Saved PGs</p>
      </div>
      {savedPGs.length === 0 ? (
        <div className="text-center py-8 text-[#464646]">
          No saved PGs yet. Start exploring and save your favorites!
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {savedPGs.map((pg, i) => (
            <div className="w-full" key={pg._id || i}>
              <SavedPGTemp data={pg} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPGs;