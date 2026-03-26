import React from "react";
import { useNavigate } from "react-router-dom";

const BackBtn = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(-1)} // 👈 this goes back
      className="flex items-center justify-center gap-2 bg-[#d9d9d9] rounded-3xl py-2 px-4 cursor-pointer hover:scale-105 duration-300"
    >
      <img
        src="../images/arrowBlack.png"
        alt="back"
        className="h-[15px] w-[15px] rotate-180"
      />
      <p className="text-[#1a1a1a] text-[16px] font-medium">Back</p>
    </div>
  );
};

export default BackBtn;
