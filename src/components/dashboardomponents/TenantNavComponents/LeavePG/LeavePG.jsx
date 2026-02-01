import React, { useState, useEffect } from "react";
import axios from "axios";
import Checkbox from "./Checkbox";

// Reusable star rating component
const StarRating = ({ label, rating, onRatingChange }) => {
  const handleClick = (index) => {
    onRatingChange(index + 1);
  };

  return (
    <div className="flex items-center justify-between rounded-full p-4 my-2 w-[400px]">
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

const LeavePG = ({ pgId, roomNumber, currentUserId }) => {
  const [pgName, setPgName] = useState("Sunlight PG");
  
  const [ratings, setRatings] = useState({
    community: 0,
    value: 0,
    location: 0,
    food: 0,
    landlord: 0,
  });

  const [reviewText, setReviewText] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState(false);
  const [rentPaid, setRentPaid] = useState(false);
  const [existingReviewId, setExistingReviewId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch existing review on component mount
  useEffect(() => {
    if (pgId && currentUserId) {
      fetchExistingReview();
    }
  }, [pgId, currentUserId]);

  const fetchExistingReview = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/pgs/${pgId}/reviews`,
        { withCredentials: true }
      );

      // Set PG name from response
      if (response.data.pgName) {
        setPgName(response.data.pgName);
      }

      // Find if current user has already reviewed
      const userReview = response.data.reviews.find(
        (review) => review.userId === currentUserId || review.userId._id === currentUserId
      );

      if (userReview) {
        // User has already reviewed - populate the form
        setIsEditMode(true);
        setExistingReviewId(userReview._id);
        setRatings(userReview.ratings);
        setReviewText(userReview.reviewText);
        console.log("Existing review found - Edit mode enabled");
      } else {
        console.log("No existing review found - Create mode");
      }
    } catch (err) {
      console.error("Error fetching review:", err);
      // If error (404 or no reviews), it means user hasn't reviewed yet - that's okay
      setError("");
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (category, value) => {
    setRatings((prev) => ({ ...prev, [category]: value }));
  };

  const handleTextChange = (e) => {
    setReviewText(e.target.value);
  };

  const validateForm = () => {
    // Check checkboxes
    if (!securityDeposit || !rentPaid) {
      setError("Please confirm security deposit collection and rent payment");
      return false;
    }

    // Check review text length
    if (reviewText.trim().length < 10) {
      setError("Review must be at least 10 characters long");
      return false;
    }

    if (reviewText.length > 2000) {
      setError("Review must not exceed 2000 characters");
      return false;
    }

    // Check all ratings are provided
    const ratingValues = Object.values(ratings);
    if (ratingValues.some((rating) => rating === 0)) {
      setError("Please provide all ratings (1-5 stars for each category)");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      // Step 1: Submit or Update Review
      if (isEditMode && existingReviewId) {
        // Update existing review
        console.log("Updating existing review...");
        await axios.put(
          `http://localhost:5000/pgs/${pgId}/reviews/${existingReviewId}`,
          {
            reviewText: reviewText.trim(),
            ratings,
          },
          { withCredentials: true }
        );
        console.log("Review updated successfully");
      } else {
        // Create new review
        console.log("Creating new review...");
        await axios.post(
          `http://localhost:5000/pgs/${pgId}/reviews`,
          {
            reviewText: reviewText.trim(),
            ratings,
          },
          { withCredentials: true }
        );
        console.log("Review created successfully");
      }

      // Step 2: Create leave request notification
      console.log("Sending leave request...");
      const leaveRequestResponse = await axios.post(
        "http://localhost:5000/notifications/leave-request",
        {
          pgId,
          roomNumber,
          reason: reviewText.substring(0, 100), // Use first 100 chars of review as reason
          moveOutDate: new Date().toISOString(),
        },
        { withCredentials: true }
      );

      if (leaveRequestResponse.data.success) {
        alert(`${isEditMode ? 'Review updated' : 'Review submitted'} and leave request sent successfully! Waiting for landlord approval.`);
        window.location.href = '/';
      }
    } catch (err) {
      console.error("Error submitting leave request:", err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || "Failed to submit leave request. Please try again.";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center p-8 bg-[#d9d9d9] rounded-[20px]">
        <p className="text-lg text-gray-600">Loading your information...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4 bg-[#d9d9d9] p-4 rounded-[20px]">
      <div className="p-2">
        <p className="text-[#d72638] text-[34px] font-medium">
          Leaving {pgName}?
        </p>
        {isEditMode && (
          <p className="text-sm text-gray-600 mt-2">
             You have already reviewed this PG. You can update your review below before leaving.
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mx-2">
          ⚠️ {error}
        </div>
      )}

      <div className="flex gap-8 pl-2">
        <div className="flex items-center gap-4">
          <p className="text-[18px]">
            Security deposit collected?{" "}
            <span className="text-[#d72638]">*</span>
          </p>
          <div className="pb-4">
            <Checkbox 
              checked={securityDeposit}
              onChange={(checked) => setSecurityDeposit(checked)}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-[18px]">
            Complete rent paid? <span className="text-[#d72638]">*</span>
          </p>
          <div className="pb-4">
            <Checkbox 
              checked={rentPaid}
              onChange={(checked) => setRentPaid(checked)}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 bg-[#d9d9d9] rounded-[20px] p-4 justify-between w-full">
        {/* Left: Rating Section */}
        <div className="flex flex-col bg-[#e1e1e1] p-6 rounded-[20px] shadow w-[450px]">
          <div className="w-full flex justify-center text-[22px] font-normal text-[#5c5c5c] mb-[20px]">
            <p>
              Provide Rating for {pgName}{" "}
              <span className="text-[#d72638]">*</span>
            </p>
          </div>

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

        {/* Right: Review Text Section */}
        <div className="flex flex-col flex-1 rounded-[20px]">
          <textarea
            maxLength={2000}
            value={reviewText}
            onChange={handleTextChange}
            placeholder={`Tell us about your experience at ${pgName}...`}
            className="w-full h-[450px] p-4 bg-[#e1e1e1] rounded-xl resize-none text-[#444] outline-none no-scrollbar"
          />
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              {reviewText.length}/2000 characters
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`bg-[#d72638] text-white px-6 py-3 rounded-[10px] self-end transition-all ${
                submitting
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:bg-[#b81f2d] hover:shadow-lg"
              }`}
            >
              {submitting
                ? "Submitting..."
                : isEditMode
                ? "Update Review & Leave"
                : "Submit Review & Leave"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeavePG;