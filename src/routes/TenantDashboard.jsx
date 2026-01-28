import React, { useEffect, useState } from "react";
import BackBtn from "../components/dashboardomponents/BackBtn";
import DashboardNav from "../components/dashboardomponents/DashboardNav";
import TenantDashComponents from "../components/dashboardomponents/TenantDashComponents";
import Logout from "../components/Logout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TenantDashboard = ({ user, setUser, coords }) => {
  const [bar, setBar] = useState(0);
  const [residingPG, setresidingPG] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [rentalHistory, setRentalHistory] = useState([]);
  const [joinAndLeaveDates, setJoinAndLeaveDates] = useState([]);
  const [currentPGData, setCurrentPGData] = useState({
    LID: "",
    RID: "",
    address:"",
    plan:"",
    rent:0,
    room:0,
    joinFrom:"",
    coverPhoto:"",
    pgName:"",
    payments:[],
    ownerFirstName:"",
    ownerLastName:"",
  });
  const [loadingPGs, setLoadingPGs] = useState(false);
  const [pgError, setPgError] = useState(null);
  
  const [formData, setFormData] = useState({
    _id: user?._id || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    dob: user?.dob || "",
    gender: user?.gender || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "",
    profilePicture: user?.profilePicture || "",
    password: "",
    currentPG: user?.currentPG || "", 
  });


  const tenantNavList = [
    "Dashboard",
    "Update Profile",
    "Rooms History",
    "View Legal docs",
    "Leave PG",
    "Log out",
  ];
  
  const navigate = useNavigate();
  
  const handleLogOut = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/auth/logout",
        {},
        { withCredentials: true }
      );
      console.log(res.data.message);

      // clear user state
      setUser(null);

      // redirect to home/login
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err.response?.data || err.message);
    }
  };

  // Fetch user data including currentPG
  useEffect(() => {
  const fetchUserData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/auth/me", {
        withCredentials: true,
      });

      // ⛔ Role protection
    if (res.data.role !== "tenant") {
      navigate("/");
      return;
    }
      
      setFormData((prev) => ({
        ...prev,
        _id: res.data._id || "",
        firstName: res.data.firstName || "",
        lastName: res.data.lastName || "",
        dob: res.data.dob || "",
        gender: res.data.gender || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        role: res.data.role || "",
        profilePicture: res.data.profilePicture || "",
        currentPG: res.data.currentPG || "",
      }));

      // Set rental history RIDs
      const tempRentalHistory = res.data.rentalHistory?.map((room) => room.RID) || [];
      setRentalHistory(tempRentalHistory);
      const rentalJoinAndLeaveDates = res.data.rentalHistory?.map((room)=> ({RID:room.RID, joinedFrom:room.joinedFrom}));
      // console.log(rentalJoinAndLeaveDates)
      setJoinAndLeaveDates(rentalJoinAndLeaveDates);
      
      // Update user state with fresh data
      if (setUser) {
        setUser(res.data);
      }

      // Update residing PG state (if applicable)
      if (res.data.currentPG) {
        setresidingPG(true);
      } else {
        setresidingPG(false);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  fetchUserData();
}, [setUser]);

  useEffect(() => {
  const fetchCurrentPGData = async () => {
    setLoadingPGs(true);
    setPgError(null);
    
    try {
      const response = await axios.get(
        `http://localhost:5000/pgs/${formData.currentPG}`,
        { withCredentials: true }
      );
      const pgData = response.data;

      // Find the room and tenant data for current user
      let userRoomData = null;
      let userTenantData = null;
      
      for (const room of pgData.rooms) {
        const tenant = room.tenants.find(t => t.tenantId === formData._id || t.tenantId?._id === formData._id);
        if (tenant) {
          userRoomData = room;
          userTenantData = tenant;
          break;
        }
      }

      if (userRoomData && userTenantData) {
        setCurrentPGData({
          LID: pgData.LID || "",
          RID: pgData.RID || "",
          address: pgData.address || "",
          plan: pgData.plan || "",
          rent: userRoomData.rent || 0,
          room: userRoomData.roomId || "",
          joinFrom: userTenantData.joinDate || "",
          coverPhoto: pgData.coverPhoto || "",
          pgName:pgData.pgName || "",
          payments: userTenantData.payments || []
        });
      } else {
        console.warn("User not found in any room");
        setCurrentPGData({
          LID: "",
          RID: "",
          address: "",
          plan: "",
          rent: 0,
          room: "",
          joinFrom: "",
          payments: []
        });
      }
    } catch (error) {
      console.error("Error fetching current PG data:", error);
      setPgError("Failed to load PG data");
      setCurrentPGData({
        LID: "",
        RID: "",
        address: "",
        plan: "",
        rent: 0,
        room: "",
        joinFrom: "",
        payments: []
      });
    } finally {
      setLoadingPGs(false);
    }
  };

  if (formData.currentPG) {
    fetchCurrentPGData();
  }
}, [formData.currentPG, formData._id]);

  useEffect(() => {
  const fetchOwnerData = async () => {
    if (!currentPGData.LID) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/auth/tenants-batch",
        { tenantIds: [currentPGData.LID] },
        { withCredentials: true }
      );

      const { tenants } = response.data;

      if (tenants && tenants.length > 0) {
        const ownerInfo = tenants[0]; // assuming one ID = one tenant

        setCurrentPGData((prev) => ({
          ...prev,
          ownerFirstName: ownerInfo.firstName || "",
          ownerLastName: ownerInfo.lastName || "",
        }));
      } else {
        console.warn("No tenant found for given LID");
      }
    } catch (error) {
      console.error("❌ Error fetching owner data:", error);
    }
  };

  fetchOwnerData();
}, [currentPGData.LID]);

  useEffect(() => {
    const fetchRentalHistory = async () => {
      if (!rentalHistory || rentalHistory.length === 0 || typeof rentalHistory[0] !== 'string') {
        return; // Exit if no RIDs or already processed
      }
      
      try {
        // Fetch all PG data for the rental history RIDs
        const pgPromises = rentalHistory.map(rid => 
          axios.get(`http://localhost:5000/pgs/${rid}`, { withCredentials: true })
        );
        
        const pgResponses = await Promise.all(pgPromises);
        
        // Extract PG data and landlord IDs
        const pgsData = pgResponses.map(res => res.data);
        const landlordIds = pgsData.map(pg => pg.LID);
        
        // Fetch landlord data for all PGs
        const landlordsResponse = await axios.post(
          "http://localhost:5000/auth/tenants-batch",
          { tenantIds: landlordIds },
          { withCredentials: true }
        );
        
        const { tenants: landlords } = landlordsResponse.data;
        // console.log(landlords)
        
        // Combine PG data with landlord data
        const completeRentalHistory = pgsData.map((pg,i) => {
          // Find the matching landlord by comparing LID with landlord's _id
          const landlord = landlords.find(l => l._id === pg.LID || l._id === pg.LID.toString());
          
          return {
            RID: pg.RID,
            pgName: pg.pgName,
            address: pg.address,
            coverPhoto: pg.coverPhoto,
            landlordFirstName: landlord?.firstName || "",
            landlordLastName: landlord?.lastName || "",
            landlordPhone: landlord?.phone || "",
            joinDate: joinAndLeaveDates[i].joinedFrom || "not available"
          };
        });
        
        setRentalHistory(completeRentalHistory);
        
      } catch (error) {
        console.error("Error fetching rental history:", error);
      }
    };

    fetchRentalHistory();
}, [rentalHistory]);

  return (
    <>
      <div className="absolute top-[-20px] left-[-20px] z-1 md:w-[512px] w-[256px]  md:h-[560px] h-[280px] pointer-events-none">
        <img src="/images/bgimg.png" alt="background" />
      </div>
      <div className="absolute bottom-[-50px] right-0 z-1 md:w-[512px] w-[256px]  md:h-[560px] h-[280px] pointer-events-none">
        <img src="/images/bgimg2.png" alt="background" />
      </div>

      <section id="tenantDash" className="relative z-2 pt-[30px]">
        <div className={`w-full flex justify-center `}>
          <div className="w-[98%] min-h-[1200px] h-full pb-[40px] bg-[#e1e1e1] rounded-[20px] drop-shadow-2xl drop-shadow-[#a5a5a5] flex flex-col items-center px-5">
            <div className="w-full flex items-center justify-start py-5">
              <BackBtn />
            </div>
            <div className="w-full flex ">
              <div className="w-[85%] flex flex-col justify-center items-center ">
                <TenantDashComponents
                  rentalHistory={rentalHistory}
                  user={user}
                  setUser={setUser}
                  bar={bar}
                  formData={formData}
                  setFormData={setFormData}
                  coords={coords}
                  setBar={setBar}
                  PGData={currentPGData}
                  loadingPGs={loadingPGs}
                  pgError={pgError}
                  residingPG={residingPG}
                />
              </div>
              <div className="w-[15%] min-w-[250px] flex flex-col items-center sticky top-[30px]">
                <DashboardNav
                  bar={bar}
                  setBar={setBar}
                  setUser={setUser}
                  setShowLogout={setShowLogout}
                  navList={tenantNavList}
                  role={formData.role}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {showLogout && (
        <Logout
          onConfirm={handleLogOut}
          onCancel={() => setShowLogout(false)}
        />
      )}
    </>
  );
};

export default TenantDashboard;