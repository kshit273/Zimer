import React, { useEffect, useState } from "react";
import axios from "axios";
import UpdationForm from "./UpdationForm";

const UpdateProfile = ({ setUser, formData, setFormData }) => {
  const [loading, setLoading] = useState(false);

  // Handle update request
const handleUpdate = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const formDataToSend = new FormData();

    // Append profile picture file if present
    Object.keys(formData).forEach((key) => {
      if (key === "profilePicture" && formData[key] instanceof File) {
        formDataToSend.append("profilePicture", formData[key]);
      } 
      // else if (key === "role" && formData[key] !== undefined && formData[key] !== null) {
      //   // Append role (string)
      //   formDataToSend.append("role", String(formData[key]));
      // }
    });

    const res = await axios.put(
      "http://localhost:5000/auth/update",
      formDataToSend,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (res.data?.user) {
      setUser(res.data.user);
    }
  } catch (err) {
    console.error("Update error:", err.response?.data || err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="w-full bg-[#e8e8e8] rounded-[20px] py-4 items-center justify-center">
      <UpdationForm
        formData={formData}
        setFormData={setFormData}
        handleUpdate={handleUpdate}
      />
    </div>
  );
};

export default UpdateProfile;
