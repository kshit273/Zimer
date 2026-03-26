import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./routes/Home";
import ScrollToTop from "./components/ScrollToTop";
import Search from "./routes/search/Search";
import Userlogin from "./routes/Userlogin";
import FAQ from "./routes/FAQ";
import PgInfo from "./sections/PgInfo";
import { useEffect, useState } from "react";
import axios from "axios";
import { supportedCities } from "./constants/Data";
import FrontPageLoader from "./components/FrontPageLoader";
import Navbar from "./components/Navbar";
import TenantDashboard from "./routes/TenantDashboard";
import LandlordDashboard from "./routes/LandlordDashboard";
import JoinRoom from "./routes/JoinRoom";
import AdminDashboard from "./components/dashboardomponents/AdminNavComponents/AdminDashboard";
import AdminLoginComp from "./components/UserloginComponents/AdminLoginComp";
import Toast from "./components/Toast";

axios.defaults.withCredentials = true;

// Routes where the Navbar should be hidden
const NO_NAVBAR_ROUTES = [
  "/userlogin",
  "/tenant/dashboard",
  "/landlord/dashboard",
  "/admin/dashboard",
  "/admin/login",
];

function App() {
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [user, setUser] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cityName, setCityName] = useState(null);
  const [toast, setToast] = useState(null);

  const location = useLocation();

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  function getDistance(lat1, lon1, lat2, lon2) {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function findNearestCity(userLat, userLng) {
    let closestCity = null;
    let minDistance = Infinity;
    for (const city of supportedCities) {
      const distance = getDistance(userLat, userLng, city.lat, city.lng);
      if (distance < minDistance) {
        minDistance = distance;
        closestCity = city;
      }
    }
    return closestCity;
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoords({ lat, lng });
        try {
          await axios.get("http://localhost:5000/geocode", {
            params: { lat, lng },
          });
          const nearestCity = findNearestCity(lat, lng);
          if (nearestCity) {
            setCityName(nearestCity.name);
          } else {
            showToast("No matching city found", "error");
          }
        } catch (err) {
          showToast("Geocoding failed", "error");
        }
      },
      () => {
        showToast("Location access denied", "error");
      }
    );
  }, []);

  useEffect(() => {
    // Restore admin session from localStorage on mount
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      // Optionally decode or verify; for now just mark as logged in
      // You could also hit a /admin/me endpoint here to rehydrate adminUser
      // setAdminUser(decoded);
    }

    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5000/auth/me", {
          withCredentials: true,
        });
        setUser(res.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading)
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <FrontPageLoader />
      </div>
    );

  const hideNavbar = NO_NAVBAR_ROUTES.includes(location.pathname);

  return (
    <>
      <ScrollToTop />
      {!hideNavbar && <Navbar user={user} />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search/*" element={<Search setToast={showToast} />} />
        <Route path="/pg/:RID" element={<PgInfo setToast={showToast} />} />
        <Route
          path="/landlord/dashboard"
          element={
            <LandlordDashboard setUser={setUser} user={user} setToast={showToast} />
          }
        />
        <Route
          path="/tenant/dashboard"
          element={
            <TenantDashboard setUser={setUser} user={user} setToast={showToast} />
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/login"
          element={<AdminLoginComp setAdminUser={setAdminUser} />}
        />
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard adminUser={adminUser} setAdminUser={setAdminUser} />}
        />

        <Route
          path="/userlogin"
          element={<Userlogin setUser={setUser} setToast={showToast} />}
        />
        <Route
          path="/join/:RID/:roomId"
          element={<JoinRoom user={user} setToast={showToast} />}
        />
        <Route path="/faq" element={<FAQ />} />
      </Routes>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

export default App;