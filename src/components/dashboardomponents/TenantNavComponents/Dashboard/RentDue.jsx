// RentDue.jsx
import React, { useState } from "react";
import axios from "axios";

// Helper to get the next unpaid month
const getNextUnpaidMonth = (joinFrom, payments) => {
  if (!joinFrom) return null;

  const joinDate = new Date(joinFrom);
  if (isNaN(joinDate)) return null;

  const startMonth = joinDate.getMonth();
  const startYear = joinDate.getFullYear();

  // Get all paid months sorted chronologically
  const sortedPayments = Array.isArray(payments)
    ? [...payments]
        .filter(p => p?.paidOn)
        .sort((a, b) => new Date(a.paidOn) - new Date(b.paidOn))
    : [];

  const paidCount = sortedPayments.length;

  // Calculate the next month to be paid (sequentially from join date)
  let nextMonth = startMonth;
  let nextYear = startYear;

  for (let i = 0; i < paidCount; i++) {
    nextMonth++;
    if (nextMonth > 11) {
      nextMonth = 0;
      nextYear++;
    }
  }

  // Create date for the next unpaid month (using same day as join date)
  const nextDueDate = new Date(nextYear, nextMonth, joinDate.getDate());
  return nextDueDate.toISOString();
};

const RentDue = ({ pgData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const pgId = pgData.RID;
  const roomId = pgData.room;
  const amount = pgData.rent;
  const nextDueDate = getNextUnpaidMonth(pgData.joinFrom, pgData.payments);

  // Calculate days until due
  const calculateDaysUntilDue = () => {
    if (!nextDueDate) return 0;
    const today = new Date();
    const dueDate = new Date(nextDueDate);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = calculateDaysUntilDue();

  const handlePay = async () => {
    if (!nextDueDate) {
      setError("Unable to determine next payment month");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use the next unpaid month instead of current month
      const dueDate = new Date(nextDueDate);
      const month = dueDate.toLocaleString("en-US", {
        month: "long",
        year: "numeric"
      });

      // API call to pay rent
      const response = await axios.post(
        "http://localhost:5000/payment/initiate",
        {
          pgId,
          roomId,
          amount,
          month,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        console.log("Rent paid successfully:", response.data);
        
        // Optionally refresh the page or update the UI
        window.location.reload();
      }
    } catch (err) {
      console.error("Error paying rent:", err);
      setError(
        err.response?.data?.message || "Failed to process payment. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!nextDueDate) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <p className="text-red-600">Unable to calculate next due date</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <p className="text-[26px] font-medium text-[#5c5c5c]">Rent Due</p>
      </div>
      
      <div className="flex flex-col gap-1 text-[18px]">
        <div className="flex gap-4">
          <p>Next due</p>
          <p>{new Date(nextDueDate).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
          })}</p>
        </div>

        <div className="flex gap-4">
          <p>Amount</p>
          <p>₹{amount}</p>
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <div className="flex gap-4 my-2">
        <button
          className={`py-2 px-12 rounded-[40px] text-[18px] bg-gradient-to-r from-[#d72638] to-[#5500f8] text-white ${
            isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={handlePay}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Pay now"}
        </button>

        <button
          className={`border-3 text-[18px] font-medium py-2 px-4 rounded-[40px] ${
            daysUntilDue <= 5
              ? "border-[#d72638] text-[#d72638]"
              : "border-[#4EC840] text-[#4EC840]"
          }`}
        >
          {daysUntilDue > 0
            ? `Due in ${daysUntilDue} days`
            : daysUntilDue === 0
            ? "Due today"
            : `Overdue by ${Math.abs(daysUntilDue)} days`}
        </button>
      </div>
    </div>
  );
};

export default RentDue;