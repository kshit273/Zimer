import React from "react";

const PGAbout = ({ handlePGSelection, formData, pgData, loading, error, length }) => {
  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col gap-2 w-full">
        <div className="h-20 bg-[#e8e8e8] rounded-[20px] animate-pulse my-4"></div>
        <div className="flex gap-2 w-full">
          <div className="flex gap-5 w-full">
            <div className="h-[300px] w-[300px] min-w-[300px] rounded-[30px] bg-[#e8e8e8] animate-pulse flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <div className="h-12 bg-[#e8e8e8] rounded animate-pulse mb-4"></div>
              <div className="h-9 bg-[#e8e8e8] rounded animate-pulse mb-6 w-3/4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-[#e8e8e8] rounded animate-pulse"></div>
                <div className="h-4 bg-[#e8e8e8] rounded animate-pulse"></div>
                <div className="h-4 bg-[#e8e8e8] rounded animate-pulse"></div>
                <div className="h-4 bg-[#e8e8e8] rounded animate-pulse w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="flex items-center justify-center h-[300px] bg-[#e8e8e8] rounded-[30px]">
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

  // Main component render (success state)
  return (
    <div className="flex flex-col gap-5">
      <p className="text-4xl font-medium my-4">
        {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}{" "}
        Dashboard
      </p>
      <div className="flex gap-2">
        {length > 1 ? <div className="flex items-center">
          <button className="flex items-center justify-center w-[35px] h-[35px] bg-[#464646] rounded-full hover:bg-[#333] transition-colors" 
          onClick={() => handlePGSelection(-1)}>
            <img src="../images/arrowWhite.png" alt="previous" className="h-[15px] w-[15px] rotate-180" />
          </button>
        </div> : null}
        <div className="flex gap-5">
          <div className="h-[300px] w-[300px] min-w-[300px] rounded-[30px] bg-[#1a1a1a] relative overflow-hidden">
            {formData.role === "tenant" && (
              <div className="absolute top-3 right-3 flex gap-3 items-center z-10">
                <div className="w-[40px] h-[40px] bg-[#cdcdcd] rounded-full p-2">
                  <img src="../images/call.png" alt="Call" />
                </div>
                <div className="w-[40px] h-[40px] bg-[#cdcdcd] rounded-full p-1.5">
                  <img src="../images/message.png" alt="Message" />
                </div>
              </div>
            )}
            
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
                  {formData.firstName && formData.lastName 
                    ? `${formData.firstName} ${formData.lastName}` 
                    : "Owner information not available"}
                </p>
              </div>
              
              <div className="flex gap-5">
                <p>PG status</p>
                <p className="font-light">{pgData.plan || "Status not available"}</p>
              </div>
              
              {formData.role === "tenant" ? (
                <div className="flex gap-5">
                  <p>Current Rent</p>
                  <p className="font-light">$400</p>
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
                  <p className="font-light">105</p>
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
              <p className="font-light italic px-2">staying since may 2025</p>
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