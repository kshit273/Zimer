import React, { useEffect, useState } from "react";
import SavedPGTemp from "./SavedPGTemp";
import axios from "axios";

const SavedPGs = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedPGs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5000/auth/saved-pgs",
          {
            withCredentials: true,
          }
        );
        
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching saved PGs:", err);
        setError(err.response?.data?.message || "Failed to load saved PGs");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedPGs();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 bg-[#d9d9d9] p-4 rounded-[20px] w-full">
        <div className="p-2">
          <p className="text-[#464646] text-[32px] font-medium">Saved PGs</p>
        </div>
        <div className="flex flex-col gap-5 w-full">
          <div className="bg-[#e2e2e2] h-[200px] w-full rounded-[20px] animate-pulse"></div>
          <div className="bg-[#e2e2e2] h-[200px] w-full rounded-[20px] animate-pulse"></div>
          <div className="bg-[#e2e2e2] h-[200px] w-full rounded-[20px] animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 bg-[#d9d9d9] p-4 rounded-[20px]">
        <div className="p-2">
          <p className="text-[#464646] text-[32px] font-medium">Saved PGs</p>
        </div>
        <div className="text-center py-8 text-red-500">{error}</div>
      </div>
    );
  }


  return (
    <div className="flex flex-col gap-4 bg-[#d9d9d9] p-4 rounded-[20px]">
      <div className="p-2">
        <p className="text-[#464646] text-[32px] font-medium">Saved PGs</p>
      </div>
      {data.length === 0 ? (
        <div className="text-center py-8 text-[#464646]">
          No saved PGs yet. Start exploring and save your favorites!
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {data.map((pg, i) => (
            <div className="w-full" key={pg._id || i}>
              <SavedPGTemp data={pg} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPGs;