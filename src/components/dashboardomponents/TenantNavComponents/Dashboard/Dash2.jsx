// Dash2.jsx
import React from "react";
import PGAbout from "./PGAbout";
import MonthlyRentStatus from "./MonthlyRentStatus";
import ZTRS from "./ZTRS";

// Helper function to calculate sequential paid months
const calculateSequentialPaidMonths = (joinDate, payments) => {
  if (!joinDate || !Array.isArray(payments) || payments.length === 0) {
    return [];
  }

  const startMonth = new Date(joinDate).getMonth();
  const paidMonths = [];
  
  // Sort payments by date to ensure chronological order
  const sortedPayments = [...payments]
    .filter(p => p?.paidOn)
    .sort((a, b) => new Date(a.paidOn) - new Date(b.paidOn));

  // Add months sequentially starting from join month
  let currentMonthToAdd = startMonth;
  
  for (let i = 0; i < sortedPayments.length; i++) {
    paidMonths.push(currentMonthToAdd);
    currentMonthToAdd = (currentMonthToAdd + 1) % 12;
  }

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