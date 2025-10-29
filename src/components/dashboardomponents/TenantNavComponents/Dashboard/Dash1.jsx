import React from "react";
import UserProfile from "./UserProfile";
import PaymentAbout from "./PaymentAbout";

const Dash1 = ({ formData , residingPG }) => {
  return (
    <div className="flex flex-col gap-8">
      <UserProfile formData={formData} />
      <PaymentAbout formData={formData} residingPG={residingPG}/>
    </div>
  );
};

export default Dash1;
