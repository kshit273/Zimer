import React from "react";

const RentPaidNotification = ({ data }) => {
  const dateObj = new Date(data.createdAt);

  const optionsDate = { day: 'numeric', month: 'short', year: 'numeric' };
  const formattedDate = dateObj.toLocaleDateString('en-US', optionsDate); 

  const optionsTime = { hour: 'numeric', minute: '2-digit', hour12: true };
  const formattedTime = dateObj.toLocaleTimeString('en-US', optionsTime); 

  return (
    <div className="bg-[#e2e2e2] rounded-[20px] p-4">
      <div className="flex flex-col justify-center gap-2 ">
        <div className="flex flex-col gap-0.5">
          <p className="text-[19px] text-[#49c800] font-medium">Rent Paid</p>
          <p className="text-[15px] text-[#5c5c5c] font-medium">{data.message}</p>
        </div>
      </div>
      <div className="flex justify-between text-[12px] text-gray-700 mt-4">
        <span>{formattedDate}</span>
        <span>{formattedTime}</span>
      </div>
    </div>
  );
};
export default RentPaidNotification;
