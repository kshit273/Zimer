import React from "react";

const BaseNotification = ({ data }) => {
const dateObj = new Date(data.createdAt);

const optionsDate = { day: 'numeric', month: 'short', year: 'numeric' };
const formattedDate = dateObj.toLocaleDateString('en-US', optionsDate); 

const optionsTime = { hour: 'numeric', minute: '2-digit', hour12: true };
const formattedTime = dateObj.toLocaleTimeString('en-US', optionsTime); 

  return (
    <div className="p-4">
      <div className="flex items-center gap-4 ">
        <div className="flex flex-col gap-0.5">
          <p className="text-[18px] text-[#1a1a1a] font-medium">Owner Name</p>
          <p>{data.message}</p>
        </div>
      </div>
      <div className="flex justify-between text-[12px] text-gray-700 mt-4">
        <span>{formattedDate}</span>
        <span>{formattedTime}</span>
      </div>
    </div>
  );
};

export default BaseNotification;
