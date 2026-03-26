import React, { useState } from "react";
import GenderDropdown from "./GenderDropdown";

const signupForm1 = ({ setSignupStep, formData, setFormData }) => {
  const [errorMsg, setErrorMsg] = useState("");
  const [profilePreview, setProfilePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenderChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      gender: value,
    }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFormData((prev) => ({
      ...prev,
      profilePicture: file,
    }));
    if (file) {
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for empty fields
    if (!formData.firstName.trim() || !formData.dob.trim()) {
      setErrorMsg("All fields are mandatory");
      return;
    }

    // Check for gender selection
    if (formData.gender === "Gender*") {
      setErrorMsg("All fields are mandatory");
      return;
    }

    // Check for names starting with space
    if (
      formData.firstName.startsWith(" ") ||
      formData.lastName.startsWith(" ")
    ) {
      setErrorMsg("Names should not start with space");
      return;
    }

    // Check for numbers or special characters in names
    const nameRegex = /^[A-Za-z\s]+$/;
    if (
      !nameRegex.test(formData.firstName) ||
      !nameRegex.test(formData.lastName)
    ) {
      setErrorMsg("Names should not contain numbers or special characters");
      return;
    }

    // Check DOB format "DD/MM/YYYY" and only numbers
    const dobRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dobRegex.test(formData.dob)) {
      setErrorMsg("Invalid date format, use DD/MM/YYYY");
      return;
    }

    const [dayStr, monthStr, yearStr] = formData.dob.split("/");
    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    // Month-day validation
    const monthsWith30 = [4, 6, 9, 11];
    const monthsWith31 = [1, 3, 5, 7, 8, 10, 12];
    const currentYear = new Date().getFullYear();

    if (year > currentYear || year < 1940) {
      setErrorMsg("Invalid year");
      return;
    }

    if (monthsWith31.includes(month)) {
      if (day > 31) {
        setErrorMsg("Invalid date");
        return;
      }
    } else if (monthsWith30.includes(month)) {
      if (day > 30) {
        setErrorMsg("Invalid date");
        return;
      }
    } else if (month === 2) {
      if (year % 4 === 0) {
        if (day > 29) {
          setErrorMsg("Invalid date");
          return;
        }
      } else {
        if (day > 28) {
          setErrorMsg("Invalid date");
          return;
        }
      }
    } else {
      setErrorMsg("Invalid month");
      return;
    }

    setSignupStep(2);
  };

  return (
    <form className="w-3/4 flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="flex items-center justify-center mb-[30px]">
        <div className="relative bg-[#d7d7d7] h-[200px] w-[200px] rounded-full flex items-center justify-center">
          <img
            src={profilePreview || "./images/usericon.png"}
            alt=""
            className={
              profilePreview
                ? "h-[200px] w-[200px] object-cover rounded-full opacity-100"
                : "h-[100px] w-[100px] opacity-60 object-cover rounded-full"
            }
          />
          <label
            htmlFor="profile-upload"
            className="absolute bottom-4 right-4 bg-[#1a1a1a] h-[70px] w-[70px] rounded-full flex items-center justify-center cursor-pointer"
          >
            <img
              src="./images/pencil.png"
              alt="Edit"
              className="h-[32px] w-[32px]"
            />
          </label>
          <input
            id="profile-upload"
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept="image/*"
          />
        </div>
      </div>
      <div className="flex items-center bg-[#d7d7d7] rounded-full px-4 py-5">
        <span className="material-icons text-gray-500 mr-4 ml-2">
          <img
            src="./images/usericon.png"
            alt=""
            className="h-[26px] w-[26px]"
          />
        </span>
        <input
          type="text"
          name="firstName"
          placeholder="First name*"
          className="bg-[#d7d7d7] outline-none flex-1"
          value={formData.firstName}
          onChange={handleInputChange}
        />
      </div>
      <div className="flex items-center bg-[#d7d7d7] rounded-full px-4 py-5">
        <span className="material-icons text-gray-500 mr-4 ml-2">
          <img
            src="./images/usericon.png"
            alt=""
            className="h-[26px] w-[26px]"
          />
        </span>
        <input
          type="text"
          name="lastName"
          placeholder="Last name"
          className="bg-[#d7d7d7] outline-none flex-1"
          value={formData.lastName}
          onChange={handleInputChange}
        />
      </div>
      <div className="flex items-center justify-between ">
        <div className="flex items-center bg-[#d7d7d7] rounded-full px-4 pr-15 py-5 flex-1 ml-2">
          <span className="  mr-4 ml-2">
            <img
              src="./images/calender.png"
              alt=""
              className="h-[22px] w-[22px]"
            />
          </span>
          <input
            type="text"
            name="dob"
            placeholder="DD/MM/YYYY*"
            className="bg-[#d7d7d7] outline-none flex-1"
            value={formData.dob}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex items-center bg-[#d7d7d7] rounded-full px-4 pr-15 py-5 flex-1 mr-2 ml-2">
          <span className=" mr-4 ml-2">
            <img
              src="./images/gender.png"
              alt=""
              className="h-[26px] w-[26px]"
            />
          </span>
          <div className="w-full">
            <GenderDropdown
              gender={formData.gender}
              setGender={handleGenderChange}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center text-sm text-gray-600 mb-[22px]">
        <p>* mandatory fields</p>
        <p className="text-[#D72638]">{errorMsg ? "*" + errorMsg : errorMsg}</p>
      </div>
      <div className="flex items-center justify-center ">
        <div className="bg-[#1a1a1a] text-[#e8e8e8] rounded-full py-3 px-7 font-medium text-[12px] shadow-lg transition">
          1 / 3
        </div>
      </div>
      <div className="flex items-center justify-center ">
        <button
          className="bg-[#1a1a1a] text-white rounded-full py-3 px-3 font-semibold text-lg shadow-lg hover:bg-gray-900 transition cursor-pointer"
          type="submit"
        >
          <img
            src="./images/arrowWhite.png"
            alt=""
            className="h-[20px] w-[20px]"
          />
        </button>
      </div>
    </form>
  );
};

export default signupForm1;
