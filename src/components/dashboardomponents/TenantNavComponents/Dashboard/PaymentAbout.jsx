import React from "react";
import PaymentHistoryCard from "./PaymentHistoryCard";
import PaymentCollectionHistoryCard from "../../LandlordNavComponents/Dashboard/PaymentCollectionHistoryCard";

const PaymentAbout = ({ formData, residingPG }) => {
  const pncHistory = [
    {
      rent: 400,
      date: "2025-10-22",
      time: "17:30:00",
      cashback: 40,
    },
    {
      rent: 400,
      date: "2025-09-21",
      time: "12:24:00",
      cashback: 40,
    },
    {
      rent: 400,
      date: "2025-08-19",
      time: "08:07:00",
      cashback: 40,
    },
    {
      rent: 400,
      date: "2025-07-20",
      time: "15:45:00",
      cashback: 40,
    },
    {
      rent: 400,
      date: "2025-06-22",
      time: "09:47:00",
      cashback: 40,
    },
    {
      rent: 400,
      date: "2025-05-19",
      time: "10:32:00",
      cashback: 40,
    },
    {
      rent: 400,
      date: "2025-04-18",
      time: "11:15:00",
      cashback: 40,
    },
  ];

  const role = formData.role;

  return (
    <div>
      {/* Top cards */}
      <div className="flex gap-4">
        {/* Cashback earned card */}
        <div className="relative bg-[#e2e2e2] rounded-[20px] flex flex-col gap-4 items-center justify-center py-6 px-5">
          <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full border-8 border-[#464646] bg-[#4EC840] flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-[#e2e2e2]"></div>
          </div>
          <p className="text-xl font-normal">
            {role === "tenant" ? `Cashback earned` : `Rent Collected`}
          </p>
          <p className="text-4xl font-medium text-[#4EC840]">$40</p>
        </div>

        {/* Rent paid card */}
        {role === "tenant" ? (
          <div className="relative bg-[#e2e2e2] rounded-[20px] flex flex-col gap-4 items-center justify-center py-6 px-17">
            <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full border-8 border-[#464646] bg-gradient-to-r from-[#5500f8] to-[#d72638] flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-[#e2e2e2]"></div>
            </div>
            <p className="text-xl font-normal">Rent paid</p>
            <p className="text-4xl font-semibold bg-gradient-to-r from-[#5500f8] to-[#d72638] bg-clip-text text-transparent">
              $400
            </p>
          </div>
        ) : null}
      </div>

      {/* Payment history */}
      <div className={`flex flex-col mt-6 ${!residingPG ? `blur pointer-events-none`:``}`}>
        <div className="text-lg font-normal my-3 text-[23px]">
          Payment and cashback history
        </div>

        {/* Scrollable container with bottom gradient */}
        <div className="relative">
          <div className=" max-h-[420px] overflow-y-auto pr-2 no-scrollbar">
            <div className="flex flex-col gap-4">
              {pncHistory.map((data, i) => (
                <div key={i}>
                  {role === "tenant" ? (
                    <PaymentHistoryCard data={data} />
                  ) : (
                    <PaymentCollectionHistoryCard data={data} />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-10 pointer-events-none bg-gradient-to-t from-[#d9d9d9] via-[#d9d9d9]/80 to-transparent"></div>
        </div>
        {/* Bottom gradient overlay */}
      </div>
    </div>
  );
};

export default PaymentAbout;
