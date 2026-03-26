import React, { useEffect, useState } from "react";
import OtpInput from "./OtpInput";

const SignupForm2 = ({ setSignupStep, formData, setFormData }) => {
  const [errorMsg, setErrorMsg] = useState("");
  const [timer, setTimer] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRequestOtp = (e) => {
    e.preventDefault();
    const phoneRegex = /^[0-9]{10}$/;
    const mailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!formData.email.trim() || !formData.phone.trim()) {
      setErrorMsg("Enter a phone number and email");
      return;
    }

    if (!mailRegex.test(formData.email)) {
      setErrorMsg("Enter valid email");
      return;
    }
    if (!phoneRegex.test(formData.phone)) {
      setErrorMsg("Enter valid phone number");
      return;
    }

    // ...your validation logic...
    // If valid, send OTP (simulate with setOtpSent)
    setOtpSent(true);
    setTimer(60);
    setErrorMsg("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otpVerified) {
      setErrorMsg("Please verify OTP before continuing");
      return;
    }

    if (!formData.password.trim() || !formData.confirm_password.trim()) {
      setErrorMsg("Please enter password and confirm password");
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setErrorMsg("Passwords do not match");
      return;
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
    if (!passwordRegex.test(formData.password)) {
      setErrorMsg(
        "Password must be 8–16 characters long and include letters, numbers, and at least one special character."
      );
      return;
    }

    setSignupStep(3);
  };

  const onOtpSubmit = (otp) => {
    // Simulate OTP verification (replace with real API call)
    if (otp === "1234") {
      // Replace with your logic
      setOtpVerified(true);
      setErrorMsg("");
    } else {
      setErrorMsg("Invalid OTP");
    }
  };
  return (
    <form className="w-3/4 flex flex-col gap-6 mt-30" onSubmit={handleSubmit}>
      <div className="flex items-center bg-[#d7d7d7] rounded-full px-8 py-5">
        <input
          type="text"
          name="email"
          placeholder="Enter email*"
          className="bg-[#d7d7d7] outline-none flex-1"
          value={formData.email}
          onChange={handleInputChange}
          disabled={otpVerified}
        />
      </div>
      <div className="flex items-center bg-[#d7d7d7] rounded-full px-8 py-5">
        <input
          type="text"
          name="phone"
          placeholder="Enter Phone no.*"
          className="bg-[#d7d7d7] outline-none flex-1"
          value={formData.phone}
          onChange={handleInputChange}
          disabled={otpVerified}
        />
      </div>
      <div className=" my-5">
        <div className="flex items-center gap-2 justify-center">
          <button
            className={`text-[#d7d7d7] text-[13px] px-4 py-3 rounded-4xl cursor-pointer 
              ${
                otpVerified
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-[#1a1a1a] hover:bg-gray-900"
              }`}
            onClick={handleRequestOtp}
            disabled={otpVerified || timer > 0}
          >
            {otpVerified
              ? "Verified"
              : otpSent
              ? timer > 0
                ? `Resend in ${timer}s`
                : "Resend OTP"
              : "Request OTP"}
          </button>
          <OtpInput
            length={4}
            onOtpSubmit={onOtpSubmit}
            disabled={otpVerified}
          />
        </div>
      </div>
      <div className="flex items-center justify-between ">
        <div className="flex items-center bg-[#d7d7d7] rounded-full px-8 pr-15 py-5 flex-1 ml-2">
          <input
            type="password"
            name="password"
            placeholder="password *"
            className="bg-[#d7d7d7] outline-none flex-1"
            value={formData.password}
            onChange={handleInputChange}
            disabled={!otpVerified}
          />
        </div>
        <div className="flex items-center bg-[#d7d7d7] rounded-full px-8 pr-15 py-5 flex-1 ml-2">
          <input
            type="password"
            name="confirm_password"
            placeholder="confirm password *"
            className="bg-[#d7d7d7] outline-none flex-1"
            value={formData.confirm_password}
            onChange={handleInputChange}
            disabled={!otpVerified}
          />
        </div>
      </div>
      <div className="flex justify-between items-center text-sm text-gray-600 mb-[22px]">
        <p>* mandatory fields</p>
        <p className="text-[#D72638]">{errorMsg ? "*" + errorMsg : errorMsg}</p>
      </div>
      <div className="flex items-center justify-center ">
        <div className="bg-[#1a1a1a] text-[#e8e8e8] rounded-full py-3 px-7 font-medium text-[12px] shadow-lg hover:bg-gray-900 transition">
          2 / 3
        </div>
      </div>
      <div className="flex items-center justify-center ">
        <button
          type="submit"
          className="bg-[#1a1a1a] text-white rounded-full py-3 px-3 font-semibold text-lg shadow-lg hover:bg-gray-900 transition cursor-pointer"
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

export default SignupForm2;
