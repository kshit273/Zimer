// Dash2.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import PGAbout from "./PGAbout";
import MonthlyRentStatus from "./MonthlyRentStatus";
import ZTRS from "./ZTRS";

// Helper function to calculate sequential paid months
const calculateSequentialPaidMonths = (joinDate, payments) => {
  
  if (!joinDate || !Array.isArray(payments) || payments.length === 0) {
    return [];
  }

  // Extract the month strings from payments
  const paidMonths = payments
    .filter(p => p?.month)
    .map(p => p.month);

  return paidMonths;
};

const Dash2 = ({ formData, pgData, loading, error, residingPG, postReport }) => {
  const [ztrsData, setZtrsData] = useState({ finalScore: null, timeline: [] });
  const [ztrsLoading, setZtrsLoading] = useState(true);

  const joinDate = pgData?.joinFrom
    ? new Date(pgData.joinFrom).toISOString().split("T")[0]
    : null;

  // Calculate sequential paid months
  const paidMonths = calculateSequentialPaidMonths(joinDate, pgData?.payments);

  // Fetch ZTRS data
  useEffect(() => {
    const fetchZTRS = async () => {
      try {
        setZtrsLoading(true);
        const res = await axios.get("http://localhost:5000/auth/ztrs", {
          withCredentials: true,
        });
        if (res.data.success) {
          setZtrsData({
            finalScore: res.data.finalScore,
            timeline: res.data.timeline || [],
          });
        }
      } catch (err) {
        console.error("Failed to fetch ZTRS:", err);
      } finally {
        setZtrsLoading(false);
      }     
    };
    fetchZTRS();
  }, []);

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-10">
      <div className="col-span-2">
        <PGAbout 
          formData={formData} 
          pgData={pgData}   
          loading={loading} 
          error={error}
          residingPG={residingPG}
          postReport={postReport}
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
        <ZTRS
          finalScore={ztrsData.finalScore}
          timeline={ztrsData.timeline}
          loading={ztrsLoading}
        />
      </div>
    </div>
  );
};

export default Dash2;