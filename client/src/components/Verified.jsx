const Verified = () => {
  return (
    <div className="ml-[8px]">
      <div className="flex h-[30px] w-[190px] gap-[5px] bg-[#e8e8e8] rounded-full pl-[5px]">
        <div className="flex items-center justify-center ">
          <img
            src="./images/verify2.png"
            alt="verified"
            className="h-[25px] w-[25px]"
          />
        </div>
        <div className="flex items-center justify-center font-medium text-[#49ADF4] text-[15px]">
          RoomEase Verified
        </div>
      </div>
    </div>
  );
};

export default Verified;
