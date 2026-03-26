import React, { useRef, useState } from "react";
import RoomCard from "../components/RoomCard";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

const RoomSlider = ({ list, heading, onRoomClick, desc, cityName }) => {
  const isMedScreen = useMediaQuery({ minWidth: 801, maxWidth: 1024 });
  const isSmallScreen = useMediaQuery({ maxWidth: 800 });
  const scrollRef = useRef();
  const navigate = useNavigate();

  // console.log(list)

  const handleHeadingClick = () => {
    navigate(`/search/${cityName}`);
  };

  const handleCardClick = (RID) => {
    navigate(`/pg/${RID}`);
  };
  const [isRightHovered, setIsRightHovered] = useState(false);
  const [isLeftHovered, setIsLeftHovered] = useState(false);

  // Scroll handler 
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 700;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };
  return (
    <div
      className={`${
        isMedScreen ? `mt-[30px]` : isSmallScreen ? `mt-[20px]` : `mt-[50px]`
      }  w-[90%]`}
    >
      <div
        className={`flex ${
          isMedScreen
            ? `gap-[10px]`
            : isSmallScreen
            ? `gap-[5px]`
            : `gap-[20px]`
        }  items-center`}
      >
        <p
          className={`text-[#1a1a1a] ${
            isMedScreen
              ? `text-[23px]`
              : isSmallScreen
              ? `text-[17px]`
              : `text-[35px]`
          } font-medium `}
        >
          {heading}
        </p>
        <div onClick={handleHeadingClick}>
          <img
            src="/images/arrowBlack.png"
            alt=""
            className={`${
              isMedScreen ? `h-[14px]` : isSmallScreen ? `h-[10px]` : `h-[20px]`
            } cursor-pointer hover:translate-x-2 duration-300`}
          />
        </div>
      </div>
      <p
        className={` ${
          isMedScreen
            ? `text-[15px] text-[#969696]`
            : isSmallScreen
            ? `text-[12px] text-[#606060]`
            : `text-[20px] text-[#969696]`
        } mb-[5px]`}
      >
        {desc}
      </p>
      <div className=" flex items-center relative">
        {!isMedScreen && !isSmallScreen ? (
          <button
            className="flex items-center justify-center absolute left-[-4%] bottom-[50%] z-10 h-[65px] w-[65px] bg-[#e8e8e8] rounded-full shadow p-2 hover:bg-[#b9b9b9]  transition duration-400"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            type="button"
            onMouseEnter={() => setIsLeftHovered(true)}
            onMouseLeave={() => setIsLeftHovered(false)}
          >
            <img
              src={
                isLeftHovered
                  ? "/images/arrowWhite.png"
                  : "/images/arrowBlack.png"
              }
              alt="arrow-right"
              className="h-[20px] w-[20px] rotate-180"
            />
          </button>
        ) : null}

        <div
          ref={scrollRef}
          className={`flex ${
            isMedScreen || isSmallScreen ? `gap-0` : `gap-[10px]`
          }  overflow-x-auto scroll-smooth w-full no-scrollbar`}
          style={{ scrollBehavior: "smooth" }}
        >
          {list.map(
            (pg) => (
              <div
                key={pg.RID}
                onClick={() => {
                  onRoomClick && onRoomClick(pg.RID);
                  handleCardClick(pg.RID);
                }}
                style={{ cursor: "pointer" }}
              >
                <RoomCard pgData={pg} isPremiumSlider={false}/>
              </div>
            )
          )}
        </div>
        {!isMedScreen && !isSmallScreen ? (
          <button
            className="flex items-center justify-center absolute right-[-5%] bottom-[50%] h-[70px] w-[70px] z-10 bg-[#e8e8e8] rounded-full shadow p-2 hover:bg-[#b9b9b9]  transition duration-400"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            type="button"
            onMouseEnter={() => setIsRightHovered(true)}
            onMouseLeave={() => setIsRightHovered(false)}
          >
            <img
              src={
                isRightHovered
                  ? "/images/arrowWhite.png"
                  : "/images/arrowBlack.png"
              }
              alt="arrow-right"
              className="h-[20px] w-[20px]"
            />
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default RoomSlider;
