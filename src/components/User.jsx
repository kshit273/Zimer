import { Link } from "react-router-dom";

const User = ({ imgPath, user }) => {
  const userName = user?.fullName || `${user?.firstName} ${user?.lastName}` || "User";
  const userRole = user?.role || "tenant";
  const userImg = user?.profilePicture
    ? `http://localhost:5000${user.profilePicture}`
    : "/images/user.png";

  return (
    <>
      <div className="flex justify-center items-center w-[230px] bg-[#d7d7d7] rounded-[15px] gap-10 ">
        <Link to={`/${userRole}/dashboard`}>
          <div className="flex gap-2 items-center justify-center">
            <div className="flex flex-col p-2">
              <p className="font-medium text-[19px]">{userName}</p>
              <p className="text-[18px]">{userRole}</p>
            </div>
            <img
              src={userImg}
              alt="profile"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/images/user.png";
              }}
              className="h-[50px] w-[50px] rounded-full flex-shrink-0 cursor-pointer"
            />
          </div>
        </Link>
      </div>
    </>
  );
};

export default User;