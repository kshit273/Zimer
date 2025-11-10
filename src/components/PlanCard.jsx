import { premiumList } from "../constants/Abt";
import { useMediaQuery } from "react-responsive";

const PlanCard = ({ title, price, list, priBg, secBg, line }) => {
  const isMedScreen = useMediaQuery({ minWidth: 801, maxWidth: 1800 });
  const isSmallScreen = useMediaQuery({ maxWidth: 800 });
  return (
    <div
      style={{ background: priBg }}
      className={` ${
        isMedScreen
          ? `h-[700px] w-[475px]`
          : isSmallScreen
          ? `h-[400px] w-[250px]`
          : `h-[1055px] w-[600px]`
      }  rounded-[20px] `}
    >
      <div
        style={{ color: secBg }}
        className={` ${
          isMedScreen
            ? `pt-[40px] text-[35px]`
            : isSmallScreen
            ? `pt-[20px] text-[20px]`
            : `pt-[70px] text-[40px]`
        } flex items-center justify-center font-medium `}
      >
        {title}
      </div>
      <div
        style={{ color: secBg }}
        className={` ${
          isMedScreen
            ? `text-[90px]`
            : isSmallScreen
            ? `text-[55px] pb-2`
            : `text-[130px]`
        } flex items-center justify-center font-medium `}
      >
        {price}%
      </div>
      <div
        style={{ color: secBg }}
        className={` ${
          isMedScreen
            ? `text-[20px] pb-[50px]`
            : isSmallScreen
            ? `text-[10px] pb-[10px]`
            : `text-[25px] pb-[50px]`
        } flex items-center justify-center font-medium  mt-[-25px]`}
      >
        per month
      </div>
      <div
        className={
          isMedScreen ? `px-[70px]` : isSmallScreen ? `px-[40px]` : `px-[70px]`
        }
      >
        <img src={line} alt="line" />
      </div>
      <div className="flex justify-center">
        <div
          className={` ${
            isMedScreen
              ? `gap-[8px] pt-[40px]`
              : isSmallScreen
              ? `gap-[8px] pt-[20px]`
              : `gap-[12px] pt-[40px]`
          } flex flex-col  `}
        >
          {premiumList.map((item, idx) => (
            <div
              key={idx}
              className={`${
                isMedScreen
                  ? `gap-[10px]`
                  : isSmallScreen
                  ? `gap-[5px]`
                  : `gap-[60px]`
              } flex`}
            >
              <div
                style={{ color: "#747474" }}
                className={
                  isMedScreen
                    ? `text-[15px] w-[375px]`
                    : isSmallScreen
                    ? `text-[9px] w-[190px]`
                    : `text-[19px] w-[400px]`
                }
              >
                {item}
              </div>
              <div
                className={
                  isMedScreen
                    ? `h-[30px] w-[30px]`
                    : isSmallScreen
                    ? `h-[17px] w-[17px]`
                    : `h-[30px] w-[30px]`
                }
              >
                {list.includes(item) ? (
                  <img src="./images/check.png" alt="tick"></img>
                ) : (
                  <img src="./images/close.png" alt="cross"></img>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        className={`flex items-center justify-center ${
          isMedScreen ? `pt-[30px]` : isSmallScreen ? `pt-[15px]` : `pt-[55px]`
        } `}
      >
        <button
          style={{ background: secBg, color: priBg }}
          className={`${
            isMedScreen
              ? `h-[50px] w-[180px] text-[17px]`
              : isSmallScreen
              ? `h-[25px] w-[90px] text-[9px]`
              : `h-[65px] w-[210px] text-[20px]`
          } transform rounded-full  font-medium hover:scale-105 transition duration-500`}
        >
          Choose plan
        </button>
      </div>
    </div>
  );
};

export default PlanCard;
