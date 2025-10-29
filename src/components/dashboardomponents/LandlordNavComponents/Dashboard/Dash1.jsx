import React from "react";

import UserProfile from "../../TenantNavComponents/Dashboard/UserProfile";
import PaymentAbout from "../../TenantNavComponents/Dashboard/PaymentAbout";

const Dash1 = ({ formData }) => {
  return (
    <div className="flex flex-col gap-8">
      <UserProfile formData={formData} />
      <PaymentAbout formData={formData} residingPG={true}/>
    </div>
  );
};

export default Dash1;
