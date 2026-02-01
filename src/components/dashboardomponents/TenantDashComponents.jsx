import React from "react";
import DashboardComp from "./TenantNavComponents/Dashboard/DashboardComp";
import UpdateProfile from "./TenantNavComponents/UpdateProfile/UpdateProfile";
import RoomsHistory from "./TenantNavComponents/RoomsHistory/RoomsHistory";
import ViewLegalDocs from "./TenantNavComponents/ViewLegalDocs/ViewLegalDocs";
import LeavePG from "./TenantNavComponents/LeavePG/LeavePG";

const TenantDashComponents = ({ 
  rentalHistory,
  setUser, 
  bar, 
  formData, 
  setFormData, 
  PGData,
  loadingPGs,
  pgError,
  residingPG
 }) => {
  let component;
  switch (bar) {
    case 0:
      component = <DashboardComp 
          formData={formData} 
          PGData={PGData}
          loadingPGs={loadingPGs}
          pgError={pgError}
          residingPG={residingPG}
        />;
      break;
    case 1:
      component = (
        <UpdateProfile
          setUser={setUser}
          formData={formData}
          setFormData={setFormData}
        />
      );
      break;
    case 2:
      component = <RoomsHistory rentalHistory={rentalHistory}/>;
      break;
    case 3:
      component = <ViewLegalDocs />;
      break;
    case 4:
      component = <LeavePG roomNumber={PGData.room} pgId={PGData.RID} currentUserId={formData._id}/>;
      break;
    default:
      component = <DashboardComp />;
      break;
  }

  return component;
};

export default TenantDashComponents;
