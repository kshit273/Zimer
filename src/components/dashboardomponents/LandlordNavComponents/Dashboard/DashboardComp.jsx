import React, { useState } from 'react';
import Dashboard from "./Dashboard";
import PGDash from "./PGDash";

const DashboardComp = ({ formData, currentPGData ,handlePGSelection, ownedPGsLength  , loadingPGs, pgError, setToast}) => {

    // Loading state
  if (loadingPGs) {
    return (
        <div className="flex gap-4 my-4 w-full px-4">
          <div className='flex flex-col gap-4 w-full'>
            <div className='flex gap-2 w-full'>
              <div className='h-[200px] w-[300px] bg-[#d2d2d2] rounded-[30px] animate-pulse'></div>
              <div className='flex flex-col gap-1 w-full'>
                <div className='h-[30px] w-full bg-[#d2d2d2] rounded-[30px] animate-pulse'></div>
                <div className='h-[30px] w-full bg-[#d2d2d2] rounded-[30px] animate-pulse'></div>
              </div>
            </div>
            <div className='h-[600px] w-full bg-[#d2d2d2] rounded-[30px] animate-pulse'></div>
          </div>
          <div className='flex flex-col gap-4 w-full'>
            <div className='h-[400px] w-full bg-[#d2d2d2] rounded-[30px] animate-pulse'></div>
            <div className='h-[400px] w-full bg-[#d2d2d2] rounded-[30px] animate-pulse'></div>
          </div>
          <div className='flex flex-col gap-4 w-full'>
            <div className='h-[200px] w-full bg-[#d2d2d2] rounded-[30px] animate-pulse'></div>
            <div className='h-[600px] w-full bg-[#d2d2d2] rounded-[30px] animate-pulse'></div>
          </div>
        </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
          <Dashboard 
            formData={formData} 
            pgData={currentPGData} 
            error={pgError} 
            handlePGSelection={handlePGSelection}
            length={ownedPGsLength}
            setToast={setToast}
          />
          <PGDash 
            pgData={currentPGData} 
            loading={loadingPGs} 
            error={pgError} 
            setToast={setToast}
          />
    </div>
  );
};

export default DashboardComp;