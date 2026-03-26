import React from "react";
import RentDue from "./RentDue";
import Notifications from "./Notifications";

const Dash3 = ({formData, residingPG, pgData, setToast}) => {

  return (
    <div className={`h-full flex flex-col ${!residingPG ? `blur pointer-events-none`:``}`}>
      <RentDue pgData={pgData} setToast={setToast}/>
      <Notifications formData={formData}/>
    </div>
  );
};

export default Dash3;
