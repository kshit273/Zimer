import React from "react";

const BaseNotification = ({ id, data }) => {
const dateObj = new Date(data.createdAt);

const isSender = id === data.sender._id;

const optionsDate = { day: 'numeric', month: 'short', year: 'numeric' };
const formattedDate = dateObj.toLocaleDateString('en-US', optionsDate); 

const optionsTime = { hour: 'numeric', minute: '2-digit', hour12: true };
const formattedTime = dateObj.toLocaleTimeString('en-US', optionsTime); 

  return (
      <div className={`${isSender ? `border-l-4 border-[#ff0058]` : ``} bg-[#e2e2e2] p-4 rounded-[20px]`}>
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-0.5">
            <p>{data.message}</p>
          </div>
        </div>
        <div className={`flex text-gray-700 justify-between text-[12px] mt-4`}>
          <span>{formattedDate}</span>
          <span>{formattedTime}</span>
        </div>
      </div>

  );
};

export default BaseNotification;
