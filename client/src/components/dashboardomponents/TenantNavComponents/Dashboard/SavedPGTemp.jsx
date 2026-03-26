import React, { useEffect, useState } from "react";
import axios from "axios";

const SavedPGTemp = () => {
  const [pgData, setPgData] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading

  useEffect(() => {
    const fetchSavedPGs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/auth/saved-pgs", {
          withCredentials: true, // Include cookies for authentication
        });
        if (response.data.success) {
          setPgData(response.data.data);
        } else {
          console.error("Failed to fetch saved PGs:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching saved PGs:", error);
      } finally {
        setLoading(false); // Stop loading after data is fetched
      }
    };

    fetchSavedPGs();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-4  w-full px-4">
          <div className='flex gap-2 w-full'>
            <div className='h-[200px] w-[250px] bg-[#d2d2d2] rounded-[30px] animate-pulse'></div>
            <div className='flex flex-col gap-1 w-full'>
              <div className='h-[30px] w-[500px] bg-[#d2d2d2] rounded-[30px] animate-pulse'></div>
              <div className='h-[30px] w-[500px] bg-[#d2d2d2] rounded-[30px] animate-pulse'></div>
            </div>
          </div>
          <div className='flex gap-2 w-full'>
            <div className='h-[200px] w-[250px] bg-[#d2d2d2] rounded-[30px] animate-pulse'></div>
            <div className='flex flex-col gap-1 w-full'>
              <div className='h-[30px] w-[500px] bg-[#d2d2d2] rounded-[30px] animate-pulse'></div>
              <div className='h-[30px] w-[500px] bg-[#d2d2d2] rounded-[30px] animate-pulse'></div>
            </div>
          </div>
          <div className='flex gap-2 w-full'>
            <div className='h-[200px] w-[250px] bg-[#d2d2d2] rounded-[30px] animate-pulse'></div>
            <div className='flex flex-col gap-1 w-full'>
              <div className='h-[30px] w-[500px] bg-[#d2d2d2] rounded-[30px] animate-pulse'></div>
              <div className='h-[30px] w-[500px] bg-[#d2d2d2] rounded-[30px] animate-pulse'></div>
            </div>
          </div>
        </div>
    );
  }

  return (
    <div className="saved-pgs-container">
      {pgData.map((data) => (
        <div
          key={data.pgName}
          className="flex flex-col gap-2 bg-[#e2e2e2] p-2 rounded-[20px]"
        >
          <div className="flex gap-6">
            <div>
              <div className="h-[200px] w-[200px] rounded-[20px] bg-[#1a1a1a]">
                <img
                  src={`http://localhost:5000${data.coverPhoto}`}
                  alt="PG Cover"
                  className="w-full h-full object-cover rounded-[20px]"
                />
              </div>
            </div>
            <div className="flex flex-col gap-3 pt-2">
              <div>
                <p className="text-[#464646] font-medium text-[24px]">
                  {data.pgName}
                </p>
              </div>
              <div className="w-[450px]">
                <p className="text-[#5c5c5c] text-[18px]">{data.address}</p>
              </div>
              <div className="">
                <p className="text-[#5c5c5c] text-[18px] font-medium">
                  Owned by {data.landlordFirstName + " " + data.landlordLastName}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="px-6 py-2 bg-gradient-to-r from-[#d72638] to-[#ff0084] text-[15px] text-white font-normal rounded-full">
                  Book
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SavedPGTemp;
