import React, { useState } from "react";
import axios from "axios";

const LoginComp = ({ onSubmit, onShowSignup, setUser }) => {
  // local state for inputs
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // forgot password states
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [fpStep, setFpStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [fpEmail, setFpEmail] = useState("");
  const [fpOtp, setFpOtp] = useState("");
  const [fpNewPassword, setFpNewPassword] = useState("");
  const [fpConfirmPassword, setFpConfirmPassword] = useState("");
  const [fpError, setFpError] = useState("");
  const [fpSuccess, setFpSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      onSubmit(formData);
      return true;
    } catch {
      console.error("Error during signup submission");
    }
  };

  // handle forgot password click
  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    setForgotPasswordMode(true);
    setFpStep(1);
    setFpError("");
    setFpSuccess("");
  };

  // Step 1: Submit email to check if exists and send OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setFpError("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/auth/forgot-password/send-otp", {
        email: fpEmail,
      });

      if (response.data.success) {
        setFpSuccess("OTP sent to your registered mobile number via WhatsApp");
        setFpStep(2);
      }
    } catch (error) {
      setFpError(
        error.response?.data?.message || "Email not found in our database"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setFpError("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/auth/forgot-password/verify-otp", {
        email: fpEmail,
        otp: fpOtp,
      });

      if (response.data.success) {
        setFpSuccess("OTP verified successfully");
        setFpStep(3);
      }
    } catch (error) {
      setFpError(error.response?.data?.message || "Invalid OTP. Please try again");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset password
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setFpError("");

    // Validate passwords match
    if (fpNewPassword !== fpConfirmPassword) {
      setFpError("Passwords do not match");
      return;
    }

    // Validate password strength (optional)
    if (fpNewPassword.length < 6) {
      setFpError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000//auth/forgot-password/reset", {
        email: fpEmail,
        newPassword: fpNewPassword,
      });

      if (response.data.success) {
        setFpSuccess("Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          setForgotPasswordMode(false);
          setFpStep(1);
          setFpEmail("");
          setFpOtp("");
          setFpNewPassword("");
          setFpConfirmPassword("");
        }, 2000);
      }
    } catch (error) {
      setFpError(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel forgot password flow
  const handleCancelForgotPassword = () => {
    setForgotPasswordMode(false);
    setFpStep(1);
    setFpEmail("");
    setFpOtp("");
    setFpNewPassword("");
    setFpConfirmPassword("");
    setFpError("");
    setFpSuccess("");
  };

  return (
    <div className="bg-[#e8e8e8] h-[97vh] w-[40vw] rounded-[30px] ml-[-40px] z-10">
      <div className="flex flex-col shadow-xl h-full">
        <div className="ml-[50px]">
          <h2 className="text-[60px] font-semibold my-30">
            {forgotPasswordMode ? "Reset Password." : "Login."}
          </h2>
        </div>

        {!forgotPasswordMode ? (
          // Normal Login Form
          <div className="flex items-center justify-center mt-[50px]">
            <form className="w-3/4 flex flex-col gap-6" onSubmit={handleSubmit}>
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
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email"
                  className="bg-[#d7d7d7] outline-none flex-1"
                />
              </div>
              <div className="flex items-center bg-[#d7d7d7] rounded-full px-4 py-5 mb-[10px]">
                <span className="material-icons text-gray-500 mr-4 ml-2">
                  <img
                    src="./images/padlock.png"
                    alt=""
                    className="h-[26px] w-[26px]"
                  />
                </span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="password"
                  className="bg-transparent outline-none flex-1"
                />
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600 mb-[20px]">
                <a
                  href="#"
                  className="underline cursor-pointer"
                  onClick={handleForgotPasswordClick}
                >
                  Forgot Password ?
                </a>
              </div>
              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="bg-[#1a1a1a] text-white rounded-full py-3 px-20 font-semibold text-lg shadow-lg hover:bg-gray-900 transition cursor-pointer"
                >
                  Login
                </button>
              </div>
              <div className="text-center text-sm mt-2">
                Don&apos;t have an account?{" "}
                <a
                  href="#"
                  className="underline"
                  onClick={(e) => {
                    e.preventDefault();
                    onShowSignup();
                  }}
                >
                  Signup
                </a>
              </div>
            </form>
          </div>
        ) : (
          // Forgot Password Flow
          <div className="flex items-center justify-center mt-[50px]">
            <div className="w-3/4 flex flex-col gap-6">
              {/* Step 1: Enter Email */}
              {fpStep === 1 && (
                <form onSubmit={handleEmailSubmit} className="flex flex-col gap-6">
                  <p className="text-sm text-gray-600">
                    Enter your email to receive an OTP on your registered mobile number
                  </p>
                  <div className="flex items-center bg-[#d7d7d7] rounded-full px-4 py-5">
                    <span className="material-icons text-gray-500 mr-4 ml-2">
                      <img
                        src="./images/usericon.png"
                        alt=""
                        className="h-[26px] w-[26px]"
                      />
                    </span>
                    <input
                      type="email"
                      value={fpEmail}
                      onChange={(e) => setFpEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="bg-[#d7d7d7] outline-none flex-1"
                      required
                    />
                  </div>
                  {fpError && <p className="text-red-500 text-sm">{fpError}</p>}
                  {fpSuccess && <p className="text-green-600 text-sm">{fpSuccess}</p>}
                  <div className="flex items-center justify-center gap-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-[#1a1a1a] text-white rounded-full py-3 px-16 font-semibold text-lg shadow-lg hover:bg-gray-900 transition cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? "Sending..." : "Send OTP"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelForgotPassword}
                      className="bg-gray-400 text-white rounded-full py-3 px-16 font-semibold text-lg shadow-lg hover:bg-gray-500 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Step 2: Enter OTP */}
              {fpStep === 2 && (
                <form onSubmit={handleOtpSubmit} className="flex flex-col gap-6">
                  <p className="text-sm text-gray-600">
                    Enter the OTP sent to your mobile number via WhatsApp
                  </p>
                  <div className="flex items-center bg-[#d7d7d7] rounded-full px-4 py-5">
                    <span className="material-icons text-gray-500 mr-4 ml-2">
                      <img
                        src="./images/padlock.png"
                        alt=""
                        className="h-[26px] w-[26px]"
                      />
                    </span>
                    <input
                      type="text"
                      value={fpOtp}
                      onChange={(e) => setFpOtp(e.target.value)}
                      placeholder="Enter OTP"
                      className="bg-[#d7d7d7] outline-none flex-1"
                      required
                      maxLength={6}
                    />
                  </div>
                  {fpError && <p className="text-red-500 text-sm">{fpError}</p>}
                  {fpSuccess && <p className="text-green-600 text-sm">{fpSuccess}</p>}
                  <div className="flex items-center justify-center gap-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-[#1a1a1a] text-white rounded-full py-3 px-16 font-semibold text-lg shadow-lg hover:bg-gray-900 transition cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? "Verifying..." : "Verify OTP"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelForgotPassword}
                      className="bg-gray-400 text-white rounded-full py-3 px-16 font-semibold text-lg shadow-lg hover:bg-gray-500 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Reset Password */}
              {fpStep === 3 && (
                <form onSubmit={handlePasswordReset} className="flex flex-col gap-6">
                  <p className="text-sm text-gray-600">Enter your new password</p>
                  <div className="flex items-center bg-[#d7d7d7] rounded-full px-4 py-5">
                    <span className="material-icons text-gray-500 mr-4 ml-2">
                      <img
                        src="./images/padlock.png"
                        alt=""
                        className="h-[26px] w-[26px]"
                      />
                    </span>
                    <input
                      type="password"
                      value={fpNewPassword}
                      onChange={(e) => setFpNewPassword(e.target.value)}
                      placeholder="New Password"
                      className="bg-[#d7d7d7] outline-none flex-1"
                      required
                    />
                  </div>
                  <div className="flex items-center bg-[#d7d7d7] rounded-full px-4 py-5">
                    <span className="material-icons text-gray-500 mr-4 ml-2">
                      <img
                        src="./images/padlock.png"
                        alt=""
                        className="h-[26px] w-[26px]"
                      />
                    </span>
                    <input
                      type="password"
                      value={fpConfirmPassword}
                      onChange={(e) => setFpConfirmPassword(e.target.value)}
                      placeholder="Confirm Password"
                      className="bg-[#d7d7d7] outline-none flex-1"
                      required
                    />
                  </div>
                  {fpError && <p className="text-red-500 text-sm">{fpError}</p>}
                  {fpSuccess && <p className="text-green-600 text-sm">{fpSuccess}</p>}
                  <div className="flex items-center justify-center gap-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-[#1a1a1a] text-white rounded-full py-3 px-16 font-semibold text-lg shadow-lg hover:bg-gray-900 transition cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? "Resetting..." : "Reset Password"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelForgotPassword}
                      className="bg-gray-400 text-white rounded-full py-3 px-16 font-semibold text-lg shadow-lg hover:bg-gray-500 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginComp;