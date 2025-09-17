import React, { useEffect, useState } from "react";
import axios from "axios";
import BaseNotification from "./Notification/BaseNotification";

const Notifications = () => {
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

// ✅ Mark notification as read
const markAsRead = async (id) => {
  try {
    const res = await axios.patch(
      `http://localhost:5000/notifications/${id}/read`,
      {},
      { withCredentials: true }
    );

    // ✅ Access the _id or $oid property of the ObjectId
    setNotifications((prev) =>
      prev.map((n) =>
        n._id === id
          ? {
              ...n,
              recipients: n.recipients.map((recipient) =>
                (recipient.recipientId._id || recipient.recipientId.$oid || recipient.recipientId.toString()) === userId
                  ? { ...recipient, isRead: true }
                  : recipient
              )
            }
          : n
      )
    );
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
};


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
            <p className="text-[#5c5c5c] text-[18px] mt-4">Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="text-[#5c5c5c] text-[18px] mt-4">
              No new notifications
            </p>
          ) : (
            notifications.map((notification) => {
            // Debug logging
            console.log("Notification ID:", notification._id);
            console.log("UserId:", userId);
            console.log("Recipients:", notification.recipients);
            
            const currentRecipient = notification.recipients.find(recipient => recipient.recipientId === userId);
            console.log("Current recipient:", currentRecipient);
            console.log("Is read:", currentRecipient?.isRead);

            return (
              <div
                key={notification._id}
                className="mb-4 rounded-[20px] w-full cursor-pointer bg-[#e2e2e2] relative"
                onClick={() => markAsRead(notification._id)}
              >
                <BaseNotification data={notification} />
                
                {/* Red bubble for unread notifications */}
                {!notification.recipients.find(recipient => {
                  const recipientIdStr = recipient.recipientId._id || recipient.recipientId.$oid || recipient.recipientId.toString();
                  return recipientIdStr === userId;
                })?.isRead && (
                  <div 
                    className="absolute top-[-1px] right-[0px] w-5 h-5 rounded-full "
                    style={{ backgroundColor: '#d72638' }}
                  />
                )}
              </div>
            )
          })
                    )}
        </div>

        {/* bottom gradient */}
        <div className="absolute bottom-0 left-0 w-full h-10 pointer-events-none bg-gradient-to-t from-[#d9d9d9] via-[#d9d9d9]/80 to-transparent"></div>
      </div>
    </div>
  );
};

export default Notifications;
