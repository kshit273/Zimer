import { Link } from "react-router-dom";

const User = ({ imgPath, user }) => {
  const userRole = user?.role || "tenant";
  const userImg = user?.profilePicture
    ? `http://localhost:5000${user.profilePicture}`
    : "/images/user.png";

  return (
    <>
      <div className="flex justify-center items-center rounded-[15px] gap-10 ">
        <Link to={`/${userRole}/dashboard`}>
          <div className="flex gap-2 items-center justify-center">
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