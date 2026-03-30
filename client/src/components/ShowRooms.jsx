import { useState, useEffect } from "react";
import axios from "axios";
import RoomFeatures from "./RoomFeatures.jsx";

const ShowRooms = ({ RID, pgData: propPgData = null, onBookingRequest }) => {
  const filters = ["Price", "Single room", "Shared room", "Available"];

  const priceRange = [
    "less than ₹5,000",
    "₹5,000 - ₹7,500",
    "₹7,500 - ₹10,000",
    "more than ₹10,000",
  ];

  const [activeIdxs, setActiveIdxs] = useState([]);
  const [showPriceOverlay, setShowPriceOverlay] = useState(false);
  const [selectedPriceIdx, setSelectedPriceIdx] = useState(null);
  
  // API data states
  const [pgData, setPgData] = useState(propPgData);
  const [loading, setLoading] = useState(!propPgData);

  // Fetch PG data from API only when prop not provided
  useEffect(() => {
    if (propPgData) {
      setPgData(propPgData);
      setLoading(false);
      return;
    }

    const fetchPgData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/pgs/${RID}`, {
          withCredentials: true,
        });
        setPgData(response.data);
      } catch (err) {
        console.error("Error fetching PG data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (RID) {
      fetchPgData();
    }
  }, [RID, propPgData]);

  const toggleIdx = (idx) => {
    if (idx === filters.indexOf("Single room")) {
      setActiveIdxs((prev) =>
        prev.includes(idx)
          ? prev.filter((i) => i !== idx)
          : [...prev.filter((i) => i !== filters.indexOf("Shared room")), idx]
      );
    } else if (idx === filters.indexOf("Shared room")) {
      setActiveIdxs((prev) =>
        prev.includes(idx)
          ? prev.filter((i) => i !== idx)
          : [...prev.filter((i) => i !== filters.indexOf("Single room")), idx]
      );
    } else {
      setActiveIdxs((prev) =>
        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
      );
    }
  };

  const filtersWithIdx = filters.map((filter, idx) => {
    let label = filter;
    if (filter === "Price" && selectedPriceIdx !== null) {
      label = priceRange[selectedPriceIdx];
    }

    return {
      filter: label,
      idx,
      selected: activeIdxs.includes(idx),
    };
  });

  const sortedFilters = [
    ...filtersWithIdx.filter((f) => f.selected),
    ...filtersWithIdx.filter((f) => !f.selected),
  ];

  const isSingleRoomFilterActive = activeIdxs.includes(
    filters.indexOf("Single room")
  );
  const isSharedRoomFilterActive = activeIdxs.includes(
    filters.indexOf("Shared room")
  );
  const isAvailableFilterActive = activeIdxs.includes(
    filters.indexOf("Available")
  );
  const isPriceFilterActive = activeIdxs.includes(filters.indexOf("Price"));

  const priceRangeFilters = [
    { min: 0, max: 4999 },
    { min: 5000, max: 7500 },
    { min: 7501, max: 10000 },
    { min: 10001, max: Infinity },
  ];

  // Filter rooms based on active filters
  let filteredRooms = pgData?.rooms || [];
  
  if (isSingleRoomFilterActive) {
    filteredRooms = filteredRooms.filter(
      (room) => room.roomType?.toLowerCase() === "single"
    );
  } else if (isSharedRoomFilterActive) {
    filteredRooms = filteredRooms.filter(
      (room) => room.roomType?.toLowerCase() !== "single"
    );
  }

  if (isAvailableFilterActive) {
    filteredRooms = filteredRooms.filter(
      (room) => room.availableFrom && new Date(room.availableFrom) <= new Date()
    );
  }

  if (isPriceFilterActive && selectedPriceIdx !== null) {
    const { min, max } = priceRangeFilters[selectedPriceIdx];
    filteredRooms = filteredRooms.filter(
      (room) => Number(room.rent) >= min && Number(room.rent) <= max
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <p className="text-xl text-gray-600">Loading rooms...</p>
      </div>
    );
  }

  if (!pgData || !pgData.rooms || pgData.rooms.length === 0) {
    return (
      <div>
        <div className="head text-[35px] font-medium">Rooms</div>
        <p className="text-gray-600 mt-4">No rooms available.</p>
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="head text-[28px] font-medium">Rooms</div>
        <div className="filters flex gap-[10px] my-[10px]">
          {sortedFilters.map(({ filter, idx, selected }) => (
            <div
              key={idx}
              className={` ${
                selected
                  ? "border-[1px] border-[#d72638] text-[#d72638]  py-[6px] px-[18px]"
                  : "bg-[#cbcbcb] py-[8px] px-[20px]"
              } rounded-[20px] cursor-pointer text-[14px]`}
              onClick={() => {
                toggleIdx(idx);

                if (idx === filters.indexOf("Price")) {
                  if (activeIdxs.includes(idx)) {
                    setSelectedPriceIdx(null);
                    setShowPriceOverlay(false);
                  } else {
                    setShowPriceOverlay(true);
                  }
                }
              }}
            >
              {filter}
            </div>
          ))}
        </div>
        <div className="relative">
          {isPriceFilterActive && (
            <div
              className={`absolute z-10 bg-[#d7d7d7] rounded-[20px] w-[220px] p-[10px] px-[15px] flex flex-col gap-[10px] mb-[20px] shadow-lg
        transition-opacity duration-300 ease-in-out
        ${showPriceOverlay ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
              {priceRange.map((price, idx) => (
                <p
                  key={idx}
                  className={`text-[#464646] text-[18px] font-medium cursor-pointer ${
                    selectedPriceIdx === idx ? "text-[#d72638]" : ""
                  }`}
                  onClick={() => {
                    setSelectedPriceIdx(idx);
                    setShowPriceOverlay(false);
                  }}
                >
                  {price}
                </p>
              ))}
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 auto-rows-auto max-w-[1120px] gap-[10px] mt-[10px]">
          {filteredRooms.map((room, idx) => {
            return (
              <div key={room.roomId || idx} className="flex gap-4">
                <div className="">
                  <img
                    src={
                      room.photos && room.photos[0]
                        ? `http://localhost:5000${room.photos[0]}`
                        : `/images/PgInfoImgs/${RID}/${room.roomId}/mainImg.jpg`
                    }
                    alt={room.roomId}
                    className={`w-[200px] h-[200px] object-cover rounded-[20px] cursor-pointer`}
                  />
                </div>
                <div className="flex justify-between  max-w-[650px]">
                  <div className="left py-1">
                    <div className="roomnum flex justify-between text-[#1a1a1a] text-[17px] font-medium">
                      <div>Room {room.roomId}</div>
                    </div>
                    <div className="roomnum text-[#1a1a1a] text-[16px] font-normal h-[75px]">
                      {room.description}
                    </div>
                    <div className="roomnum text-[#1a1a1a] text-[16px] font-medium">
                      <RoomFeatures features={room.amenities} />
                    </div>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="">
                            <span className="text-transparent bg-clip-text bg-[#1a1a1a] border-1 border-[#d6d6d6] rounded-full py-2 px-4 font-medium text-[14px]">
                              ₹{room.rent} per month
                            </span>
                        </div>
                        <button
                          className={` h-[40px] bg-gradient-to-r from-[#d72638] to-[#ff007f] text-white font-medium text-[14px] px-8 rounded-full shadow-md  transition-transform duration-300`}
                          onClick = {() => onBookingRequest()}
                        >
                          Book now
                        </button>
                      </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ShowRooms;