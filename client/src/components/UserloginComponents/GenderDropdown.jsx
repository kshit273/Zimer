import React from "react";
import Dropdown from "../Dropdown/Dropdown";
import DropdownItem from "../Dropdown/DropdownItem";

const GenderDropdown = ({ gender, setGender }) => {
  const genderList = ["Male", "Female", "Other", "Prefer not to say"];
  return (
    <Dropdown
      buttonText={gender}
      content={(closeDropdown) => (
        <>
          {genderList.map((item) => (
            <DropdownItem
              key={item}
              onClick={() => {
                setGender(item);
                closeDropdown();
              }}
            >
              {item}{" "}
            </DropdownItem>
          ))}
        </>
      )}
    />
  );
};

export default GenderDropdown;
