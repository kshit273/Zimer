import React from "react";

const AreaDropDown = ({ areas, value, onChange }) => {
  return (
    <div className="mt-3">
      <label className="block text-[18px] text-[#5c5c5c] font-medium mb-2">
        Select Nearest Area
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 bg-[#e8e8e8] rounded-lg"
      >
        <option value="">-- Select Area --</option>
        {areas.map((area, i) => (
          <option key={i} value={area.code}>
            {area.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AreaDropDown;
