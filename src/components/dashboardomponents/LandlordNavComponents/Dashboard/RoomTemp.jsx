import React, { useState, useEffect, useRef } from "react";

const handleInviteLink = async (roomId, PGID) => {
  const API_BASE = "http://localhost:5000"; // backend port
  try {
    const res = await fetch(`${API_BASE}/pgs/generate-tenant-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ PGID, roomId }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Error ${res.status}: ${text}`);
    }
    const data = await res.json();
    
    if (data.inviteLink) {
      await navigator.clipboard.writeText(data.inviteLink);
      alert("Invite link copied to clipboard!");
    } else {
      alert("Error generating invite link");
    }
  } catch (error) {
    console.error(error);
    alert("Failed to generate invite link");
  }
};

const RoomTemp = ({ roomId, roomType, tenants = [], rent, amenities = [], security, PGID, onRoomUpdate }) => {
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedTenants, setSelectedTenants] = useState([]);
  const [isRemoving, setIsRemoving] = useState(false);

  const isEmpty = tenants.length === 0;

  const getRoomCapacity = (type) => {
    if (!type) return Infinity;
    switch (type.toLowerCase()) {
      case 'single': return 1;
      case 'double': return 2;
      case 'triple': return 3;
      case 'quad': return 4;
      default: return Infinity; 
    }
  };
  
  const roomCapacity = getRoomCapacity(roomType);
  const isRoomFull = tenants.length >= roomCapacity;

  const getCurrentMonthPaymentStatus = (tenant) => {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
    const currentPayment = tenant.payments?.find(payment => payment.month === currentMonth);
    
    if (currentPayment) {
      return { text: "Rent Paid", status: "paid" };
    }
    
    const today = new Date();
    const dueDate = new Date(tenant.joinDate).getDate();
    const currentDay = today.getDate();
    
    if (currentDay < dueDate) {
      return { text: `Due in ${dueDate - currentDay} days`, status: "dueSoon" };
    } else {
      return { text: `${currentDay - dueDate} days overdue`, status: "overdue" };
    }
  };

  const handleCheckboxChange = (tenantId) => {
    setSelectedTenants(prev => {
      if (prev.includes(tenantId)) {
        return prev.filter(id => id !== tenantId);
      } else {
        return [...prev, tenantId];
      }
    });
  };

  const removeTenants = () => {
    setShowRemoveModal(true);
    setSelectedTenants([]);
  };

  const handleRemoveConfirm = async () => {
    if (selectedTenants.length === 0) {
      alert("Please select at least one tenant to remove");
      return;
    }

    setIsRemoving(true);
    const API_BASE = "http://localhost:5000";

    try {
      // Step 1: Clear currentPG from User model
      const userResponse = await fetch(`${API_BASE}/auth/clear-pg`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantIds: selectedTenants
        }),
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        throw new Error(errorData.error || "Failed to clear tenant PG data");
      }

      // Step 2: Remove tenants from PG room
      const pgResponse = await fetch(`${API_BASE}/pgs/remove-tenants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          PGID,
          roomId,
          tenantIds: selectedTenants
        }),
      });

      if (!pgResponse.ok) {
        const errorData = await pgResponse.json();
        throw new Error(errorData.error || "Failed to remove tenants from room");
      }

      const pgData = await pgResponse.json();
      alert(pgData.message || "Tenants removed successfully");
      
      setShowRemoveModal(false);
      setSelectedTenants([]);
      
      // Trigger parent component to reload data
      if (onRoomUpdate) {
        onRoomUpdate();
      }
    } catch (error) {
      console.error("Error removing tenants:", error);
      alert("Failed to remove tenants: " + error.message);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleCancelRemove = () => {
    setShowRemoveModal(false);
    setSelectedTenants([]);
  };

  useEffect(() => {
    const prev = {
      bodyOverflow: document.body.style.overflow,
      htmlOverflow: document.documentElement.style.overflow,
      bodyPaddingRight: document.body.style.paddingRight,
      bodyPosition: document.body.style.position,
      bodyTop: document.body.style.top,
    };

    if (showRemoveModal) {
      scrollYRef.current = window.scrollY || window.pageYOffset || 0;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";

      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.position = prev.bodyPosition ?? "";
      document.body.style.top = prev.bodyTop ?? "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = prev.bodyOverflow ?? "";
      document.documentElement.style.overflow = prev.htmlOverflow ?? "";
      document.body.style.paddingRight = prev.bodyPaddingRight ?? "";

      window.scrollTo(0, scrollYRef.current || 0);
    }

    return () => {
      document.body.style.position = prev.bodyPosition ?? "";
      document.body.style.top = prev.bodyTop ?? "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = prev.bodyOverflow ?? "";
      document.documentElement.style.overflow = prev.htmlOverflow ?? "";
      document.body.style.paddingRight = prev.bodyPaddingRight ?? "";
      window.scrollTo(0, scrollYRef.current || 0);
    };
  }, [showRemoveModal]);

  const scrollYRef = useRef(0);

  return (
    <>
      <div className="w-full bg-[#e2e2e2] rounded-[20px] p-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-[24px] font-medium text-[#5c5c5c]">
            Room {roomId}
          </p>
          <div className="flex gap-4">
            
              <button
                className="p-2.5 rounded-[12px] bg-[#cdcdcd] cursor-pointer"
                onClick={() => handleInviteLink(roomId, PGID)}
              >
                <img
                  src="../images/send.png"
                  alt="Invite"
                  className="h-[15px] w-[15px]"
                />
              </button>

            {isEmpty ? (
              <button className="p-2.5 rounded-[12px] bg-[#49C800]">
                <img
                  src="../images/whitetick.png"
                  alt=""
                  className="h-[15px] w-[15px]"
                />
              </button>
            ) : (
              <button
                className="bg-[#d72638] p-2 pl-3 pt-2.5 rounded-[12px] cursor-pointer"
                onClick={removeTenants}
              >
                <img
                  src="../images/logout.png"
                  alt=""
                  className="h-[18px] w-[18px]"
                />
              </button>
            )}
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            {isEmpty ? (
              <div className="flex flex-col gap-2 mb-4">
                <p className="text-[20px] font-medium text-[#5c5c5c]">
                  Tenant name
                </p>
                <p className="text-[20px] font-medium text-[#5c5c5c]">
                  Join date
                </p>
                <p className="text-[18px] text-[#5c5c5c]">No rent status</p>
              </div>
            ) : (
              tenants.map((tenant, i) => {
                const { text, status } = getCurrentMonthPaymentStatus(tenant);
                return (
                  <div key={i} className="flex flex-col gap-2 mb-4">
                    <p className="text-[20px] font-medium text-[#5c5c5c]">
                      Tenant name
                    </p>
                    <p className="text-[20px] font-medium text-[#5c5c5c]">
                      Join date
                    </p>
                    <p
                      style={{
                        color:
                          status === "dueSoon" || status === "overdue"
                            ? "#d72638"
                            : "#49C800",
                        fontWeight: "400",
                      }}
                      className="text-[18px]"
                    >
                      {text}
                    </p>
                  </div>
                );
              })
            )}
            <div className="flex flex-col gap-2">
              <p className="text-[20px] font-medium text-[#5c5c5c]">Rent</p>
              <p className="text-[20px] font-medium text-[#5c5c5c]">
                Security deposit
              </p>
              <p className="text-[20px] font-medium text-[#5c5c5c]">Room type</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            {isEmpty ? (
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex gap-16">
                  <p className="text-[20px] text-[#5c5c5c]">Empty</p>
                </div>
                <p className="text-[20px] text-[#5c5c5c]">Empty</p>
                <p className="mb-7"></p>
              </div>
            ) : (
              tenants.map((tenant, i) => (
                <div key={i} className="flex flex-col gap-2 mb-4">
                  <div className="flex gap-16">
                    <p className="text-[20px] text-[#5c5c5c]">
                      {tenant.tenantDetails ? 
                        `${tenant.tenantDetails.firstName} ${tenant.tenantDetails.lastName}` : 
                        `Tenant ${i + 1}`
                      }
                    </p>
                  </div>
                  <p className="text-[20px] text-[#5c5c5c]">
                    {new Date(tenant.joinDate).toLocaleDateString()}
                  </p>
                  <p className="mb-7"></p>
                </div>
              ))
            )}
            <div className="flex flex-col gap-2">
              <p className="text-[20px] text-[#5c5c5c]">₹{rent || 0}</p>
              <p className="text-[20px] text-[#5c5c5c]">₹{security || 0}</p>
              <p className="text-[20px] text-[#5c5c5c] capitalize">{roomType || 'N/A'}</p>
            </div>
          </div>
        </div>
        
        {amenities && amenities.length > 0 && (
          <div className="mt-4">
            <p className="text-[18px] font-medium text-[#5c5c5c] mb-2">Amenities:</p>
            <div className="flex flex-wrap gap-2">
              {amenities.map((amenity, index) => (
                <span 
                  key={index} 
                  className="bg-[#cdcdcd] px-3 py-1 rounded-full text-[14px] text-[#5c5c5c]"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}
        
      </div>

      {/* Remove Tenants Modal */}
      {showRemoveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[20px] p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-[24px] font-medium text-[#5c5c5c] mb-4">
              Remove Tenants from Room {roomId}
            </h2>

            <div className="mb-6 max-h-[300px] overflow-y-auto">
              {tenants.map((tenant) => {
                const tenantId = tenant.tenantDetails?._id || tenant.tenantId;
                const tenantName = tenant.tenantDetails
                  ? `${tenant.tenantDetails.firstName} ${tenant.tenantDetails.lastName}`
                  : tenantId;

                return (
                  <div key={tenantId} className="flex items-center gap-3 mb-3 p-3 bg-[#f5f5f5] rounded-[12px]">
                    <input
                      type="checkbox"
                      id={`tenant-${tenantId}`}
                      checked={selectedTenants.includes(tenantId)}
                      onChange={() => handleCheckboxChange(tenantId)}
                      className="w-5 h-5 cursor-pointer"
                    />
                    <label
                      htmlFor={`tenant-${tenantId}`}
                      className="text-[18px] text-[#5c5c5c] cursor-pointer flex-1"
                    >
                      <div className="font-medium">{tenantName}</div>
                      <div className="text-[14px] text-[#8c8c8c]">ID: {tenantId}</div>
                    </label>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleCancelRemove}
                disabled={isRemoving}
                className="flex-1 bg-[#cdcdcd] text-[#5c5c5c] py-3 rounded-[12px] font-medium text-[18px] cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveConfirm}
                disabled={isRemoving || selectedTenants.length === 0}
                className="flex-1 bg-[#d72638] text-white py-3 rounded-[12px] font-medium text-[18px] cursor-pointer disabled:opacity-50"
              >
                {isRemoving ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RoomTemp;