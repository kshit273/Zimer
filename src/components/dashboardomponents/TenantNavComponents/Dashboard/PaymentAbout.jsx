import React from "react";
import PaymentHistoryCard from "./PaymentHistoryCard";
import PaymentCollectionHistoryCard from "../../LandlordNavComponents/Dashboard/PaymentCollectionHistoryCard";

const PaymentAbout = ({ payments, formData, residingPG, pgData }) => {
  const role = formData.role;

  // ✅ Convert payments array into unified format
  const pncHistory = (payments || []).map((p) => {
    const paidDate = new Date(p.paidOn);
    const formattedDate = paidDate.toISOString().split("T")[0]; // "YYYY-MM-DD"
    const formattedTime = paidDate.toTimeString().split(" ")[0]; // "HH:MM:SS"

    // For landlord: use tenant info from payment object
    // For tenant: use own info from formData
    let firstName, lastName, room;
    
    if (role === "landlord") {
      // Get tenant info from payment record
      firstName = p.tenantFirstName || p.firstName || "Unknown";
      lastName = p.tenantLastName || p.lastName || "";
      room =  p.roomId || "N/A";
    } else {
      // Tenant viewing their own payments
      firstName = p.firstName || "Unknown";
      lastName = p.lastName || "";
      room = p.room || "N/A";
    }

    return {
      month: p.month || "Unknown",
      rent: p.amount || 0,
      date: formattedDate,
      time: formattedTime,
      cashback: p.cashback || 100, // Use from payment or fallback
      firstName: firstName,
      lastName: lastName,
      room: room,
      pgName: pgData?.name || p.pgName || "Unknown PG",
    };
  });

  return (
    <div>
      {/* Top cards */}
      <div className="flex gap-4">
        {/* Cashback earned / Rent Collected */}
        <div className="relative bg-[#e2e2e2] rounded-[20px] flex flex-col gap-4 items-center justify-center py-6 px-5">
          <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full border-8 border-[#464646] bg-[#4EC840] flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-[#e2e2e2]"></div>
          </div>
          <p className="text-xl font-normal">
            {role === "tenant" ? `Cashback earned` : `Rent Collected`}
          </p>
          <p className="text-4xl font-medium text-[#4EC840]">
            ₹
            {role === "tenant" 
              ? pncHistory.reduce((acc, cur) => acc + (cur.cashback || 0), 0)
              : pncHistory.reduce((acc, cur) => acc + (cur.rent || 0), 0)
            }
          </p>
        </div>

        {/* Rent paid (tenant only) */}
        {role === "tenant" && (
          <div className="relative bg-[#e2e2e2] rounded-[20px] flex flex-col gap-4 items-center justify-center py-6 px-17">
            <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full border-8 border-[#464646] bg-gradient-to-r from-[#5500f8] to-[#d72638] flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-[#e2e2e2]"></div>
            </div>
            <p className="text-xl font-normal">Rent paid</p>
            <p className="text-4xl font-semibold bg-gradient-to-r from-[#5500f8] to-[#d72638] bg-clip-text text-transparent">
              ₹{pncHistory.reduce((acc, cur) => acc + cur.rent, 0)}
            </p>
          </div>
        )}
      </div>

      {/* Payment history section */}
      <div
        className={`flex flex-col mt-6 ${
          !residingPG ? `blur pointer-events-none` : ``
        }`}
      >
        <div className="text-lg font-normal my-3 text-[23px]">
          {role === "tenant" ? "Payment and cashback history" : "Payment collection history"}
        </div>

        <div className="relative">
          <div className="max-h-[420px] overflow-y-auto pr-2 no-scrollbar">
            <div className="flex flex-col gap-4">
              {pncHistory.length > 0 ? (
                [...pncHistory].reverse().map((data, i) => (
                  <div key={i}>
                    {role === "tenant" ? (
                      <PaymentHistoryCard data={data} />
                    ) : (
                      <PaymentCollectionHistoryCard data={data} />
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center mt-10">
                  No payments yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentAbout;