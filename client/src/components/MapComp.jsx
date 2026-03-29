const MapComp = () => {
  return (
    <div className="w-[420px] h-[470px] bg-[#d9d9d9] rounded-[20px] flex flex-col gap-[15px] px-[10px] py-[8px] ">
      <div className="flex justify-between items-center px-[15px]">
        <div className=" flex flex-col gap-0 mt-[7px]">
          <p className="text-[#1a1a1a] text-[24px] font-medium   ">
            Where you'll be
          </p>
          <p className="text-[#8c8c8c] text-[16px] font-medium ">
            Explore the location of this PG on the map
          </p>
        </div>
        <div className="p-[5px] bg-[#c6c6c6] rounded-full hover:bg-[#9f9f9f] duration-300 cursor-pointer">
          <img src="/images/info.png" alt="" className="h-[16px] w-[16px]" />
        </div>
      </div>

      <div className="flex items-center justify-center">
        <img src="/images/mapComp.png" alt="" className="blur-xs w-[470px]" />
        <div className="absolute bg-[#e9e9e9] px-5 py-3 rounded-[20px] flex items-center gap-[20px]">
          <div>
            <img src="/images/lock.png" alt="" className="h-[25px] w-[25px]" />
          </div>
          <p className="text-[20px]">For verified PGs</p>
        </div>
      </div>
    </div>
  );
};

export default MapComp;
