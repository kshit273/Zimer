import React from "react";
import Dashboard from "./Dashboard";
import LeaveReview from "./LeaveReview";
import SavedPGs from "./SavedPGs";

const DashboardComp = ({ user, formData, PGData, loadingPGs, pgError, residingPG }) => {
  return (
    <div className="w-full flex flex-col gap-4">
      <Dashboard pgData={PGData} loading={loadingPGs} error={pgError} user={user} formData={formData} residingPG={residingPG} />
      <SavedPGs />
      <LeaveReview pgId={PGData.RID} />
    </div>
  );
};

export default DashboardComp;
