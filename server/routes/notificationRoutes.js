const express = require("express");
const router = express.Router();
const {
  createAnnouncement,
  createJoinRequest,
  createLeaveRequest,
  createRentPaymentNotification,
  getNotifications,
  updateNotificationStatus,
  markAsRead,
  getUnreadCount,
  markAllAsRead,
  acceptJoinRequest,
} = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");

// All routes require authentication
router.use(authMiddleware);

// Create notifications
router.post("/announcement", createAnnouncement);
router.post("/leave-request", createLeaveRequest);
router.post("/rent-paid", createRentPaymentNotification);
router.post('/join-request/:notificationId/accept', authMiddleware, acceptJoinRequest);
router.post('/join-request', authMiddleware, createJoinRequest);
router.patch('/:notificationId/status', authMiddleware, updateNotificationStatus);

// Get notifications
router.get("/", getNotifications);
router.get("/unread-count", getUnreadCount);

// Update notifications
router.patch("/:id/read",authMiddleware, markAsRead);
router.patch("/mark-all-read", markAllAsRead);

module.exports = router;