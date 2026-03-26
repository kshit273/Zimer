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
          <div className="flex gap-4 items-start justify-center">
            <div className="flex flex-col items-end justify-center">
              <p className="text-[20px] text-[#1a1a1a] font-medium ">Dashboard</p>
              <div className="flex items-center justify-center gap-1 mt-[-2px]">
                <p>{user.role}</p>
                <img src="./images/arrowBlack.png" alt="" className="h-[10px] w-[10px]"/>
              </div>
            </div>
            <img
              src={userImg}
              alt="profile"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/images/user.png";
              }}
              className="h-[55px] w-[55px] rounded-[15px]  cursor-pointer"
            />
          </div>
        </Link>
      </div>
    </>
  );
};

export default User;