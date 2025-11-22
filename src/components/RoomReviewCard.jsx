const RoomReviewCard = ({ userData, date, rating, review }) => {

  const username = userData
    ? `${userData.firstName} ${userData.lastName || ""}`.trim()
    : "Anonymous";

  const profilePicture = `http://localhost:5000${userData?.profilePicture}` || "/images/user.jpg";

  return (
    <div className="h-[380px] w-[700px] rounded-[20px] p-[25px] border-[0.5px] border-[#b5b2b2] shadow-md">
      <div className="top flex gap-[20px]">
        <div className="left">
          <img
            src={profilePicture}
            alt={username}
            className="h-[90px] w-[90px] rounded-full object-cover"
          />
        </div>
        <div className="right flex flex-col gap-0">
          <p className="text-[23px] font-medium text-[#1a1a1a]">{username}</p>
          <p className="text-[16px] font-medium text-[#565656]">{date}</p>
          <div className="stars flex items-center gap-1 pt-[5px]">
            {[...Array(5)].map((_, i) =>
              i < Math.round(rating) ? (
                <img
                  key={i}
                  src="/images/star-filled.png"
                  alt="star"
                  className="w-[18px] h-[18px]"
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
      <div className="bottom text-[20px] py-[20px] text-[#464646] font-medium">
        {review}
      </div>
    </div>
  );
};

export default RoomReviewCard;