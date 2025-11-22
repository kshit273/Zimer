import { useState, useEffect } from "react";
import RoomReviewCard from "./RoomReviewCard";
import axios from "axios";

const PgReview = ({ RID, pgData }) => {
  const [showAll, setShowAll] = useState(false);
  const [usersData, setUsersData] = useState({});
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Get reviews from pgData
  const reviews = pgData?.reviews || [];
  const visibleReviews = showAll ? reviews : reviews.slice(0, 4);

  // Fetch all reviewers' data in a single batch call
  useEffect(() => {
    const fetchUsersData = async () => {
      if (reviews.length === 0) return;

      // Extract unique user IDs from reviews
      const userIds = [...new Set(reviews.map((review) => review.userId).filter(Boolean))];

      if (userIds.length === 0) return;

      try {
        setLoadingUsers(true);
        const response = await axios.post(
          "http://localhost:5000/auth/tenants-batch",
          { tenantIds: userIds },
          { withCredentials: true }
        );

        if (response.data.success) {
          // Create a map of userId -> userData for quick lookup
          const usersMap = {};
          response.data.tenants.forEach((tenant) => {
            usersMap[tenant._id] = tenant;
          });
          setUsersData(usersMap);
        }
      } catch (err) {
        console.error("Error fetching users data:", err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsersData();
  }, [reviews]);

  // Use averageRatings from pgData
  const communityRating = pgData?.averageRatings?.community || 0;
  const valueRating = pgData?.averageRatings?.value || 0;
  const locationRating = pgData?.averageRatings?.location || 0;
  const foodRating = pgData?.averageRatings?.food || 0;
  const landlordRating = pgData?.averageRatings?.landlord || 0;
  const overallRating = pgData?.averageRatings?.overall || 0;

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const reviewDate = new Date(dateString);
    const diffInMs = now - reviewDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "today";
    if (diffInDays === 1) return "yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return weeks === 1 ? "a week ago" : `${weeks} weeks ago`;
    }
    if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return months === 1 ? "a month ago" : `${months} months ago`;
    }

    const years = Math.floor(diffInDays / 365);
    return years === 1 ? "a year ago" : `${years} years ago`;
  };

  if (!pgData || reviews.length === 0) {
    return (
      <div className="w-full flex flex-col items-center pt-[100px]">
        <div className="head">
          <p className="text-[45px] font-medium mb-[30px]">
            What others say about this place
          </p>
        </div>
        <p className="text-xl text-gray-500">No reviews yet for this PG.</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center pt-[100px]">
      <div className="head">
        <p className="text-[45px] font-medium mb-[30px]">
          What others say about this place
        </p>
      </div>
      <div className="pict flex gap-[30px] items-center">
        <div className="finRating flex flex-col items-center justify-center gap-[10px] ">
          <p className="text-[20px] text-[#464646] ">Overall rating</p>
          <div className="text-[#464646] text-[50px] font-medium">
            {overallRating}
          </div>
          <img src="/images/finRating.png" alt="" className="w-[100px]" />
        </div>

        <div className="h-[80px] w-[1px] bg-[#c4c4c4]"></div>

        <div className="env flex flex-col items-center justify-center gap-[10px]">
          <p className="text-[20px] text-[#464646]">Community and environment</p>
          <img src="/images/group.png" alt="" className="h-[60px] w-[60px]" />
          <div className="text-[#464646] text-[20px] font-medium">
            {communityRating}
          </div>
        </div>

        <div className="h-[80px] w-[1px] bg-[#c4c4c4]"></div>

        <div className="val flex flex-col items-center justify-center gap-[10px]">
          <p className="text-[20px] text-[#464646]">Value for money</p>
          <img src="/images/bar-chart.png" alt="" className="h-[60px] w-[60px]" />
          <div className="text-[#464646] text-[20px] font-medium">
            {valueRating}
          </div>
        </div>

        <div className="h-[80px] w-[1px] bg-[#c4c4c4]"></div>

        <div className="location flex flex-col items-center justify-center gap-[10px]">
          <p className="text-[20px] text-[#464646]">Location</p>
          <img src="/images/finLocation.png" alt="" className="h-[60px] w-[60px]" />
          <div className="text-[#464646] text-[20px] font-medium">
            {locationRating}
          </div>
        </div>

        <div className="h-[80px] w-[1px] bg-[#c4c4c4]"></div>

        <div className="food flex flex-col items-center justify-center gap-[10px]">
          <p className="text-[20px] text-[#464646]">Food</p>
          <img src="/images/spatula.png" alt="" className="h-[60px] w-[60px]" />
          <div className="text-[#464646] text-[20px] font-medium">
            {foodRating}
          </div>
        </div>

        <div className="h-[80px] w-[1px] bg-[#c4c4c4]"></div>

        <div className="landlord flex flex-col items-center justify-center gap-[10px]">
          <p className="text-[20px] text-[#464646]">Landlord</p>
          <img src="/images/finUser.png" alt="" className="h-[60px] w-[60px]" />
          <div className="text-[#464646] text-[20px] font-medium">
            {landlordRating}
          </div>
        </div>
      </div>
      <div className="cards grid grid-cols-3 gap-x-[20px] gap-y-[20px] auto-rows-auto mt-[30px]">
        {visibleReviews.map((review, idx) => {
          const userData = usersData[review.userId] || null;
          return (
            <RoomReviewCard
              key={review._id || idx}
              userData={userData}
              date={getTimeAgo(review.createdAt)}
              rating={review.overallRating}
              review={review.reviewText}
            />
          );
        })}
      </div>
      {/* {showAll ? null : (
        <div className="relative bottom-[60px] w-full h-[60px] bg-gradient-to-b from-transparent to-[#e8e8e8] pointer-events-none"></div>
      )} */}
      <div className="flex items-start">
        {reviews.length > 4 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-[20px] px-6 py-3 bg-[#d7d7d7] text-[#1a1a1a] text-[18px] cursor-pointer font-medium rounded-[10px] hover:bg-[#d72638] hover:text-[#e3e3e3] transition-all duration-220"
          >
            {showAll ? "Show Less" : "Show All"}
          </button>
        )}
      </div>
    </div>
  );
};

export default PgReview;