import { useEffect, useState, useRef } from "react";

import DropdownButton from "./DropdownButton";
import DropdownContent from "./DropdownContent";

import "./Dropdown.css";

const Dropdown = ({ buttonText, content }) => {
  const [open, setOpen] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(0);

  const dropdownRef = useRef();
  const buttonRef = useRef();
  const contentRef = useRef();

  const toggleDropdown = () => {
    if (!open) {
      const spaceRemaining =
        window.innerHeight - buttonRef.current.getBoundingClientRect().bottom;
      const contentHeight = contentRef.current.clientHeight;

      const topPosition =
        spaceRemaining > contentHeight
          ? null
          : -(contentHeight - spaceRemaining); // move up by height clipped by window
      setDropdownTop(topPosition);
    }

    setOpen((open) => !open);
  };

  const handleSelect = (value) => {
    setOpen(false);
    // You can also handle the selected value here if needed
  };

  useEffect(() => {
    const handler = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handler);

    return () => {
      document.removeEventListener("click", handler);
    };
  }, [dropdownRef]);

  return (
    <div ref={dropdownRef} className="dropdown">
      <DropdownButton ref={buttonRef} toggle={toggleDropdown} open={open}>
        {buttonText}
      </DropdownButton>
      {
        <DropdownContent top={dropdownTop} ref={contentRef} open={open}>
          {typeof content === "function" ? content(handleSelect) : content}
        </DropdownContent>
      }
    </div>
  );
};

export default Dropdown;
