import { useMediaQuery } from "react-responsive";
import { useState, useEffect } from "react";
import axios from "axios";
import RoomSlider from "../components/RoomSlider";
import SearchButton from "../components/SearchButton";

const FindRoom = ({ setActiveRID }) => {
  const isMedScreen = useMediaQuery({ minWidth: 801, maxWidth: 1024 });
  const isSmallScreen = useMediaQuery({ maxWidth: 800 });

  // User preferences and behavior tracking
  const [userPreferences, setUserPreferences] = useState({
    preferredGender: null,
    preferredCities: [],
    viewedPGs: [],
    clickedPGs: []
  });

  const [allPGs, setAllPGs] = useState([]);
  const [loadingPGs, setLoadingPGs] = useState(true);

  // Load user preferences from localStorage on mount
  useEffect(() => {
    const savedPrefs = localStorage.getItem('userPreferences');
    if (savedPrefs) {
      try {
        setUserPreferences(JSON.parse(savedPrefs));
      } catch (e) {
        console.error('Error loading preferences:', e);
      }
    }
  }, []);

  // Save preferences when they change
  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
  }, [userPreferences]);

  // Fetch all PGs from API
  useEffect(() => {
    let mounted = true;
    const source = axios.CancelToken.source();

    const fetchPGs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/pgs/", {
          cancelToken: source.token,
          withCredentials: true,
        });
        if (mounted && Array.isArray(res.data)) {
          setAllPGs(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch PGs:", err);
        if (mounted) setAllPGs([]);
      } finally {
        if (mounted) setLoadingPGs(false);
      }
    };

    fetchPGs();
    return () => {
      mounted = false;
      source.cancel("Component unmounted");
    };
  }, []);

  // Enhanced room click handler
  const handleRoomClick = async (rid) => {
    setActiveRID(rid);

    // Update clicked PGs
    setUserPreferences(prev => ({
      ...prev,
      clickedPGs: [...new Set([rid, ...prev.clickedPGs])].slice(0, 20),
      viewedPGs: [...new Set([rid, ...prev.viewedPGs])].slice(0, 50)
    }));

    // Fetch PG details from API
    try {
      const response = await axios.get(`http://localhost:5000/pgs/${rid}`);
      const pgDetails = response.data;
      
      if (pgDetails) {
        const city = rid.substring(0, 3);
        setUserPreferences(prev => ({
          ...prev,
          preferredCities: [...new Set([city, ...prev.preferredCities])].slice(0, 5),
          preferredGender: pgDetails.gender.toLowerCase()
        }));
      }
    } catch (error) {
      console.error('Error fetching PG details:', error);
    }
  };

  function filterPGsByGender(gender) {
    return allPGs.filter(
      (pg) => pg.PgType && pg.PgType.toLowerCase() === gender.toLowerCase()
    );
  }

  // Enhanced scoring with personalization
  function smartScore(list, context = {}) {
    const PGs = list.map((pg) => {
      let score = 0;

      // Base scores (40 points max)
      const verifiedPoints = pg.isVerified ? 20 : 0;
      const ratingPoints = Math.min(pg.review * 4, 20);
      score += verifiedPoints + ratingPoints;

      // Personalization scores (60 points max)

      // User has clicked this PG before (15 points)
      if (userPreferences.clickedPGs.includes(pg.RID)) {
        score += 15;
      }

      // User has viewed this PG before (8 points)
      if (userPreferences.viewedPGs.includes(pg.RID)) {
        score += 8;
      }

      // Matches user's preferred gender (12 points)
      if (userPreferences.preferredGender && pg.PgType) {
        if (pg.PgType.toLowerCase() === userPreferences.preferredGender) {
          score += 12;
        }
      }

      // Matches user's preferred cities (10 points)
      if (userPreferences.preferredCities.length > 0) {
        const pgCity = pg.RID.substring(0, 3);
        const cityIndex = userPreferences.preferredCities.indexOf(pgCity);
        if (cityIndex !== -1) {
          score += 10 - (cityIndex * 2); // More points for top preferred cities
        }
      }

      // Location proximity bonus (5 points)
      if (context.isNearby) {
        score += 5;
      }

      return { ...pg, score };
    });

    return PGs.sort((a, b) => b.score - a.score);
  }

  if (loadingPGs) {
    return (
      <section id="about" className="relative z-2 pt-[100px]">
        <div className="w-full flex justify-center items-center min-h-[400px]">
          <p className="text-2xl text-gray-600">Loading rooms...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="relative z-2 pt-[100px]">
      <div
        className={`w-full flex justify-center ${
          isMedScreen ? ` mt-[40px]` : isSmallScreen ? `mt-0` : `mt-[100px]`
        }`}
      >
        <div className="w-[90%] h-full pb-[40px] bg-[#dadada] rounded-[20px] drop-shadow-2xl drop-shadow-[#a5a5a5] flex flex-col items-center">
          <div
            className={`flex flex-col items-center ${
              isMedScreen
                ? `mt-[50px]`
                : isSmallScreen
                ? `mt-[40px]`
                : `mt-[100px]`
            } gap-[50px]`}
          >
            <div
              className={`${
                isSmallScreen ? `w-[90%]` : `w-[80%]`
              } flex justify-center text-center `}
            >
              <p
                className={` text-[#1a1a1a]  ${
                  isMedScreen
                    ? ` text-[50px]`
                    : isSmallScreen
                    ? `text-[25px]`
                    : `text-[80px]`
                } font-medium`}
              >
                Discover <span className="text-[#d72638]">rooms</span> in
                seconds without leaving your couch!
              </p>
            </div>
            <div
              className={`w-[100%] flex justify-center ${
                isMedScreen
                  ? `scale-80 mb-[40px]`
                  : isSmallScreen
                  ? `mb-[30px]`
                  : ` mb-[100px] mt-[30px]`
              }`}
            >
              <SearchButton
                width={isMedScreen ? 600 : isSmallScreen ? 230 : 800}
              />
            </div>
          </div>

          {/* Verified PGs */}
          {allPGs.some(pg => pg.isVerified == 1) && (
            <RoomSlider
              list={smartScore(allPGs.filter(
                (pg) => pg.isVerified == 1
              ))}
              heading="Verified By Zimer"
              onRoomClick={handleRoomClick}
              desc={
                "Stay stress-free with PGs officially verified for quality, comfort, and trust by RoomEase."
              }
            />
          )}

          {/* Rooms by City */}
          <RoomSlider
            list={smartScore(allPGs.filter((pg) => pg.RID.startsWith("DEH")))}
            heading="Rooms in Dehradun"
            cityName="Dehradun"
            onRoomClick={handleRoomClick}
            desc={
              "Explore handpicked rooms in Dehradun, perfect for techies, interns, and students."
            }
          />

          <RoomSlider
            list={smartScore(allPGs.filter((pg) => pg.RID.startsWith("ROO")))}
            heading="Rooms in Roorkee"
            cityName="Roorkee"
            onRoomClick={handleRoomClick}
            desc={
              "Explore handpicked rooms in Roorkee, perfect for techies, interns, and students."
            }
          />

          <RoomSlider
            list={smartScore(allPGs.filter((pg) => pg.RID.startsWith("DEL")))}
            heading="Rooms in Delhi"
            cityName="Delhi"
            onRoomClick={handleRoomClick}
            desc={
              "Explore handpicked rooms in Delhi, perfect for techies, interns, and students."
            }
          />

          {/* Rooms by Gender */}
          {allPGs.some(pg => pg.PgType && pg.PgType.toLowerCase() === 'girls') && (
            <RoomSlider
              list={smartScore(filterPGsByGender("girls"))}
              heading="Rooms for Girls"
              cityName="Girls"
              onRoomClick={handleRoomClick}
              desc={
                "Safe, secure, and convenient PGs tailored specifically for girl students and working women."
              }
            />
          )}

          {allPGs.some(pg => pg.PgType && pg.PgType.toLowerCase() === 'boys') && (
            <RoomSlider
              list={smartScore(filterPGsByGender("boys"))}
              heading="Rooms for Boys"
              cityName="Boys"
              onRoomClick={handleRoomClick}
              desc={
                "Safe, secure, and convenient PGs tailored specifically for boy students and working men."
              }
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default FindRoom;