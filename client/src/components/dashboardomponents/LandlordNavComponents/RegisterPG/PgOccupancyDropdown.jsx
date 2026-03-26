import React from 'react'
import DropdownItem from '../../../Dropdown/DropdownItem';
import Dropdown from '../../../Dropdown/Dropdown';


const PgOccupancyDropdown = ({value,setItem}) => {
  const List = ["Single","Double","Triple","Quad","Other"];
 return (
    <Dropdown
      buttonText={value}
      content={(closeDropdown) => (
        <>
          {List.map((item) => (
            <DropdownItem
              key={item}
              onClick={() => {
                setItem(item);
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
}

export default PgOccupancyDropdown