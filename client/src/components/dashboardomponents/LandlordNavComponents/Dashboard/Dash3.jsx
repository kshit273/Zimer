import React, { useState, useEffect } from "react";
import axios from "axios";
import JoinReq from "../../TenantNavComponents/Dashboard/Notification/JoinReq";
import BaseNotification from "../../TenantNavComponents/Dashboard/Notification/BaseNotification";
import LeaveReq from "../../TenantNavComponents/Dashboard/Notification/LeaveReq";
import RentPaidNotification from "../../TenantNavComponents/Dashboard/Notification/RentPaidNotification";

const Dash3 = ({ formData, pgId, setToast }) => {
  const [announcement, setAnnouncement] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/notifications?pgId=${pgId}`,
        { withCredentials: true }
      );
      setNotifications(response.data.notifications);
     
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pgId) {
      fetchNotifications();
      // Refresh every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [pgId]);

  // Send announcement
  const handleSendAnnouncement = async () => {
    if (!announcement.trim()) return;

    try {
      setSending(true);
      await axios.post(
        "http://localhost:5000/notifications/announcement",
        {
          message: announcement,
          pgId: pgId,
        },
        { withCredentials: true }
      );
      setAnnouncement("");
      fetchNotifications(); 
    } catch (error) {
      console.error("Error sending announcement:", error);
    } finally {
      setSending(false);
    }
  };

  // Handle accept/reject for join requests
  const handleJoinRequestAction = async (notificationId, action) => {
    try {
      const endpoint = action === "accepted" 
        ? `http://localhost:5000/notifications/join-request/${notificationId}/accept`
        : `http://localhost:5000/notifications/${notificationId}/status`;

      if (action === "accepted") {
        // Use the special accept endpoint that handles room joining
        await axios.post(endpoint, {}, { withCredentials: true });
      } else {
        // Use the regular status update for rejection
        await axios.patch(endpoint, { status: action }, { withCredentials: true });
      }
      
      fetchNotifications(); // Refresh after action
    } catch (error) {
      console.error("Error updating join request:", error);
      setToast(error.response?.data?.error || `Failed to ${action} request`,'error');
    }
  };

  
  // Handle accept/reject for leave requests
  const handleLeaveRequestAction = async (notificationId, action) => {
    try {
      const endpoint = action === "accepted" 
        ? `http://localhost:5000/notifications/leave-request/${notificationId}/accept`
        : `http://localhost:5000/notifications/${notificationId}/status`;

      if (action === "accepted") {
        // Use the special accept endpoint that handles tenant removal
        await axios.post(endpoint, {}, { withCredentials: true });
      } else {
        // Use the regular status update for rejection
        await axios.patch(endpoint, { status: action }, { withCredentials: true });
      }
      
      fetchNotifications(); // Refresh after action
    } catch (error) {
      console.error("Error updating leave request:", error);
      setToast(error.response?.data?.error || `Failed to ${action} request`,'error');
    }
  };

  // Handle accept/reject for other requests (leave requests, etc.)
  // const handleRequestAction = async (notificationId, action) => {
  //   try {
  //     console.log(notificationId);
  //     await axios.patch(
  //       `http://localhost:5000/notifications/${notificationId}/status`,
  //       {
  //         status: action,
  //       },
  //       { withCredentials: true }
  //     );
  //     fetchNotifications(); // Refresh after action
  //   } catch (error) {
  //     console.error("Error updating notification:", error);
  //     setToast(`Failed to ${action} request`);
  //   }
  // };

  // Render notification based on type
  const renderNotification = (notification, i) => {
    switch (notification.type) {
      case "join_request":
        return (
          <JoinReq
            key={notification._id}
            data={notification}
            formData={formData}
            onAccept={() => handleJoinRequestAction(notification._id, "accepted")}
            onReject={() => handleJoinRequestAction(notification._id, "rejected")}
          />
        );
      case "leave_request":
        return (
          <LeaveReq
            key={notification._id}
            data={notification}
            formData={formData}
            onAccept={() => handleLeaveRequestAction(notification._id, "accepted")}
            onReject={() => handleLeaveRequestAction(notification._id, "rejected")}
          />
        );
      case "rent_paid":
        return (
          <RentPaidNotification key={notification._id} data={notification} />
        );
      case "announcement":
        return (
          <div
            key={notification._id}
            className={`mb-4 rounded-[20px] w-full cursor-pointer `}
          >
            <BaseNotification data={notification} id={formData._id}/>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#d9d9d9] rounded-[35px] p-6 my-6">
      <div className="">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[24px] font-medium text-[#1a1a1a]">
            Notifications
          </h2>
        </div>
      </div>

      {/* Announcement Section - Only for Landlord */}
      <div className="bg-[#e2e2e2] rounded-[20px] p-5 mb-6 shadow">
        <textarea
          className="w-full min-h-[120px] p-4 bg-[#d9d9d9] rounded-[15px] text-[16px] resize-none focus:outline-none focus:ring-2 focus:ring-[#ff0058]/20"
          placeholder="Type your announcement here..."
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSendAnnouncement}
            disabled={sending || !announcement.trim()}
            className="bg-gradient-to-r from-[#ff0058] to-[#d72638] text-white text-[16px] font-medium px-10 py-2 rounded-full shadow transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>

      {/* Notifications List */}
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
            <div className="w-full flex flex-col gap-2">
              {notifications.map((notification) =>
                renderNotification(notification)
              )}
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 w-full h-10 pointer-events-none bg-gradient-to-t from-[#d9d9d9] via-[#d9d9d9]/80 to-transparent"></div>
      </div>
    </div>
  );
};

export default Dash3;