import React from "react";
import Dash1 from "./Dash1";
import Dash2 from "./Dash2";
import Dash3 from "./Dash3";

const Dashboard = ({ handlePGSelection, formData, pgData, error, length, setToast }) => {
  return (
    <div className="w-full grid grid-cols-14 gap-4 bg-[#d9d9d9] p-4 rounded-[20px]">
      <div className="col-span-4">
        <Dash1 formData={formData} pgData={pgData}/>
      </div>
      <div className="col-span-6">
        <Dash2 formData={formData} 
            pgData={pgData} 
            length={length}
            error={error} 
            handlePGSelection={handlePGSelection}
            />
      </div>
      <div className="col-span-4">
        {pgData ? <Dash3 pgId={pgData.RID} formData={formData} setToast={setToast}/> : 
        <div className="flex flex-col gap-2 bg-[#d9d9d9] rounded-[35px] p-6 ">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[24px] font-medium text-[#1a1a1a]">
                Notifications
              </h2>
            </div>
            <div className="flex justify-center items-center mb-4 pt-8" >
              <p className="text-gray-500">No notification found</p>
            </div>
        </div>
        }
      </div>
    </div>
  );
};

export default Dashboard;
