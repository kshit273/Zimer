import React from "react";

const SavedPGTemp = ({ data }) => {
  let formattedDate = "Unknown Date"; // default fallback

  if (data?.joinDate) {
    const newDate = new Date(data.joinDate);

    // Check if it's a valid date
    if (!isNaN(newDate.getTime())) {
      const basicFormattedDate = newDate.toISOString().split("T")[0];
      const basicFormattedTime = newDate.toTimeString().split(" ")[0];
      const dateTime = new Date(`${basicFormattedDate}T${basicFormattedTime}`);

      // Format date nicely (e.g., "22 October 2025")
      formattedDate = dateTime.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  }

  return (
    <div className="flex flex-col gap-2 bg-[#e2e2e2] p-2 rounded-[20px]">
      <div className="flex gap-6">
        <div>
          <div className="h-[200px] w-[200px] rounded-[20px] bg-[#1a1a1a]">
            <img
              src={`http://localhost:5000${data.coverPhoto}`}
              alt="PG Cover"
              className="w-full h-full object-cover rounded-[20px]"
            />
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-2">
          <div>
            <p className="text-[#464646] font-medium text-[24px]">
              {data.pgName}
            </p>
          </div>
          <div className="w-[450px]">
            <p className="text-[#5c5c5c] text-[18px]">{data.address}</p>
          </div>
          <div className="">
            <p className="text-[#5c5c5c] text-[18px] font-medium">Owned by {data.landlordFirstName + " " +  data.landlordLastName}</p>
          </div>
          <div className="flex gap-2">
            <button className="px-6 py-2 bg-gradient-to-r from-[#d72638] to-[#ff0084] text-[15px] text-white font-normal rounded-full">
              Message
            </button>
            {/* <button className="p-2 border-[1px] border-[#1a1a1a] rounded-full">
              <img
                src="../images/call.png"
                alt=""
                className="h-[20px] w-[20px]"
              />
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedPGTemp;
