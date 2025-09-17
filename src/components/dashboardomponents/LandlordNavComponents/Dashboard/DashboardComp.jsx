import React, { useState } from 'react';
import Dashboard from "./Dashboard";
import PGDash from "./PGDash";

const DashboardComp = ({setBar, formData, ownedPGsData, loadingPGs, pgError }) => {
  const [selectedPGIndex, setSelectedPGIndex] = useState(0);
  
  // Get the currently selected PG data
  const currentPGData = ownedPGsData && ownedPGsData.length > 0 
    ? ownedPGsData[selectedPGIndex] 
    : null;

  // Storing the number of PGs
  const ownedPGsLength = ownedPGsData.length;

  // Handle PG selection (if landlord owns multiple PGs)
  const handlePGSelection = (direction) => {
    setSelectedPGIndex((prevIndex) => {
      if (!ownedPGsData || ownedPGsData.length === 0) return 0;
      return (prevIndex + direction + ownedPGsData.length) % ownedPGsData.length;
    });
  };

  return (
    <div className="w-full flex flex-col gap-4">
          <Dashboard 
            formData={formData} 
            pgData={currentPGData} 
            loading={loadingPGs} 
            error={pgError} 
            handlePGSelection={handlePGSelection}
            length={ownedPGsLength}
          />
          <PGDash 
            pgData={currentPGData} 
            loading={loadingPGs} 
            error={pgError} 
          />
    </div>
  );
};

export default DashboardComp;