import React, { useState } from "react";
import axios from "axios"; // ✅ Import axios

// Reusable star rating component (unchanged)
const StarRating = ({ label, rating, onRatingChange }) => {
  const handleClick = (index) => onRatingChange(index + 1);

  return (
    <div className="flex items-center justify-between bg-[#e1e1e1] rounded-full p-4 my-2 w-[400px]">
      <div className="flex items-center gap-2">
        <span className="text-gray-800 text-md font-normal">{label}</span>
      </div>
      <div className="flex">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`cursor-pointer text-2xl ${
              index < rating ? "text-orange-400" : "text-gray-300"
            }`}
            onClick={() => handleClick(index)}
          >
            ★
          </span>
        ))}
      </div>
    </div>
  );
};

const LeaveReview = ({ pgId }) => {
  const [ratings, setRatings] = useState({
    community: 0,
    value: 0,
    location: 0,
    food: 0,
    landlord: 0,
  });
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRatingChange = (category, value) => {
    setRatings((prev) => ({ ...prev, [category]: value }));
    setError("");
    setSuccess("");
  };

  const handleTextChange = (e) => {
    setReviewText(e.target.value);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async () => {
    // Validation checks
    if (reviewText.trim().length === 0) {
      setError("Please write a review before submitting");
      return;
    }
    if (reviewText.trim().length < 10) {
      setError("Review must be at least 10 characters long");
      return;
    }

    const unratedCategories = Object.entries(ratings)
      .filter(([_, value]) => value === 0)
      .map(([key]) => key);

    if (unratedCategories.length > 0) {
      setError(`Please rate all categories. Missing: ${unratedCategories.join(", ")}`);
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const { data } = await axios.post(
        `http://localhost:5000/pgs/${pgId}/reviews`,
        {
          reviewText: reviewText.trim(),
          ratings: ratings,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true, // ✅ Important for cookies/session tokens
        }
      );

      setSuccess("Review submitted successfully!");
      setReviewText("");
      setRatings({
        community: 0,
        value: 0,
        location: 0,
        food: 0,
        landlord: 0,
      });

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to submit review. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex gap-4 rounded-[20px] justify-between w-full">
      {/* Left: Review Box */}
      <div className="flex flex-col flex-1 bg-[#d7d7d7] p-6 rounded-[20px]">
        <p className="text-[#5c5c5c] text-[32px] font-medium mb-4">Leave a review</p>
        <textarea
          maxLength={2000}
          value={reviewText}
          onChange={handleTextChange}
          placeholder="type here ..."
          className="w-full h-[400px] p-4 bg-[#e2e2e2] rounded-xl resize-none text-[#444] outline-none no-scrollbar"
          disabled={isSubmitting}
        />
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500 mt-4">{reviewText.length}/2000</div>
          <div className="flex flex-col items-end gap-2">
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            {success && <p className="text-green-600 text-sm font-medium mt-1">{success}</p>}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`mt-2 px-6 py-2 rounded-full self-end transition-colors ${
                isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-pink-500 hover:bg-pink-600"
              } text-white`}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>

      {/* Right: Rating Section */}
      <div className="flex flex-col bg-[#e8e8e8] p-6 rounded-[20px] shadow w-[450px]">
        <p className="text-[#5c5c5c] text-[30px] font-medium mb-4">Rate this zimer</p>
        <StarRating
          label="Community and environment"
          rating={ratings.community}
          onRatingChange={(val) => handleRatingChange("community", val)}
        />
        <StarRating
          label="Value for money"
          rating={ratings.value}
          onRatingChange={(val) => handleRatingChange("value", val)}
        />
        <StarRating
          label="Location"
          rating={ratings.location}
          onRatingChange={(val) => handleRatingChange("location", val)}
        />
        <StarRating
          label="Food"
          rating={ratings.food}
          onRatingChange={(val) => handleRatingChange("food", val)}
        />
        <StarRating
          label="Landlord"
          rating={ratings.landlord}
          onRatingChange={(val) => handleRatingChange("landlord", val)}
        />
      </div>
    </div>
  );
};

export default LeaveReview;
