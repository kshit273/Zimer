import React, { useEffect, useState } from "react";

const Toast = ({ message, type = "success", onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Reset visibility when message changes
    setIsVisible(true);

    const timer = setTimeout(() => {
      setIsVisible(false);
      // Call onClose after fade-out animation if provided
      setTimeout(() => {
        if (onClose) onClose();
      }, 300); // Wait for animation to complete
    }, 5000);

    return () => clearTimeout(timer);
  }, [message, onClose]); // Re-run effect when message changes

  if (!isVisible) return null;

  const bgColor = type === "success" ? "bg-[#49C800]" : "bg-[#d72638]";
  const icon = type === "success" ? "✓" : "✕";

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-slideIn">
      <div className={`${bgColor} text-white px-6 py-4 rounded-[12px] shadow-lg flex items-center gap-3 min-w-[300px]`}>
        <span className="text-[24px] font-bold">{icon}</span>
        <p className="text-[16px] font-medium flex-1">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => {
              if (onClose) onClose();
            }, 300);
          }}
          className="text-white hover:opacity-70 transition-opacity text-[20px] font-bold ml-2"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;