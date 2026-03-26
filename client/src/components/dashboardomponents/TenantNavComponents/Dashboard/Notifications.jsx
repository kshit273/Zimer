import React, { useEffect, useState } from "react";
import axios from "axios";
import BaseNotification from "./Notification/BaseNotification";

const Notifications = ({formData}) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // ✅ Fetch notifications
  const fetchNotifications = async (filters = {}) => {
    try {
      const query = new URLSearchParams(filters).toString();

      const res = await axios.get(`http://localhost:5000/notifications?${query}`, {
        withCredentials: true, // 🔑 auth with cookies
      });

      if (res.data.success) {
        setNotifications(res.data.notifications);
        setUserId(res.data.userId);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(); // fetch all on mount
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="h-full p-4">
      <div>
        <p className="text-[24px] text-[#5c5c5c] font-medium mb-2">
          Notifications
        </p>
      </div>

      <div className="relative">
        <div className="h-[520px] overflow-y-auto no-scrollbar flex flex-col items-center justify-start">
          {loading ? (
            <div className="w-full">
              <div className="w-full h-[100px] bg-[#e2e2e2] mb-4 rounded-[20px] animate-pulse"></div>
              <div className="w-full h-[100px] bg-[#e2e2e2] mb-4 rounded-[20px] animate-pulse"></div>
              <div className="w-full h-[100px] bg-[#e2e2e2] mb-4 rounded-[20px] animate-pulse"></div>
              <div className="w-full h-[100px] bg-[#e2e2e2] mb-4 rounded-[20px] animate-pulse"></div>
            </div>
          ) : notifications.length === 0 ? (
            <p className="text-[#5c5c5c] text-[18px] mt-4">
              No new notifications
            </p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className="mb-4 rounded-[20px] w-full cursor-pointer bg-[#e2e2e2] relative"
              >
                <BaseNotification id={formData.id} data={notification} />
              </div>
            ))
                    )}
        </div>

        {/* bottom gradient */}
        <div className="absolute bottom-0 left-0 w-full h-10 pointer-events-none bg-gradient-to-t from-[#d9d9d9] via-[#d9d9d9]/80 to-transparent"></div>
      </div>
    </div>
  );
};

export default Notifications;
