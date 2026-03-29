const RoomReviewCard = ({ userData, date, rating, review }) => {

  const username = userData
    ? `${userData.firstName} ${userData.lastName || ""}`.trim()
    : "Anonymous";

  const profilePicture = `http://localhost:5000${userData?.profilePicture}` || "/images/user.jpg";

  return (
    <div className=" w-[700px] rounded-[20px] p-[25px] shadow-md">
      <div className="top flex gap-[20px]">
        <div className="left">
          <img
            src={profilePicture}
            alt={username}
            className="h-[50px] w-[50px] rounded-full object-cover"
          />
        </div>
        <div className="right flex flex-col gap-0">
          <p className="text-[20px] font-medium text-[#1a1a1a]">{username}</p>
          <p className="text-[14px] font-medium text-[#565656]">{date}</p>
          <div className="stars flex items-center gap-1 pt-[2px]">
            {[...Array(5)].map((_, i) =>
              i < Math.round(rating) ? (
                <img
                  key={i}
                  src="/images/star-filled.png"
                  alt="star"
                  className="w-[14px] h-[14px]"
                />
              ) : (
                <img
                  key={i}
                  src="/images/star-empty.png"
                  alt="star-empty"
                  className="w-[18px] h-[18px]"
                />
              )
            )}
          </div>
        </div>
      </div>
      <div className="bottom text-[16px] py-[20px] text-[#464646] font-medium">
        {review}
      </div>
    </div>
  );
};

export default RoomReviewCard;