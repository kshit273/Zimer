import { useMediaQuery } from "react-responsive";

const Data = () => {
  const isMedScreen = useMediaQuery({ minWidth: 768, maxWidth: 1400 });
  const isSmallScreen = useMediaQuery({ maxWidth: 767 });
  return (
    <div
      className={`flex flex-col items-center justify-center transform ${
        isMedScreen ? `scale-80` : isSmallScreen ? `scale-40` : `scale-100`
      }`}
    >
      <div className="w-[370px] h-[70px] bg-[#1a1a1a] rounded-full flex items-center pl-[10px] relative select-none">
        <div className="h-[50px] w-[50px] rounded-full bg-[#d72638] flex items-center justify-center">
          <div className="h-[25px] w-[25px]">
            <img
              src="./images/star.png"
              alt="star"
              className="pointer-events-none"
            />
          </div>
        </div>
        <div className="text-[#d9d9d9] font-medium pl-[20px] text-[20px]">
          Rated 4/5 by 1 lakh users
        </div>
      </div>
    </div>
  );
};

export default Data;
