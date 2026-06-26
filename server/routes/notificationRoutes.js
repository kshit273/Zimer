const express = require("express");
const router = express.Router();
const {
  createAnnouncement,
  createJoinRequest,
  createLeaveRequest,
  createRentPaymentNotification,
  getNotifications,
  updateNotificationStatus,
  acceptJoinRequest,
  acceptLeaveRequest,
  acceptKickRequest,
  createKickRequest,
  getKickRequests, 
} = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");

// All routes require authentication
router.use(authMiddleware);

// Create notifications
router.post("/announcement", createAnnouncement);
router.post("/leave-request", createLeaveRequest);
router.post("/rent-paid", createRentPaymentNotification);
router.post('/join-request/:notificationId/accept', authMiddleware, acceptJoinRequest);
router.post('/leave-request/:notificationId/accept', authMiddleware, acceptLeaveRequest);
router.post('/join-request', authMiddleware, createJoinRequest);
router.patch('/:notificationId/status', authMiddleware, updateNotificationStatus);
router.post("/kick-request", authMiddleware, createKickRequest);
router.get("/kick-request", authMiddleware, getKickRequests);
router.put("/kick-request/:notificationId/accept", authMiddleware, acceptKickRequest);
// router.post("/pg-edit", authMiddleware, pgEditNotification);
// router.post("/report-pg", authMiddleware, pgReportNotification);

// Get notifications
router.get("/", getNotifications);

module.exports = router;