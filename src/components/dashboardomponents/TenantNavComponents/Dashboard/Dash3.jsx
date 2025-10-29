import React from "react";
import RentDue from "./RentDue";
import Notifications from "./Notifications";

const Dash3 = ({user, residingPG, pgData}) => {

  return (
    <div className={`h-full flex flex-col ${!residingPG ? `blur pointer-events-none`:``}`}>
      <RentDue pgData={pgData}/>
      <Notifications user={user}/>
    </div>
  );
};

export default Dash3;
