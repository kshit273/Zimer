import { useMediaQuery } from "react-responsive";

const ReviewCard = ({ card }) => {
  const isMedScreen = useMediaQuery({ minWidth: 768, maxWidth: 1400 });
  const isSmallScreen = useMediaQuery({ maxWidth: 767 });
  return (
    <div
      className={` ${
        isSmallScreen
          ? `h-[200px] w-[320px] bg-[#2f2f2f]`
          : `h-[380px] w-[650px] bg-[#d7d7d7]`
      }  rounded-[20px] flex-col px-[20px] py-[20px] mb-[10px]`}
    >
      <div className={`${isSmallScreen ? `ml-0` : `ml-[10px]`} flex `}>
        <div
          className={`${
            isSmallScreen
              ? `h-[30px] w-[30px] mt-0`
              : `h-[80px] w-[80px] mt-[10px]`
          }  `}
        >
          <img src={card.image} alt={card.user} className="rounded-full" />
        </div>
        <div
          className={`${
            isSmallScreen ? `mt-0 pl-[10px]` : `mt-[10px] pl-[20px]`
          }  `}
        >
          <div
            className={`${
              isSmallScreen ? `text-[12px] text-[#e8e8e8]` : `text-[27px]`
            }  font-medium `}
          >
            {card.user}
          </div>
          <div
            className={`${
              isSmallScreen ? `text-[#e8e8e8] text-[9px]` : `text-[20px]`
            } `}
          >
            {card.link}
          </div>
        </div>
      </div>
      <div
        className={`${
          isSmallScreen
            ? `text-[#e8e8e8] mt-[10px] text-[10px]`
            : `mt-[20px] text-[19px]`
        } `}
      >
        <p>{card.review}</p>
      </div>
      <div
        className={`${
          isSmallScreen
            ? ` h-[10px] w-[10px] mt-[8px]`
            : ` h-[40px] w-[40px] mt-[15px]`
        }  flex gap-[2px]`}
      >
        {[...Array(card.stars || 1)].map((_, idx) => (
          <img
            key={idx}
            src="./images/yellowstar.png"
            alt="star"
            className={
              isSmallScreen ? `h-[10px] w-[10px]` : `h-[40px] w-[40px]`
            }
          />
        ))}
      </div>
    </div>
  );
};

export default ReviewCard;
