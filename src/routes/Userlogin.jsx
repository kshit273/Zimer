import React, { useState } from "react";
import LoginComp from "../components/UserloginComponents/LoginComp";
import SignupComp from "../components/UserloginComponents/SignupComp";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Userlogin = ({ setUser }) => {
  const [showLogin, setShowLogin] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = new URLSearchParams(location.search).get("redirect") || "/search";

  // Functions to pass to child components for toggling
  const handleShowLogin = () => setShowLogin(true);
  const handleShowSignup = () => setShowLogin(false);

  const handleSignup = async (formData) => {
    try {
      // Build FormData
      const data = new FormData();
      for (let key in formData) {
        if (key === "profilePicture" && formData[key] instanceof File) {
          data.append("profilePicture", formData[key]);
        } else {
          data.append(key, formData[key]);
        }
      }
      const res = await axios.post("http://localhost:5000/auth/signup", data, {
        withCredentials: true,
      });

      return { user: res.data.user }; 
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Signup failed");
      return false;
    }
  };

  const handleLogin = async (formData) => {
    const email = formData.email;
    const password = formData.password;
    try {
      const res = await axios.post(
        "http://localhost:5000/auth/login",
        { email, password },
        { withCredentials: true }
      );
      setUser(res.data.user);

      const role = res.data.user.role;
      {
        role == `tenant` ? navigate(redirectTo) : navigate(`/`);
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed");
    }
  };
  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center z-2">
      <div className="relative w-full h-screen">
        <img
          src="/images/loginBg.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-between px-4">
          {/* Left Section */}
          <div className="h-[90vh] w-[45vw] rounded-[30px] flex flex-col justify-between p-0">
            <Link to={"/"}>
              <h1 className="text-[#e8e8e8] text-[60px] font-medium ml-10 hover:text-[62px] duration-300 cursor-pointer">
                Zimer
              </h1>
            </Link>
            <div>
              <h2 className="text-[50px] font-medium text-[#d8d8d8] ml-10">
                {showLogin ? `Welcome Back !` : `Welcome !`}
              </h2>
            </div>
          </div>
          {showLogin ? (
            <LoginComp
              onShowSignup={handleShowSignup}
              setUser={setUser}
              onSubmit={handleLogin}
            />
          ) : (
            <SignupComp
              redirectTo={redirectTo}
              onShowLogin={handleShowLogin}
              setUser={setUser}
              onSubmit={handleSignup}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Userlogin;
