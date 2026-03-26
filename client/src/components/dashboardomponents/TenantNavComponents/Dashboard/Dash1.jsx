import React from "react";
import UserProfile from "./UserProfile";
import PaymentAbout from "./PaymentAbout";

const Dash1 = ({ pgData, formData , residingPG }) => {
  return (
    <div className="flex flex-col gap-8">
      <UserProfile formData={formData} />
      <PaymentAbout formData={formData} residingPG={residingPG} payments={pgData.payments} pgData={pgData}/>
    </div>
  );
};

export default Dash1;
