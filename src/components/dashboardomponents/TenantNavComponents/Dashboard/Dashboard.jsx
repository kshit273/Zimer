import React from "react";
import Dash1 from "./Dash1";
import Dash2 from "./Dash2";
import Dash3 from "./Dash3";

const Dashboard = ({ formData, user, pgData, loading, error, residingPG }) => {
  return (
    <div className="w-full grid grid-cols-14 gap-4 bg-[#d9d9d9] p-4 rounded-[20px]">
      <div className="col-span-4">
        <Dash1 formData={formData} residingPG={residingPG}/>
      </div>
      <div className="col-span-6">
        <Dash2 formData={formData} 
          pgData={pgData}
          loading={loading} 
          error={error} 
          residingPG={residingPG}
          />
      </div>
      <div className="col-span-4">
        <Dash3 user={user} residingPG={residingPG} pgData={pgData}/>
      </div>
    </div>
  );
};

export default Dashboard;
