import React, { useState, useEffect } from "react";

const PGAbout = ({ handlePGSelection, formData, pgData, error, length, residingPG }) => {
  const [ownerName, setOwnerName] = useState(pgData?.Ownername || "not available");

  useEffect(() => {
    if (pgData?.Ownername) {
      setOwnerName(pgData.Ownername);
    }
  }, [pgData]);

  console.log('Data at PGAbout:',pgData)
  // Error state
  if (error) {
    return (
      <div className="flex flex-col gap-5">
        <p className="text-4xl font-medium my-4">
          {formData?.role ? 
            formData.role.charAt(0).toUpperCase() + formData.role.slice(1) + " Dashboard" : 
            "Dashboard"
          }
        </p>
        <div className="flex items-center justify-center h-[300px] bg-red-50 border border-red-200 rounded-[30px]">
          <div className="text-center p-6">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-red-700 mb-2">
              Unable to load PG information
            </h3>
            <p className="text-red-600 mb-4">
              {typeof error === 'string' ? error : 'An unexpected error occurred'}
            </p>
            <button 
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle missing or incomplete data
  if (!pgData) {
    return (
      <div className="flex flex-col gap-5">
        <p className="text-4xl font-medium my-4">
          {formData?.role ? 
            formData.role.charAt(0).toUpperCase() + formData.role.slice(1) + " Dashboard" : 
            "Dashboard"
          }
        </p>
        <div className="flex items-center justify-center h-[300px] bg-[#e2e2e2] rounded-[30px]">
          <div className="text-center p-6">
            <div className="text-yellow-500 text-6xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-yellow-700 mb-2">
              No PG information available
            </h3>
            <p className="text-[#464646]">
              Either you have not registered a PG or check your connection.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Handle missing formData
  if (!formData) {
    return (
      <div className="flex flex-col gap-5">
        <p className="text-4xl font-medium my-4">Dashboard</p>
        <div className="flex items-center justify-center h-[300px] bg-blue-50 border border-blue-200 rounded-[30px]">
          <div className="text-center p-6">
            <div className="text-blue-500 text-6xl mb-4">👤</div>
            <h3 className="text-lg font-semibold text-blue-700 mb-2">
              User information not available
            </h3>
            <p className="text-blue-600">
              Please log in again to view your dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  //changing the format of date from ISO to letters
  const isoDate = pgData.joinFrom;
  const date = new Date(isoDate);

  // Format to "Month YYYY"
  const formattedDate = date.toLocaleString("en-US", { month: "long", year: "numeric" });

  // Main component render (success state)
  return (
    <div className="flex flex-col gap-5">
      <p className="text-4xl font-medium my-4">
        {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}{" "}
        Dashboard
      </p>
      <div className={`flex gap-2 ${!residingPG ? `blur pointer-events-none`:``}`}>
        {length > 1 ? <div className="flex items-center">
          <button className="flex items-center justify-center w-[35px] h-[35px] bg-[#464646] rounded-full hover:bg-[#333] transition-colors" 
          onClick={() => handlePGSelection(-1)}>
            <img src="../images/arrowWhite.png" alt="previous" className="h-[15px] w-[15px] rotate-180" />
          </button>
        </div> : null}
        <div className="flex gap-5">
          <div className="h-[300px] w-[300px] min-w-[300px] rounded-[30px] bg-[#1a1a1a] relative overflow-hidden">       
            {pgData.coverPhoto ? (
              <img 
                src={`http://localhost:5000${pgData.coverPhoto}`} 
                alt="PG Cover" 
                className="w-full h-full object-cover rounded-[30px]"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            
            {/* Fallback for missing or failed image */}
            <div 
              className="w-full h-full flex items-center justify-center text-[#888] text-sm"
              style={{ display: pgData.coverPhoto ? 'none' : 'flex' }}
            >
              No photo available
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-center p-2">
              <p className="text-2xl font-medium text-[#464646]">
                {pgData.pgName || "PG Name Not Available"}
              </p>
              {formData.role === "tenant" && (
                <div className="w-[35px] h-[35px] bg-[#cdcdcd] rounded-full p-2.5">
                  <img src="../images/report.png" alt="Report" />
                </div>
              )}
            </div>
            
            <p className="p-2 text-[#464646]">
              {pgData.address || "Address not provided"}
            </p>
            
            <div className="py-3 flex flex-col gap-1 text-[16px] px-2">
              <div className="flex gap-5">
                <p>PG owner</p>
                <p className="font-light">
                  {ownerName || (formData.role === 'landlord' ? `${formData.firstName} ${formData.lastName}` : 'not available')}
                </p>
              </div>
              
              <div className="flex gap-5">
                <p>PG status</p>
                <p className="font-light">{pgData.plan || "Status not available"}</p>
              </div>
              
              {formData.role === "tenant" ? (
                <div className="flex gap-5">
                  <p>Current Rent</p>
                  <p className="font-light">₹ {pgData.rent || "Rent not available"}</p>
                </div>
              ) : (
                <div className="flex gap-5">
                  <p>Total rooms</p>
                  <p className="font-light">
                    {pgData.rooms ? pgData.rooms.length : "N/A"}
                  </p>
                </div>
              )}

              {formData.role === "tenant" ? (
                <div className="flex gap-5">
                  <p>Room no.</p>
                  <p className="font-light">{pgData.room}</p>
                </div>
              ) : (
                <div className="flex gap-5">
                  <p>Occupied rooms</p>
                  <p className="font-light">
                    {pgData.rooms 
                      ? pgData.rooms.filter(room => room.tenants && room.tenants.length > 0).length 
                      : "N/A"}
                  </p>
                </div>
              )}
            </div>
            
            {formData.role === "tenant" && (
              <p className="font-light italic px-2">staying since {formattedDate}</p>
            )}
          </div>
        </div>
        {length > 1 ? <div className="flex items-center">
          <button className="flex items-center justify-center w-[35px] h-[35px] bg-[#464646] rounded-full hover:bg-[#333] transition-colors"
          onClick={() => handlePGSelection(1)}>
            <img src="../images/arrowWhite.png" alt="next" className="h-[15px] w-[15px]" />
          </button>
        </div> : null}
        
      </div>
    </div>
  );
};

export default PGAbout;