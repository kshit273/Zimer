import React, { useEffect, useState } from "react";
import BackBtn from "../components/dashboardomponents/BackBtn";
import DashboardNav from "../components/dashboardomponents/DashboardNav";
import TenantDashComponents from "../components/dashboardomponents/TenantDashComponents";
import Logout from "../components/Logout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TenantDashboard = ({ user, setUser, setToast }) => {
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
    currentLandlord: user?.currentLandlord || "",
    savedPGs: user?.savedPGs || [],
  });

  useEffect(()=>{
    if(user && user.currentPG){
      setresidingPG(true);
    }
  })

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

      // clear user state
      setUser(null);
      setToast('Logged out successfully')

      // redirect to home/login
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    const fetchCurrentPGData = async () => {
      setLoadingPGs(true);
      setPgError(null);
      
      try {
        const response = await axios.get(
          `http://localhost:5000/pgs/tenant-pg/${formData.currentPG}`,
          { withCredentials: true }
        );
        const pgData = response.data;

        // Set the current PG data directly from the response
        setCurrentPGData({
          LID: pgData.LID || "",
          RID: pgData.RID || "",
          address: pgData.address || "",
          plan: pgData.plan || "",
          rent: pgData.rent || 0,
          room: pgData.room || "",
          joinFrom: pgData.joinFrom || "",
          coverPhoto: pgData.coverPhoto || "",
          pgName: pgData.pgName || "",
          payments: pgData.payments || [],
        });
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
          payments: [],
        });
      } finally {
        setLoadingPGs(false);
      }
    };

    if (formData.currentPG) {
      fetchCurrentPGData();
    }
  }, [formData.currentPG]);

  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/auth/landlord-data",
          { lid: formData.currentLandlord }, 
          { withCredentials: true }
        );

        setCurrentPGData((prev) => ({
          ...prev,
          Ownername: response.data.data.name,
        }));
      } catch (error) {
        console.error("❌ Error fetching owner data:", error);
      }
    };

    if (user.currentLandlord) {
      fetchOwnerData(); // Call the function only if currentLandlord exists
    }
  }, [formData.currentLandlord]);

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
                  setUser={setUser}
                  bar={bar}
                  formData={formData}
                  setFormData={setFormData}
                  PGData={currentPGData}
                  loadingPGs={loadingPGs}
                  pgError={pgError}
                  residingPG={residingPG}
                  setToast={setToast}
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