import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const OwnerCard = ({ LID }) => {
  const [landlord, setLandlord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLandlordData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/auth/landlord-data/${LID}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setLandlord(response.data.data);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching landlord data:", err);
        setError("Failed to load owner information");
      } finally {
        setLoading(false);
      }
    };

    if (LID) {
      fetchLandlordData();
    }
  }, [LID]);

  if (loading) {
    return (
      <div className="card bg-[#d9d9d9] w-[500px] h-[220px] rounded-[20px] px-[30px] py-[10px] flex items-center justify-center">
        <p className="text-gray-600">Loading owner details...</p>
      </div>
    );
  }

  if (error || !landlord) {
    return (
      <div className="card bg-[#d9d9d9] w-[500px] h-[220px] rounded-[20px] px-[30px] py-[10px] flex items-center justify-center">
        <p className="text-red-500">{error || "Owner not found"}</p>
      </div>
    );
  }

  // after landlord is loaded
  const imgSrc = (() => {
    const p = landlord?.profilePicture || "";
    if (!p) return "/images/usericon.png"; // fallback
    const cleaned = p.startsWith("/") ? p : `/${p}`;
    return `http://localhost:5000${cleaned}`;
  })();

  return (
    <div className="card bg-[#d9d9d9] w-[500px] h-[220px] rounded-[20px] px-[30px] py-[10px]">
      <div className="top flex items-center justify-between">
        <div className="head text-[30px] font-medium  mt-[5px]">Managed By</div>
        {/* <div className="buttons flex gap-[10px]">
          <a href={`tel:+91${landlord.phone}`}>
            <button className="call w-[40px] h-[40px] hover:bg-[#b3b3b3] rounded-full flex items-center justify-center duration-300">
              <img
                src="/images/call.png"
                alt="call"
                className="h-[27px] w-[27px]"
              />
            </button>
          </a>
          <Link to="/messenger">
            <button className="message w-[40px] h-[40px] hover:bg-[#b3b3b3] rounded-full flex items-center justify-center duration-300 cursor-pointer">
              <img
                src="/images/message.png"
                alt="message"
                className="h-[27px] w-[27px]"
              />
            </button>
          </Link>
        </div> */}
      </div>
      <div className="flex gap-[20px] mt-[32px]">
        <div className="img ">
          <img
            src={imgSrc}
            alt={landlord.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/images/usericon.png";
            }}
            className="h-[80px] w-[80px] rounded-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-[18px] text-[#8a8a8a] font-medium">
            {landlord.name}
          </p>
          <p className="text-[18px] text-[#8a8a8a] ">+91 {landlord.phone}</p>
          <p className="text-[18px] text-[#8a8a8a] ">{landlord.email}</p>
        </div>
      </div>
    </div>
  );
};

export default OwnerCard;