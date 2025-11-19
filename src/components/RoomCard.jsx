import { useState, useEffect, useRef } from "react";
import Like from "../components/Like";
import { useMediaQuery } from "react-responsive";

const RoomCard = ({pgData, isPremiumSlider}) => {
  const isMedScreen = useMediaQuery({ minWidth: 801, maxWidth: 1024 });
  const isSmallScreen = useMediaQuery({ maxWidth: 800 });
  const [islikeHovered, setIsLikeHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isMoreClicked, setMoreClicked] = useState(false);

  // console.log(pgData)

  const moreRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreClicked(false);
      }
    };

    if (isMoreClicked) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMoreClicked]);

  return (
    <div
      className={`${
        isMedScreen
          ? `h-[260px] w-[250px]`
          : isSmallScreen
          ? `h-[180px] w-[150px]`
          : `h-[390px] w-[350px]`
      } rounded-[10px] relative`}
    >
      <div
        className={`${
          isMedScreen
            ? `h-[180px] w-[250px]`
            : isSmallScreen
            ? `h-[100px] w-[150px]`
            : `h-[280px] w-[350px]`
        } flex items-center justify-center relative`}
      >
        <img
          src={`http://localhost:5000${pgData.coverPhoto}`}
          alt=""
          className={
            isMedScreen
              ? `rounded-[14px] w-[230px] h-[160px]`
              : isSmallScreen
              ? `rounded-[14px] w-[140px] h-[100px] `
              : `rounded-[20px] w-[330px] h-[260px]`
          }
        />
        <div
          className={`absolute inset-0 ${
            isMedScreen
              ? `m-[17px]`
              : isSmallScreen
              ? `mt-[5px] ml-[10px]`
              : `m-[20px]`
          }`}
        >
          {pgData.plan == 'popular' ? (
            <div
              className={`${
                isMedScreen
                  ? `w-[125px] h-[18px] p-[2px] mb-[10px]`
                  : isSmallScreen
                  ? `w-[110px] h-[14px] p-[1px] font-medium mb-[5px]`
                  : `w-[155px] h-[30px] p-[5px] mb-[10px]`
              } flex gap-[5px]  bg-[#e8e8e8] rounded-[20px]   font-medium`}
            >
              <img src="/images/verify2.png" alt="verified" />
              <p
                className={`text-[#383838] ${
                  isMedScreen
                    ? `text-[10px]`
                    : isSmallScreen
                    ? `text-[9px]`
                    : `text-[15px]`
                } `}
              >
                Zimer Verified
              </p>
            </div>
          ) : null}
          {pgData.plan == 'premium' ? (
            <div
              className={`flex ${
                isMedScreen
                  ? `w-[80px] h-[19px] `
                  : isSmallScreen
                  ? `w-[70px] h-[14px]`
                  : `w-[115px] h-[30px] pr-[10px] `
              }  gap-[5px]  items-center  bg-[#1a1a1a]  rounded-[20px]   font-medium`}
            >
              <img
                src="/images/crown.png"
                alt="verified"
                className={
                  isMedScreen
                    ? `h-[15px] ml-[5px]`
                    : isSmallScreen
                    ? `h-[12px] ml-[3px]`
                    : `h-[20px] ml-[8px]`
                }
              />

              <p
                className={`${
                  isMedScreen
                    ? `text-[10px]`
                    : isSmallScreen
                    ? `text-[9px]`
                    : `text-[15px]`
                } text-[#d8d8d8] `}
              >
                Premium
              </p>
            </div>
          ) : null}
        </div>
      </div>
      <div className="mx-[10px]">
        <p
          className={`${
            isMedScreen
              ? `text-[16px]`
              : isSmallScreen
              ? `text-[12px] mt-[5px]`
              : `text-[22px]`
          } font-medium ${
            isPremiumSlider ? `text-[#c0c0c0]` : `text-[#1a1a1a]`
          } `}
        >
          {pgData.pgName}
        </p>
      </div>
      <div className="flex justify-between">
        <div className="mx-[10px] flex flex-col">
          <p
            className={`${
              isMedScreen
                ? `text-[11px] text-[#919191]`
                : isSmallScreen
                ? `text-[9px] text-[#585858]`
                : `text-[17px] text-[#919191]`
            } `}
          >
            {pgData.description}
          </p>
          <div
            className={`flex items-center ${
              isSmallScreen ? `gap-[2px]` : `gap-1`
            }`}
          >
            {[...Array(5)].map((_, i) =>
              i < pgData.averageRatings.overall ? (
                <img
                  key={i}
                  src="/images/star-filled.png"
                  alt="star"
                  className={
                    isMedScreen
                      ? `w-[10px] h-[10px]`
                      : isSmallScreen
                      ? `w-[7px] h-[7px]`
                      : `w-[13px] h-[13px]`
                  }
                />
              ) : (
                <img
                  key={i}
                  src="/images/star-empty.png"
                  alt="star-empty"
                  className={
                    isMedScreen
                      ? `w-[10px] h-[10px]`
                      : isSmallScreen
                      ? `w-[7px] h-[7px]`
                      : `w-[13px] h-[13px]`
                  }
                />
              )
            )}
          </div>
        </div>
        <div
          className="flex gap-[10px] items-end mr-[10px] relative"
          ref={moreRef}
        >
          <button
            onMouseEnter={() => setIsLikeHovered(true)}
            onMouseLeave={() => setIsLikeHovered(false)}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked((prev) => !prev);
            }}
            className="cursor-pointer"
          >
            <div
              className={`${
                isMedScreen
                  ? `w-[20px] h-[20px]`
                  : isSmallScreen
                  ? `w-[20px] h-[20px]`
                  : `w-[40px] h-[40px] p-[7px]`
              } bg-[#d0d0d0] rounded-full flex items-center justify-center duration-300`}
            >
              <Like size={isMedScreen ? 14 : isSmallScreen ? 14 : 30} />
            </div>
          </button>

          <button
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setMoreClicked((prev) => !prev);
            }}
          >
            <div
              className={`${
                isMedScreen
                  ? `w-[20px] h-[20px] p-[4px]`
                  : isSmallScreen
                  ? `w-[20px] h-[20px] p-[4px]`
                  : `w-[40px] h-[40px] p-[7px]`
              } bg-[#d0d0d0] rounded-full flex items-center justify-center `}
            >
              <img src="/images/more.png" alt="More options" />
            </div>
          </button>

          {isMoreClicked && (
            <div
              className={`absolute top-[-110px] right-0 bg-[#e8e8e8] ${
                isSmallScreen ? `w-[130px]` : `w-[180px]`
              } shadow-lg rounded-[10px] p-[8px]  z-50`}
            >
              <ul
                className={`${
                  isSmallScreen ? `text-[10px] gap-[2px]` : `text-[15px] gap-2`
                } flex flex-col   text-[#1a1a1a]`}
              >
                <li
                  className={`${
                    isSmallScreen ? `` : ``
                  } hover:bg-[#cacaca] p-[5px] rounded-[5px] cursor-pointer duration-300`}
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Report listing", RID);
                    setMoreClicked(false);
                  }}
                >
                  🚩 Report Listing
                </li>
                <li
                  className={`${
                    isSmallScreen ? `` : ``
                  } hover:bg-[#cacaca] p-[5px] rounded-[5px] cursor-pointer duration-300`}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(
                      window.location.origin + `/pgData/${RID}`
                    );
                    setMoreClicked(false);
                  }}
                >
                  🔗 Copy Link
                </li>
                <li
                  className={`${
                    isSmallScreen ? `` : ``
                  } hover:bg-[#cacaca] p-[5px] rounded-[5px] cursor-pointer duration-300`}
                  onClick={(e) => {
                    e.stopPropagation();
                    const shareUrl = `https://wa.me/?text=Check%20out%20this%20pgData:%20${window.location.origin}/pgData/${RID}`;
                    window.open(shareUrl, "_blank");
                    setMoreClicked(false);
                  }}
                >
                  📤 Share on WhatsApp
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
