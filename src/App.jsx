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
import PgInfo from "./sections/PgInfo";
import { useEffect, useState } from "react";
import axios from "axios";
import { supportedCities } from "./constants/Data";
import FrontPageLoader from "./components/FrontPageLoader"
// import { Houses } from "./constants/Houses";
// import SearchResults from "./sections/SearchResults";
import Navbar from "./components/Navbar";
import TenantDashboard from "./routes/TenantDashboard";
import LandlordDashboard from "./routes/LandlordDashboard";
import JoinRoom from "./routes/JoinRoom";
import AdminDashboard from "./components/dashboardomponents/AdminNavComponents/AdminDashboard";
import ErrorMessage from "./components/ErrorMessage"; // Import the new component

axios.defaults.withCredentials = true;

function App() {
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cityName, setCityName] = useState(null);
  const [error, setError] = useState(null); 

  const location = useLocation();

  function getDistance(lat1, lon1, lat2, lon2) {
    const toRad = (deg) => (deg * Math.PI) / 180;

    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in KM
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
          const res = await axios.get("http://localhost:5000/geocode", {
            params: { lat, lng },
          });

          const nearestCity = findNearestCity(lat, lng);

          if (nearestCity) {
            setCityName(nearestCity.name);
          } else {
            setError("No matching city found"); // Set error message
          }
        } catch (err) {
          setError("Geocoding failed"); // Set error message
        }
      },
      (err) => {
        setError("Location access denied"); // Set error message
      }
    );
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5000/auth/me", {
          withCredentials: true,
        });
        setUser(res.data); // Store full user document
      } catch (err) {
        setUser(null);
        setError("Failed to authenticate user"); // Set error message
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

  return (
    <>
      <ScrollToTop />
      {![
        "/userlogin",
        "/tenant/dashboard",
        "/landlord/dashboard",
        "/admin/dashboard",
      ].includes(location.pathname) && <Navbar user={user} />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search/*" element={<Search setError={setError}/>} />
        <Route path="/pg/:RID" element={<PgInfo />} />
        <Route
          path="/landlord/dashboard"
          element={
            <LandlordDashboard setUser={setUser} user={user} coords={coords} />
          }
        />
        <Route
          path="/tenant/dashboard"
          element={<TenantDashboard setUser={setUser} user={user} />}
        />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/userlogin" element={<Userlogin setUser={setUser} />} />
        <Route path="/join/:RID/:roomId" element={<JoinRoom user={user} />} />
      </Routes>

      {/* Render the ErrorMessage component */}
      <ErrorMessage message={error} setError={setError} />
    </>
  );
}

export default App;
