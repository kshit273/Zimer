// FindRoom.jsx

import { useMediaQuery } from "react-responsive";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import RoomSlider from "../components/RoomSlider";
import SearchButton from "../components/SearchButton";

const FindRoom = ({ setActiveRID }) => {
  const isMedScreen   = useMediaQuery({ minWidth: 801, maxWidth: 1024 });
  const isSmallScreen = useMediaQuery({ maxWidth: 800 });

  const [featured, setFeatured]     = useState(null); // null = not loaded yet
  const [loading, setLoading]       = useState(true);

  // Lightweight preference tracking — only used to bias the search request,
  // NOT to re-score results client-side anymore.
  const [prefs, setPrefs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("userPreferences")) ?? {
        preferredGender: null,
        preferredCities: [],
        clickedPGs: [],
      };
    } catch {
      return { preferredGender: null, preferredCities: [], clickedPGs: [] };
    }
  });

  const isMountedRef = useRef(true);

  // Persist prefs whenever they change
  useEffect(() => {
    localStorage.setItem("userPreferences", JSON.stringify(prefs));
  }, [prefs]);

  // Fetch featured sections from backend
  useEffect(() => {
    isMountedRef.current = true;
    const controller = new AbortController();

    const fetchFeatured = async () => {
      try {
        const res = await axios.get("http://localhost:5000/pgs/featured", {
          withCredentials: true,
          signal: controller.signal,
        });
        if (!isMountedRef.current) return;
        setFeatured(res.data);
      } catch (err) {
        if (axios.isCancel(err) || err.name === "CanceledError") return;
        console.error("Failed to fetch featured PGs:", err);
        if (isMountedRef.current) setFeatured({});
      } finally {
        if (isMountedRef.current) setLoading(false);
      }
    };

    fetchFeatured();
    return () => {
      isMountedRef.current = false;
      controller.abort();
    };
  }, []);

  // Update prefs on click so future searches can be personalised
  const handleRoomClick = async (rid) => {
    setActiveRID(rid);

    setPrefs((prev) => ({
      ...prev,
      clickedPGs: [...new Set([rid, ...prev.clickedPGs])].slice(0, 20),
    }));

    // Fetch just enough detail to learn city + gender preference
    try {
      const res = await axios.get(`http://localhost:5000/pgs/show-data/${rid}`);
      const pg  = res.data;
      if (!pg) return;

      const cityPrefix = rid.slice(0, 3);
      setPrefs((prev) => ({
        ...prev,
        preferredGender: pg.gender,
        preferredCities: [...new Set([cityPrefix, ...prev.preferredCities])].slice(0, 5),
      }));
    } catch (err) {
      console.error("Error fetching PG detail for prefs:", err);
    }
  };

  if (loading) {
    return (
      <section id="about" className="relative z-2 pt-[100px]">
        <div className="w-full flex justify-center items-center min-h-[400px]">
          <p className="text-2xl text-gray-600">Loading rooms...</p>
        </div>
      </section>
    );
  }

  const {
    verified = [],
    dehradun = [],
    roorkee  = [],
    delhi    = [],
    girls    = [],
    boys     = [],
  } = featured ?? {};

  return (
    <section id="about" className="relative z-2 pt-[100px]">
      <div className={`w-full flex justify-center ${isMedScreen ? "mt-[40px]" : isSmallScreen ? "mt-0" : "mt-[100px]"}`}>
        <div className="w-[90%] h-full pb-[40px] bg-[#dadada] rounded-[20px] drop-shadow-2xl drop-shadow-[#a5a5a5] flex flex-col items-center">

          {/* ── Hero ── */}
          <div className={`flex flex-col items-center ${isMedScreen ? "mt-[50px]" : isSmallScreen ? "mt-[40px]" : "mt-[100px]"} gap-[50px]`}>
            <div className={`${isSmallScreen ? "w-[90%]" : "w-[80%]"} flex justify-center text-center`}>
              <p className={`text-[#1a1a1a] ${isMedScreen ? "text-[50px]" : isSmallScreen ? "text-[25px]" : "text-[80px]"} font-medium`}>
                Discover <span className="text-[#d72638]">rooms</span> in
                seconds, without leaving your couch!
              </p>
            </div>
            <div className={`w-[100%] flex justify-center ${isMedScreen ? "scale-80 mb-[40px]" : isSmallScreen ? "mb-[30px]" : "mb-[100px] mt-[30px]"}`}>
              <SearchButton width={isMedScreen ? 600 : isSmallScreen ? 230 : 800} />
            </div>
          </div>

          {/* ── Sliders — all data comes from backend now ── */}
          {verified.length > 0 && (
            <RoomSlider
              list={verified}
              heading="Verified by Zimer"
              onRoomClick={handleRoomClick}
              desc="Stay stress-free with PGs officially verified for quality, comfort, and trust."
            />
          )}

          {dehradun.length > 0 && (
            <RoomSlider
              list={dehradun}
              heading="Rooms in Dehradun"
              cityName="Dehradun"
              onRoomClick={handleRoomClick}
              desc="Explore handpicked rooms in Dehradun, perfect for techies, interns, and students."
            />
          )}

          {roorkee.length > 0 && (
            <RoomSlider
              list={roorkee}
              heading="Rooms in Roorkee"
              cityName="Roorkee"
              onRoomClick={handleRoomClick}
              desc="Explore handpicked rooms in Roorkee, perfect for techies, interns, and students."
            />
          )}

          {delhi.length > 0 && (
            <RoomSlider
              list={delhi}
              heading="Rooms in Delhi"
              cityName="Delhi"
              onRoomClick={handleRoomClick}
              desc="Explore handpicked rooms in Delhi, perfect for techies, interns, and students."
            />
          )}

          {girls.length > 0 && (
            <RoomSlider
              list={girls}
              heading="Rooms for Girls"
              cityName="Girls"
              onRoomClick={handleRoomClick}
              desc="Safe, secure, and convenient PGs tailored for girl students and working women."
            />
          )}

          {boys.length > 0 && (
            <RoomSlider
              list={boys}
              heading="Rooms for Boys"
              cityName="Boys"
              onRoomClick={handleRoomClick}
              desc="Safe, secure, and convenient PGs tailored for boy students and working men."
            />
          )}

        </div>
      </div>
    </section>
  );
};

export default FindRoom;