import DashboardComp from "./LandlordNavComponents/Dashboard/DashboardComp";
import RegisterPG from "./LandlordNavComponents/RegisterPG/RegisterPG";
import UpgradePlan from "./LandlordNavComponents/UpgradePlan/UpgradePlan";
import UpdateProfile from "./TenantNavComponents/UpdateProfile/UpdateProfile";
import UpdatePGInfo from "./LandlordNavComponents/UpdatePGInfo/UpdatePGInfo";
import ViewLegalDocs from "./TenantNavComponents/ViewLegalDocs/ViewLegalDocs";
import { useState } from "react";

const LandlordDashComponents = ({
  setBar,  
  user,
  setUser, 
  bar, 
  formData, 
  setFormData, 
  coords,
  ownedPGsData,
  loadingPGs,
  pgError
}) => {
  const [selectedPGIndex, setSelectedPGIndex] = useState(0);
  
  // Get the currently selected PG data
  const currentPGData = ownedPGsData && ownedPGsData.length > 0 
    ? ownedPGsData[selectedPGIndex] 
    : null;

  // Storing the number of PGs
  const ownedPGsLength = ownedPGsData.length;

  
  // Handle PG selection (if landlord owns multiple PGs)
  const handlePGSelection = (direction) => {
    setSelectedPGIndex((prevIndex) => {
      if (!ownedPGsData || ownedPGsData.length === 0) return 0;
      return (prevIndex + direction + ownedPGsData.length) % ownedPGsData.length;
    });
  };

  // console.log("user:",user);
  // console.log("formData:",formData);
  // console.log("ownedPGsData:",ownedPGsData);
  // console.log("loadingPGs:",loadingPGs);

  let component;
  
  switch (bar) {
    case 0:
      component = (
        <DashboardComp 
          formData={formData} 
          currentPGData={currentPGData}
          handlePGSelection={handlePGSelection}
          ownedPGsLength = {ownedPGsLength}
          loadingPGs={loadingPGs}
          pgError={pgError}
        />
      );
      break;
    case 1:
      component = (
        <RegisterPG
          setUser={setUser}
          user={user}
        />
      );
      break;
    case 2:
      component = (
        <UpdateProfile
          setUser={setUser}
          user={user}
          formData={formData}
          setFormData={setFormData}
        />
      );
      break;
    case 3:
      component = <ViewLegalDocs />;
      break;
    case 4:
      component = <UpgradePlan currentPlan = {currentPGData.plan} />;
      break;
    case 5:
      component = (
        <UpdatePGInfo 
          ownedPGsRID={formData.ownedPGs}
          ownedPGsData={ownedPGsData}
          loadingPGs={loadingPGs}
        />
      );
      break;
    default:
      component = (
        <DashboardComp 
          formData={formData}
          ownedPGsData={ownedPGsData}
          loadingPGs={loadingPGs}
          pgError={pgError}
        />
      );
      break;
  }

  return component;
};

export default LandlordDashComponents;