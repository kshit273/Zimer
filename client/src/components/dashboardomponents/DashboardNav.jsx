import { useNavigate } from "react-router-dom";

const DashboardNav = ({
  bar,
  setBar,
  setUser,
  setShowLogout,
  navList,
  role,
}) => {
  const navigate = useNavigate();

  const handleClick = (ele, i) => {
    ele === "Log out" ? setShowLogout(true) : setBar(i);
  };

  return (
    <div className="w-full flex flex-col gap-3 justify-center p-5 relative">
      {navList.map((ele, i) => (
        <div
          key={i}
          className={`
  ${
    ele === "Leave PG" || ele === "Log out"
      ? `text-[#d72638] hover:text-[#e8e8e8] hover:bg-[#d72638]`
      : `text-[#1a1a1a] hover:bg-[#dbdbdb]`
  }
  ${
    role === "tenant"
      ? bar === i && i === 5
        ? `bg-[#d72638] text-[#e8e8e8]`
        : bar === i
        ? `bg-[#d7d7d7]`
        : ``
      : bar === i
      ? `bg-[#d7d7d7]`
      : ``
  }
  w-full p-3 text-[20px] rounded-[10px] cursor-pointer duration-200
`}
          onClick={() => handleClick(ele, i)}
        >
          {ele}
        </div>
      ))}
    </div>
  );
};

export default DashboardNav;
