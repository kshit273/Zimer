import React, { useState } from "react";

const UserProfile = ({ formData }) => {
  const hasProfilePic =
    formData?.profilePicture && formData.profilePicture !== "";
  const profilePreview = hasProfilePic
    ? formData.profilePicture.startsWith("http")
      ? formData.profilePicture
      : `http://localhost:5000${formData.profilePicture}`
    : "/images/usericon.png"; // use public folder path

  return (
    <div className="flex gap-6">
      <div className="w-[100px] h-[100px] flex items-center justify-center">
        <img
          src={profilePreview}
          alt="profilePicture"
          className={`object-cover rounded-full ${
            hasProfilePic
              ? "w-[100px] h-[100px] opacity-100"
              : "w-[60px] h-[60px] opacity-60"
          }`}
        />
      </div>
      <div className="flex flex-col justify-center">
        <span className="font-medium text-[20px]">{`${formData.firstName} ${formData.lastName}`}</span>
        <span className="text-[16px] text-[#666666]">+91 {formData.phone}</span>
        <span className="text-[16px] text-[#666666]">{formData.email}</span>
        <span className="text-[16px] text-[#1a1a1a]">{formData.role.charAt(0).toUpperCase() +  formData.role.slice(1)}</span>
      </div>
    </div>
  );
};

export default UserProfile;
