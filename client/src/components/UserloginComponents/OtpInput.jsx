import React, { useRef, useState } from "react";

const OtpInput = ({ length = 4, onOtpSubmit = () => {}, disabled = false }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input if current field is filled
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }

    // Submit trigger
    const combinedOtp = newOtp.join("");
    if (combinedOtp.length === length) onOtpSubmit(combinedOtp);
  };

  return (
    <div>
      {otp.map((value, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          value={value}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !otp[index] && index > 0) {
              inputRefs.current[index - 1].focus();
            }
          }}
          ref={(el) => (inputRefs.current[index] = el)}
          className="w-12 h-12 text-center rounded bg-[#e1e1e1] mx-1"
          disabled={disabled}
        />
      ))}
    </div>
  );
};

export default OtpInput;
