import React, { useEffect, useState } from "react";
import BackBtn from "../components/dashboardomponents/BackBtn";
import DashboardNav from "../components/dashboardomponents/DashboardNav";
import LandlordDashComponents from "../components/dashboardomponents/LandlordDashComponents";
import Logout from "../components/Logout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LandlordDashboard = ({ user, setUser, setToast }) => {
  const [bar, setBar] = useState(0);
  const [showLogout, setShowLogout] = useState(false);
  const [ownedPGsData, setOwnedPGsData] = useState([]);
  const [loadingPGs, setLoadingPGs] = useState(false);
  const [pgError, setPgError] = useState(null);
  const [formData, setFormData] = useState({
    _id : user?._id || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    dob: user?.dob || "",
    gender: user?.gender || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "",
    profilePicture: user?.profilePicture || "",
    password: "",
    ownedPGs: user?.ownedPGs || [], 
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    if (user.role !== "landlord") {
      navigate("/");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      _id: user._id || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      dob: user.dob || "",
      gender: user.gender || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "",
      profilePicture: user.profilePicture || "",
      ownedPGs: user.ownedPGs || [],
    }));
  }, [user, navigate]);

  const landlordNavList = [
    "Dashboard",
    "Register PG",
    "Update Profile",
    "View Legal docs",
    "Upgrade plan",
    "Update PG info",
    "Log out",
  ];
  
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

  // Fetch PG data for all owned PGs
  useEffect(() => {
    const fetchOwnedPGsData = async () => {
      if (!formData.ownedPGs || formData.ownedPGs.length === 0) {
        setOwnedPGsData([]);
        return;
      }

      setLoadingPGs(true);
      setPgError(null);
      
      try {
        // Fetch data for all owned PGs in parallel
        const pgPromises = formData.ownedPGs.map(async (pgId) => {
          try {
            const response = await axios.get(
              `http://localhost:5000/pgs/${pgId}`,
              { withCredentials: true }
            );
            return response.data;
          } catch (err) {
            console.error(`Error fetching PG ${pgId}:`, err);
            return null; // Return null for failed fetches
          }
        });

        const pgsData = await Promise.all(pgPromises);
        
        // Filter out any null results from failed fetches
        const validPGsData = pgsData.filter(pg => pg !== null);
        setOwnedPGsData(validPGsData);
        
        if (validPGsData.length < formData.ownedPGs.length) {
          setPgError("Some PGs could not be loaded");
        }
      } catch (error) {
        console.error("Error fetching owned PGs data:", error);
        setPgError("Failed to load PG data");
        setOwnedPGsData([]);
      } finally {
        setLoadingPGs(false);
      }
    };

    fetchOwnedPGsData();
  }, [formData.ownedPGs]);

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
                <LandlordDashComponents
                  user={user}
                  setUser={setUser}
                  bar={bar}
                  formData={formData}
                  setFormData={setFormData}
                  ownedPGsData={ownedPGsData}
                  loadingPGs={loadingPGs}
                  pgError={pgError}
                  setToast={setToast}
                />
              </div>
              <div className="w-[15%] min-w-[250px] flex flex-col items-center sticky top-[30px]">
                <DashboardNav
                  bar={bar}
                  setBar={setBar}
                  setUser={setUser}
                  setShowLogout={setShowLogout}
                  navList={landlordNavList}
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

export default LandlordDashboard;