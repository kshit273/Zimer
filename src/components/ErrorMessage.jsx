import React, { useEffect } from "react";

const ErrorMessage = ({ message, setError }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setError(null); // Clear the error after 5 seconds
      }, 5000);

      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [message, setError]);

  if (!message) return null;

  return (
    <div
      className="fixed bottom-4 right-7 bg-red-500 text-white text-[18px] px-6 py-4 rounded-[10px] shadow-lg z-50"
      style={{ minWidth: "300px" }}
    >
      {message}
    </div>
  );
};

export default ErrorMessage;