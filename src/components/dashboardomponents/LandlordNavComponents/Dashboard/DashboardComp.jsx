import React, { useState } from 'react';
import Dashboard from "./Dashboard";
import PGDash from "./PGDash";

const DashboardComp = ({user, formData, currentPGData ,handlePGSelection, ownedPGsLength  , loadingPGs, pgError }) => {

  return (
    <div className="w-full flex flex-col gap-4">
          <Dashboard 
            user={user}
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