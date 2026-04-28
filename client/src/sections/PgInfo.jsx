import MapComp from "../components/MapComp";
import OwnerCard from "../components/OwnerCard";
import PgReview from "../components/PgReview";
import ShowRooms from "../components/ShowRooms";
import Footer from "./Footer";
import { services } from "../constants/Services";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const PgInfo = ({setToast, user}) => {
  const { RID } = useParams();
  const navigate = useNavigate();
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [zoomImg, setZoomImg] = useState(null);
  const [zoomImgIndex, setZoomImgIndex] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // copy-to-clipboard state for share button
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const link = window.location.href; 
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(link);
      } else {
        const ta = document.createElement("textarea");
        ta.value = link;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const postReport = async () => {
    try {
      await axios.post(
        "http://localhost:5000/auth/report",
        { pgId: pgData.RID },
        { withCredentials: true }
      );
      setToast("Report submitted successfully.", "success");
    } catch (err) {
      setToast("Failed to submit report. Please try again.","error");    }
  };

  // API data states
  const [pgData, setPgData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // Fetch PG data from API
  useEffect(() => {
    const fetchPgData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/pgs/show-data/${RID}`, {
          withCredentials: true,
        });
        setPgData(response.data);
        setToast(null);
      } catch (err) {
        console.error("Error fetching PG data:", err);
        setToast("Failed to load PG data","error");
      } finally {
        setLoading(false);
      }
    };

    if (RID) {
      fetchPgData();
    }
  }, [RID]);

  // Check if PG is already saved on component mount
  useEffect(() => {
    checkIfSaved();
  }, [RID]);

  const checkIfSaved = async () => {
    try {
      const response = await axios.get("http://localhost:5000/auth/saved-pgs", {
        withCredentials: true,
      });

      if (response.data.success) {
        const savedPGs = response.data.data;
        const isCurrentPgSaved = savedPGs.some((pg) => pg.RID === RID);
        setIsSaved(isCurrentPgSaved);
      }
    } catch (error) {
      console.error("Error checking saved status:", error);
    }
  };

  const handleSavePG = async () => {
    try {
      setIsLoading(true);

      const response = await axios.post(
        "http://localhost:5000/auth/saved-pgs",
        { RID },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setIsSaved(!isSaved);
      }
    } catch (error) {
      console.error("Error saving PG:", error);
      if (error.response?.status === 401) {
        setToast("Please login to save PGs","error");
        navigate("/login");
      } else {
        console.error(error.response?.data?.message || "Failed to save PG");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (!pgData?.otherPhotos || zoomImgIndex === null) return;
    if (zoomImgIndex < pgData.otherPhotos.length - 1) {
      const nextIndex = zoomImgIndex + 1;
      setZoomImgIndex(nextIndex);
      setZoomImg(pgData.otherPhotos[nextIndex]);
    }
  };

  const handlePrev = () => {
    if (!pgData?.otherPhotos || zoomImgIndex === null) return;
    if (zoomImgIndex > 0) {
      const prevIndex = zoomImgIndex - 1;
      setZoomImgIndex(prevIndex);
      setZoomImg(pgData.otherPhotos[prevIndex]);
    }
  };

const handleBookingRequest = async () => {
  if (user?.role !== "tenant") {
    setToast("This feature is only for the tenant accounts.", "error");
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:5000/auth/br",
      {
        sender: user._id,
        receiver: pgData.AID,
        RID: RID,
        pgName: pgData.pgName,
        senderEmail: user.email,
        senderContact: user.phone,
      },
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );

    if (response.status === 201) {
      const message =
        pgData.plan !== "basic"
          ? "Thank you for booking our team will contact you within 3 hours"
          : "Thank you for booking our team will contact you within 24 hours";

      setToast(message, "success");
    }
  } catch (error) {
    if (error.response?.status === 409) {
      setToast("Booking request already exists", "error");
    } else if (error.response?.status === 401) {
      setToast("Please login to send a booking request", "error");
      navigate("/login");
    } else {
      setToast(error.response?.data?.message || "Failed to send booking request", "error");
    }
  }
};

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (zoomImgIndex !== null) {
        if (e.key === "ArrowRight") handleNext();
        if (e.key === "ArrowLeft") handlePrev();
        if (e.key === "Escape") {
          setZoomImg(null);
          setZoomImgIndex(null);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoomImgIndex]);

  useEffect(() => {
    if (isOverlayOpen) {
      const scrollY = window.scrollY;

      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";

      document.body.dataset.scrollY = scrollY;
    } else {
      const scrollY = document.body.dataset.scrollY || "0";

      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";

      window.scrollTo(0, parseInt(scrollY));
      delete document.body.dataset.scrollY;
    }
  }, [isOverlayOpen]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-2xl text-gray-600">Loading PG details...</p>
      </div>
    );
  }

  if (err || !pgData) {
    return (
      <div className="text-center text-lg text-red-500 pt-10">
        {err || "PG not found."}
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-[50px] flex justify-start items-center mt-[110px] pl-[30px] ">
        <button onClick={() => navigate(-1)} className="flex items-center">
          <img
            src="/images/backArrow.png"
            alt=""
            className="h-[25px] w-[25px] cursor-pointer hover:scale-120 duration-300"
          />
        </button>
      </div>
      <section id="PgInfo" className="relative z-2 ">
        <div className="flex items-center justify-center">
          <div className="grid grid-cols-5 grid-rows-2 gap-4  p-4 rounded-2xl w-[96%] h-[600px]">
            <div className="col-span-3 row-span-2 rounded-2xl overflow-hidden ">
              <img
                src={`http://localhost:5000${pgData.coverPhoto}`}
                alt="Main"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            {pgData.otherPhotos?.slice(0, 4).map((photo, index) => (
              <div
                key={index}
                className={`col-span-1 row-span-1 rounded-2xl overflow-hidden ${
                  index === 3 ? "relative" : ""
                }`}
              >
                <img
                  src={`http://localhost:5000${photo}`}
                  alt={`img${index + 1}`}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-[60px] justify-between">
          <div className="info flex flex-col ">
            <div className="leftInfo ml-[60px] max-w-[1300px] w-full">
              <div className="main ">
                <div className="head text-[32px] font-medium text-[#1a1a1a] ">
                  {pgData.pgName}
                </div>
                <div className="address font-normal text-[20px] w-[500px] text-[#2a2a2a] ">
                  {pgData.address}
                </div>
                <div className="rating mb-[20px] flex items-center gap-[10px]">
                  <div className="stars flex items-center gap-1 py-[8px]">
                    {[...Array(5)].map((_, i) => (
                      <img
                        key={i}
                        src={
                          i < Math.round(pgData.averageRatings?.overall ?? 0)
                            ? "/images/star-filled.png"
                            : "/images/star-empty.png"
                        }
                        alt="star"
                        className="w-[16px] h-[16px]"
                      />
                    ))}
                  </div>
                  <div className="ratingNumber text-[16px] text-[#4d4d4d] flex items-center justify-center pt-[5px] font-medium">
                    <p>({pgData.averageRatings?.overall || 0})</p>
                  </div>
                </div>
                <div className="buttons flex gap-[12px] items-center">
                  <button
                    onClick={handleSavePG}
                    disabled={isLoading || !user}
                    className={`h-[44px] w-[180px] text-[16px] text-white font-medium rounded-full shadow transition-all ${
                      isSaved
                        ? "bg-gradient-to-r from-[#28a745] to-[#20c997]"
                        : "bg-gradient-to-r from-[#d72638] to-[#ff0084]"
                    } ${
                      isLoading || !user ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                    }`}
                  >
                    {isLoading ? "Processing..." : isSaved ? "Saved" : "Save for later"}
                  </button>
                  <button
                    onClick={handleShare}
                    title="Copy PG link"
                    className="h-[44px] w-[44px] bg-[#d9d9d9] rounded-full flex items-center justify-center relative hover:scale-105"
                  >
                    <img
                      src="/images/send.png"
                      alt="share"
                      className="h-[16px] w-[16px]"
                    />
                    {copied && (
                      <span className="absolute -top-8 right-1 text-[12px] bg-black text-white px-2 py-1 rounded">
                        Copied!
                      </span>
                    )}
                  </button>
                  <button
                    onClick={postReport}
                    disabled={!user}
                    title="Report PG"
                    className={`h-[44px] w-[44px] bg-[#d9d9d9] rounded-full flex items-center justify-center relative ${
                      !user ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                    }`}
                  >
                    <img
                      src="/images/report.png"
                      alt="report"
                      className="h-[16px] w-[16px]"
                    />
                  </button>
                  {!user && (
                    <span className="text-[14px] text-[#d72638] font-medium ml-2">
                      Login to access the features
                    </span>
                  )}
                </div>
              </div>
              <div className="desc flex flex-col gap-[2px] mt-[20px]">
                <div className="head text-[28px] font-medium">Description</div>
                <div className="para text-[16px] text-[#6c6c6c] ">
                  {pgData.description}
                </div>
              </div>
              {pgData.rules && pgData.rules.length > 0 && (
                <div className="desc flex flex-col gap-[3px] mt-[20px]">
                  <div className="head text-[28px] font-medium ">
                    Things to be kept in mind
                  </div>
                  <div className="para flex flex-col gap-[10px] ">
                    {pgData.rules.map((rule, idx) => (
                      <div className="flex gap-[10px] items-center" key={idx}>
                        <div className="h-[8px] w-[8px] rounded-full bg-[#1a1a1a]"></div>
                        <div className="text-[16px] text-[#6c6c6c]">{rule}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {pgData.amenities && pgData.amenities.length > 0 && (
  <div className="services mt-[20px]">
    <div className="head text-[28px] font-medium">Services provided</div>
    {(() => {
      const displayedAmenities = pgData.amenities
        .map((amenity) => {
          const found = services.find((s) => s.name === amenity);
          return { name: amenity, imgPath: found?.imgPath ?? null };
        })
        .slice(0, 10);

      const RenderIcon = ({ imgPath, name }) =>
        imgPath ? (
          <img
            src={imgPath.startsWith("./") ? imgPath.replace("./", "/") : imgPath}
            alt={name}
            className="h-[28px] w-[28px]"
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-[28px] w-[28px] text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="10" className="opacity-20" />
            <path d="M8 12h8M8 16h5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      if (displayedAmenities.length <= 4) {
        return (
          <div className="flex flex-col gap-y-5 mt-[20px] max-w-[400px]">
            {displayedAmenities.map((item, idx) => (
              <div key={idx} className="flex items-center gap-[12px]">
                <RenderIcon imgPath={item.imgPath} name={item.name} />
                <div className="text-[#6c6c6c] text-[16px]">{item.name}</div>
              </div>
            ))}
          </div>
        );
      }

      return (
        <div className="grid grid-cols-2 gap-x-10 gap-y-5 mt-[20px] max-w-[400px]">
          {displayedAmenities.map((item, idx) => (
            <div key={idx} className="flex items-center gap-[12px]">
              <RenderIcon imgPath={item.imgPath} name={item.name} />
              <div className="text-[#6c6c6c] text-[16px]">{item.name}</div>
            </div>
          ))}
        </div>
      );
    })()}
  </div>
)}
            </div>

            <div className="rooms ml-[60px] mt-[30px]">
              <ShowRooms RID={RID} pgData={pgData} onBookingRequest={handleBookingRequest} user={user} />
            </div>
          </div>
          <div className="rightInfo min-w-[485px] max-w-[485px]">
            <div className="sticky top-[150px] flex flex-col gap-[20px]">
              {/* <OwnerCard LID={pgData?.LID} /> */}
              <MapComp RID={RID} />
            </div>
          </div>
        </div>

        <div>
          <PgReview RID={RID} pgData={pgData}/>
        </div>
        <div className="w-[100vw] flex items-center justify-center my-[20px]">
          <div className="h-[1.5px] w-[80vw] bg-[#a4a4a4]"></div>
        </div>
        <Footer />
      </section>
    </>
  );
};

export default PgInfo;