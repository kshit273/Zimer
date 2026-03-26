import React from "react";
import Dashboard from "./Dashboard";
import LeaveReview from "./LeaveReview";
import SavedPGs from "./SavedPGs";

const DashboardComp = ({ formData, PGData, loadingPGs, pgError, residingPG, setToast }) => {

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
      <Dashboard pgData={PGData} loading={loadingPGs} error={pgError} formData={formData} residingPG={residingPG} setToast={setToast} />
      <SavedPGs savedPGs={formData.savedPGs}/>
      <LeaveReview pgId={PGData.RID} />
    </div>
  );
};

export default DashboardComp;
