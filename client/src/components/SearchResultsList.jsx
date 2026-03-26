import { useNavigate } from "react-router-dom";
import RoomCard from "./RoomCard";
import { useMediaQuery } from "react-responsive";

const SearchResultsList = ({ search_keyword, list, onRoomClick }) => {
  // console.log(list)
  const isMedScreen = useMediaQuery({ minWidth: 801, maxWidth: 1024 });
  const isSmallScreen = useMediaQuery({ maxWidth: 800 });
  const navigate = useNavigate();

  const handleCardClick = (RID) => {
    navigate(`/pg/${RID}`);
  };
  return (
    <div
      className={`${
        isSmallScreen ? `mt-[10px]` : `mt-[30px]`
      } w-[90%] flex justify-start`}
    >
      <div className={!isMedScreen && !isSmallScreen ? `w-[80%]` : ``}>
        <div
          className={`${
            isSmallScreen ? `text-[12px] mb-[10px]` : `text-[25px] mb-[20px]`
          }  font-medium text-[#1a1a1a] `}
        >
          Search results for : {search_keyword}
        </div>
        <div
          className={`grid ${
            isSmallScreen
              ? `grid-cols-2 gap-[25px]`
              : isMedScreen
              ? `grid-cols-2 gap-auto`
              : `grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-[20px]`
          }  grid-rows-auto `}
        >
          {list.map(
            (pg,head) => (
              <div
                key={head}
                onClick={() => {
                  onRoomClick && onRoomClick(RID);
                  handleCardClick(RID);
                }}
                style={{ cursor: "pointer" }}
              >
                <RoomCard
                  pgData={pg}
                  isPremiumSlider={false}
                />
              </div>
            )
          )}
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default SearchResultsList;
