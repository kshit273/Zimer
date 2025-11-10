// Dash2.jsx
import React from "react";
import PGAbout from "./PGAbout";
import MonthlyRentStatus from "./MonthlyRentStatus";
import ZTRS from "./ZTRS";

// Helper function to calculate sequential paid months
const calculateSequentialPaidMonths = (joinDate, payments) => {
  console.log("joinDate:", joinDate);
  console.log("payments:", payments);
  
  if (!joinDate || !Array.isArray(payments) || payments.length === 0) {
    return [];
  }

  // Extract the month strings from payments
  const paidMonths = payments
    .filter(p => p?.month)
    .map(p => p.month);

  console.log("paidMonths:", paidMonths);
  return paidMonths;
};

const Dash2 = ({ formData, pgData, loading, error, residingPG }) => {
  const joinDate = pgData?.joinFrom
    ? new Date(pgData.joinFrom).toISOString().split("T")[0]
    : null;

  // Calculate sequential paid months
  const paidMonths = calculateSequentialPaidMonths(joinDate, pgData?.payments);

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-10">
      <div className="col-span-2">
        <PGAbout 
          formData={formData} 
          pgData={pgData}   
          loading={loading} 
          error={error}
          residingPG={residingPG}
        />
      </div>

      <div>
        <MonthlyRentStatus
          start={joinDate}
          paidMonths={paidMonths}
          residingPG={residingPG}
        />
      </div>

      <div>
        <ZTRS percentage={56} />
      </div>
    </div>
  );
};

export default Dash2;