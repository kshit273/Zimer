import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import PremiumRoomSlider from "../components/PremiumRoomSlider";
import SearchButton from "../components/SearchButton";
import SearchResultsList from "../components/SearchResultsList";
import NoSearchOutput from "../components/NoSearchOutput";
import { useMediaQuery } from "react-responsive";

const SearchResults = ({ setActiveRID }) => {
  const isMedScreen = useMediaQuery({ minWidth: 801, maxWidth: 1024 });
  const isSmallScreen = useMediaQuery({ maxWidth: 800 });
  const { search_keyword } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use ref to track if component is mounted
  const isMountedRef = useRef(true);

  // YouTube-like search algorithm
  function intelligentSearch(allPGs, searchKeyword) {
    if (!searchKeyword || searchKeyword.trim().length === 0) {
      return allPGs;
    }

    const keyword = searchKeyword.toLowerCase().trim();
    const searchWords = keyword.split(/\s+/);

    const cityKeywords = {
      dehradun: ["dehradun", "ddn", "deh", "dehradoon"],
      delhi: ["delhi", "del", "dilli"],
      noida: ["noida", "noid"],
      gurgaon: ["gurgaon", "gurugram", "ggn"],
      ghaziabad: ["ghaziabad", "ghz"],
      meerut: ["meerut", "mer", "mrt"],
      roorkee: ["roorkee", "rke", "roorkee", "roo"],
    };

    const genderKeywords = {
      boys: ["boys", "boy", "male", "gents", "men", "guys"],
      girls: ["girls", "girl", "female", "ladies", "women"],
      both: ["both", "unisex", "coed", "co-ed"],
    };

    const roomTypeKeywords = {
      single: ["single", "1", "one", "solo", "private"],
      double: ["double", "2", "two", "sharing", "shared"],
      triple: ["triple", "3", "three"],
      quad: ["quad", "4", "four"],
    };

    const amenityKeywords = {
      wifi: ["wifi", "wi-fi", "internet", "broadband"],
      ac: ["ac", "air conditioning", "cooler", "cooling"],
      parking: ["parking", "bike", "vehicle", "car"],
      laundry: ["laundry", "washing", "wash"],
      gym: ["gym", "fitness", "workout"],
      tv: ["tv", "television"],
      geyser: ["geyser", "hot water", "heater"],
      fridge: ["fridge", "refrigerator", "freezer"],
    };

    // Helper function for fuzzy matching
    function fuzzyMatch(text, word) {
      if (!text) return false;
      text = text.toLowerCase();
      
      if (text.includes(word)) return true;
      
      if (word.length >= 3) {
        const threshold = Math.ceil(word.length * 0.6);
        let matchCount = 0;
        for (let char of word) {
          if (text.includes(char)) matchCount++;
        }
        if (matchCount >= threshold) return true;
      }
      
      return false;
    }

    const scoredPGs = allPGs.map((pg) => {
      let score = 0;
      let matchReasons = [];

      const pgName = pg.pgName?.toLowerCase() || "";
      const address = pg.address?.toLowerCase() || "";
      const description = pg.description?.toLowerCase() || "";
      const gender = pg.gender?.toLowerCase() || "";
      const amenities = pg.amenities?.map(a => a.toLowerCase()) || [];
      const roomTypes = pg.rooms?.map(r => r.roomType?.toLowerCase()) || [];
      const allRoomAmenities = pg.rooms?.flatMap(r => r.amenities?.map(a => a.toLowerCase()) || []) || [];

      const fullText = `${pgName} ${address} ${description}`.toLowerCase();
      if (fullText.includes(keyword)) {
        score += 200;
        matchReasons.push("Exact phrase match");
      }

      searchWords.forEach(word => {
        if (pgName.includes(word)) {
          score += 100;
          matchReasons.push(`Name contains "${word}"`);
        } else if (fuzzyMatch(pgName, word)) {
          score += 50;
          matchReasons.push(`Name fuzzy match "${word}"`);
        }
      });

      for (const [city, aliases] of Object.entries(cityKeywords)) {
        if (aliases.some(alias => keyword.includes(alias))) {
          if (address.includes(city) || pg.RID?.toLowerCase().startsWith(city.substring(0, 3))) {
            score += 80;
            matchReasons.push(`Located in ${city}`);
            break;
          }
        }
      }

      searchWords.forEach(word => {
        if (address.includes(word)) {
          score += 60;
          matchReasons.push(`Address contains "${word}"`);
        } else if (fuzzyMatch(address, word)) {
          score += 30;
          matchReasons.push(`Address fuzzy match "${word}"`);
        }
      });

      for (const [genderType, aliases] of Object.entries(genderKeywords)) {
        if (aliases.some(alias => keyword.includes(alias))) {
          if (gender === genderType || (genderType !== "both" && gender === "both")) {
            score += 70;
            matchReasons.push(`Suitable for ${genderType}`);
            break;
          }
        }
      }

      for (const [roomType, aliases] of Object.entries(roomTypeKeywords)) {
        if (aliases.some(alias => keyword.includes(alias))) {
          if (roomTypes.includes(roomType)) {
            score += 50;
            matchReasons.push(`Has ${roomType} rooms`);
            break;
          }
        }
      }

      for (const [amenity, aliases] of Object.entries(amenityKeywords)) {
        if (aliases.some(alias => keyword.includes(alias))) {
          const hasAmenity = amenities.some(a => a.includes(amenity)) || 
                            allRoomAmenities.some(a => a.includes(amenity));
          if (hasAmenity) {
            score += 40;
            matchReasons.push(`Has ${amenity}`);
          }
        }
      }

      searchWords.forEach(word => {
        if (description.includes(word)) {
          score += 30;
          matchReasons.push(`Description mentions "${word}"`);
        }
      });

      const foodKeywords = ["food", "meal", "tiffin", "cooking", "kitchen", "mess"];
      if (foodKeywords.some(fw => keyword.includes(fw))) {
        if (pg.foodAvailable) {
          score += 35;
          matchReasons.push("Food available");
        }
        if (pg.selfCookingAllowed) {
          score += 25;
          matchReasons.push("Self cooking allowed");
        }
        if (pg.tiffinServiceAvailable) {
          score += 25;
          matchReasons.push("Tiffin service available");
        }
      }

      const priceKeywords = ["cheap", "affordable", "budget", "low", "expensive", "premium", "luxury"];
      if (priceKeywords.some(pk => keyword.includes(pk))) {
        const minRent = Math.min(...(pg.rooms?.map(r => r.rent) || [Infinity]));
        if (minRent !== Infinity) {
          if (keyword.includes("cheap") || keyword.includes("affordable") || keyword.includes("budget")) {
            if (minRent < 8000) {
              score += 40;
              matchReasons.push("Budget-friendly");
            }
          } else if (keyword.includes("premium") || keyword.includes("luxury") || keyword.includes("expensive")) {
            if (minRent > 15000) {
              score += 40;
              matchReasons.push("Premium accommodation");
            }
          }
        }
      }

      if (pg.averageRatings?.overall) {
        score += pg.averageRatings.overall * 6;
        if (pg.averageRatings.overall >= 4.5) {
          matchReasons.push("Highly rated");
        }
      }

      if (pg.plan === "premium") {
        score += 25;
        matchReasons.push("Premium listing");
      } else if (pg.plan === "popular") {
        score += 15;
        matchReasons.push("Popular listing");
      }

      if (pg.totalReviews > 10) {
        score += 20;
        matchReasons.push("Well reviewed");
      } else if (pg.totalReviews > 5) {
        score += 10;
      }

      const hasAvailableRooms = pg.rooms?.some(room => {
        const maxCapacity = room.roomType === "single" ? 1 : 
                           room.roomType === "double" ? 2 : 
                           room.roomType === "triple" ? 3 : 
                           room.roomType === "quad" ? 4 : 2;
        return (room.tenants?.length || 0) < maxCapacity;
      });
      
      if (hasAvailableRooms) {
        score += 15;
        matchReasons.push("Has availability");
      }

      return {
        ...pg,
        searchScore: score,
        matchReasons: matchReasons,
      };
    });

    return scoredPGs
      .filter(pg => pg.searchScore >= 10)
      .sort((a, b) => b.searchScore - a.searchScore);
  }

  useEffect(() => {
    // Reset mounted flag
    isMountedRef.current = true;
    
    const controller = new AbortController();

    const fetchAndSearchPGs = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get("http://localhost:5000/pgs/", {
          withCredentials: true,
          signal: controller.signal,
        });

        // Only update state if component is still mounted
        if (!isMountedRef.current) return;

        const allPGs = response.data;

        if (!Array.isArray(allPGs) || allPGs.length === 0) {
          setResults([]);
          setLoading(false);
          return;
        }

        // console.log(allPGs, search_keyword);
        const searchResults = intelligentSearch(allPGs, search_keyword);
        setResults(searchResults);

      } catch (err) {
        // Ignore abort errors
        if (axios.isCancel(err) || err.name === 'CanceledError') {
          console.log('Request cancelled');
          return;
        }
        
        if (!isMountedRef.current) return;
        
        console.error("Error fetching PGs:", err);
        setError("Failed to load search results. Please try again.");
        setResults([]);
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchAndSearchPGs();

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      controller.abort();
    };
  }, [search_keyword]);

  // console.log(results)

  const premiumHouses = results.filter((pg) => pg.plan === "premium");

  if (loading) {
    return (
      <>
        <div className="absolute top-[-20px] left-[-20px] z-1 md:w-[512px] w-[256px] md:h-[560px] h-[280px] pointer-events-none">
          <img src="/images/bgimg.png" alt="background" />
        </div>
        <div className="absolute bottom-[-250px] right-0 z-1 md:w-[512px] w-[256px] md:h-[560px] h-[280px] pointer-events-none">
          <img src="/images/bgimg2.png" alt="background" />
        </div>
        <section className={`relative z-2 ${isSmallScreen ? `pt-[60px]` : `pt-[100px]`}`}>
          <div className="w-full flex justify-center items-center min-h-[400px]">
            <p className="text-2xl text-gray-600">Searching...</p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <div className="absolute top-[-20px] left-[-20px] z-1 md:w-[512px] w-[256px] md:h-[560px] h-[280px] pointer-events-none">
        <img src="/images/bgimg.png" alt="background" />
      </div>
      <div className="absolute bottom-[-250px] right-0 z-1 md:w-[512px] w-[256px] md:h-[560px] h-[280px] pointer-events-none">
        <img src="/images/bgimg2.png" alt="background" />
      </div>

      <section className={`relative z-2 ${isSmallScreen ? `pt-[60px]` : `pt-[100px]`}`}>
        <div className={`w-full flex justify-center ${isSmallScreen || isMedScreen ? ` mt-[20px]` : ` mt-[100px]`}`}>
          <div className="w-[90%] h-full pb-[40px] bg-[#dadada] rounded-[20px] drop-shadow-2xl drop-shadow-[#a5a5a5] flex flex-col items-center">
            <div className={`flex items-center w-full ${isSmallScreen || isMedScreen ? `my-[20px] px-[10px]` : `my-[40px] px-[40px]`} justify-between`}>
              <div className={`flex-1 flex justify-center ${isMedScreen ? `scale-70` : `scale-100`}`}>
                <SearchButton width={isSmallScreen ? 200 : isMedScreen ? 600 : 1000} />
              </div>
              <div className={`flex ${isSmallScreen ? `gap-[5px]` : `gap-[20px]`} justify-end`} style={{ minWidth: isSmallScreen ? 90 : 170 }}>
                <button>
                  <div className={`${isSmallScreen ? `h-[30px] w-[30px]` : `h-[50px] w-[50px]`} bg-[#e8e8e8] rounded-full`}></div>
                </button>
                {!isSmallScreen && !isMedScreen && (
                  <>
                    <button>
                      <div className={`h-[50px] w-[50px] bg-[#e8e8e8] rounded-full`}></div>
                    </button>
                    <button>
                      <div className={`h-[50px] w-[50px] bg-[#e8e8e8] rounded-full`}></div>
                    </button>
                  </>
                )}
              </div>
            </div>

            {error && (
              <div className="w-[90%] bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {!loading && !error && results.length > 0 && (
              <div className="w-[90%] mb-4 text-gray-700">
                <p className="text-lg">
                  Found <strong>{results.length}</strong> results for "<strong>{search_keyword}</strong>"
                </p>
              </div>
            )}

            {premiumHouses.length > 0 && (
              <div className="bg-[#2b2b2b] rounded-[20px] w-[95%] mx-[10px]">
                <div className={`w-[90%] ${isSmallScreen ? `ml-[20px]` : isMedScreen ? `ml-[30px]` : `ml-[90px]`}`}>
                  {/* <PremiumRoomSlider
                    list={premiumHouses}
                    onRoomClick={setActiveRID}
                    desc="Premium listings matching your search"
                  /> */}
                </div>
              </div>
            )}

            {results.length > 0 && (
              <div className={`w-[90%] h-[1px] bg-[#b3b3b3] ${isSmallScreen ? `mt-[20px]` : `mt-[80px]`}`}></div>
            )}

            {results.filter((pg) => pg.plan !== "premium").length > 0 && (
              <SearchResultsList
                search_keyword={search_keyword}
                list={results.filter((pg) => pg.plan !== "premium")}
                onRoomClick={setActiveRID}
              />
            )}

            {!loading && !error && results.length === 0 && <NoSearchOutput />}
          </div>
        </div>
      </section>
    </>
  );
};

export default SearchResults;