const Notification = require("../models/notificationModel");
const User = require("../models/userModel");
const PG = require("../models/pgModel");

// Create announcement (landlord only)
exports.createAnnouncement = async (req, res) => {
  try {
    const { message, pgId } = req.body;
    const landlordId = req.user.id;

    // ✅ Verify landlord owns this PG
    const pg = await PG.findOne({ _id: pgId, LID: landlordId });
    if (!pg) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // ✅ Collect all tenant IDs from all rooms
    const tenantIds = pg.rooms.flatMap((room) => room.tenants);
    console.log("Tenant IDs:", tenantIds);

    if (tenantIds.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No tenants found in this PG",
        count: 0,
      });
    }

    // ✅ Prepare recipients array
    const recipients = tenantIds.map((tenantId) => ({
      recipientId: tenantId,
      isRead: false, // initially unread
    }));

    // ✅ Create announcement notification
    const notification = await Notification.create({
      type: "announcement",
      sender: landlordId,
      recipients,
      pg: pgId,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Announcement sent successfully",
      count: recipients.length,
      notification,
    });
  } catch (error) {
    console.error("Create announcement error:", error);
    res.status(500).json({ error: "Failed to create announcement" });
  }
};


// Create join request (tenant)
exports.createJoinRequest = async (req, res) => {
  try {
    const { pgId, roomNumber, message, moveInDate } = req.body;
    const tenantId = req.user.id;

    // Get PG details with landlord
    const pg = await PG.findById(pgId).populate("landlord");
    if (!pg) {
      return res.status(404).json({ error: "PG not found" });
    }

    // Get tenant details
    const tenant = await User.findById(tenantId);

    // Check if join request already exists
    const existingRequest = await Notification.findOne({
      sender: tenantId,
      pg: pgId,
      type: "join_request",
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).json({ error: "Join request already pending" });
    }

    // Create join request notification
    const notification = await Notification.create({
      type: "join_request",
      sender: tenantId,
      recipient: pg.landlord._id,
      pg: pgId,
      message: message || `${tenant.name} has sent a join request for room ${roomNumber}`,
      status: "pending",
      metadata: {
        roomNumber,
        tenantName: tenant.name,
        tenantEmail: tenant.email,
        tenantPhone: tenant.phone,
        moveInDate,
      },
    });

    res.status(201).json({
      success: true,
      message: "Join request sent to landlord",
      notification,
    });
  } catch (error) {
    console.error("Create join request error:", error);
    res.status(500).json({ error: "Failed to create join request" });
  }
};

// Create leave request (tenant)
exports.createLeaveRequest = async (req, res) => {
  try {
    const { pgId, roomNumber, reason, moveOutDate } = req.body;
    const tenantId = req.user.id;

    // Get PG details
    const pg = await PG.findById(pgId);
    if (!pg) {
      return res.status(404).json({ error: "PG not found" });
    }

    // Get tenant details
    const tenant = await User.findById(tenantId);

    // Create leave request notification
    const notification = await Notification.create({
      type: "leave_request",
      sender: tenantId,
      recipient: pg.landlord,
      pg: pgId,
      message: `${tenant.name} has requested to leave room ${roomNumber}`,
      status: "pending",
      metadata: {
        roomNumber,
        tenantName: tenant.name,
        reason,
        moveOutDate,
      },
    });

    res.status(201).json({
      success: true,
      message: "Leave request sent to landlord",
      notification,
    });
  } catch (error) {
    console.error("Create leave request error:", error);
    res.status(500).json({ error: "Failed to create leave request" });
  }
};

// Create rent payment notification
exports.createRentPaymentNotification = async (req, res) => {
  try {
    const { pgId, amount, paymentId, month, year } = req.body;
    const tenantId = req.user.id;

    // Get PG and tenant details
    const pg = await PG.findById(pgId);
    const tenant = await User.findById(tenantId);

    if (!pg) {
      return res.status(404).json({ error: "PG not found" });
    }

    // Create rent paid notification
    const notification = await Notification.create({
      type: "rent_paid",
      sender: tenantId,
      recipient: pg.landlord,
      pg: pgId,
      message: `${tenant.name} has paid rent of ₹${amount} for ${month}/${year}`,
      status: "unread",
      metadata: {
        amount,
        paymentId,
        tenantName: tenant.name,
      },
    });

    res.status(201).json({
      success: true,
      message: "Rent payment notification sent",
      notification,
    });
  } catch (error) {
    console.error("Create rent payment notification error:", error);
    res.status(500).json({ error: "Failed to create notification" });
  }
};

// Get all notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, status, pgId } = req.query;

    // Query notifications where the user is either sender or one of the recipients
    const query = {
      $or: [
        { sender: userId },
        { "recipients.recipientId": userId } // match if user is in recipients array
      ]
    };

    if (type) query.type = type;
    if (status) query.status = status;
    if (pgId) query.pg = pgId;

    const notifications = await Notification.find(query)
      .populate("sender", "firstName lastName email")
      .populate("recipients.recipientId", "firstName lastName email") // populate each recipient
      .populate("pg", "pgName")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      notifications,
      userId
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

// Update notification status (accept/reject requests)
exports.updateNotificationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    // Only recipient can update status for requests
    if (notification.recipient.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Only pending requests can be accepted/rejected
    if (
      (notification.type === "join_request" ||
        notification.type === "leave_request") &&
      notification.status !== "pending"
    ) {
      return res.status(400).json({ error: "Request already processed" });
    }

    notification.status = status;
    await notification.save();

    // If join request is accepted, add tenant to PG
    if (
      notification.type === "join_request" &&
      status === "accepted"
    ) {
      await PG.findByIdAndUpdate(notification.pg, {
        $addToSet: { tenants: notification.sender },
      });
    }

    // If leave request is accepted, remove tenant from PG
    if (
      notification.type === "leave_request" &&
      status === "accepted"
    ) {
      await PG.findByIdAndUpdate(notification.pg, {
        $pull: { tenants: notification.sender },
      });
    }

    res.json({
      success: true,
      message: `Request ${status}`,
      notification,
    });
  } catch (error) {
    console.error("Update notification status error:", error);
    res.status(500).json({ error: "Failed to update notification" });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOneAndUpdate(
      { _id: id },
      { 
        $set: { 'recipients.$[recipient].isRead': true }  
      },
      { 
        arrayFilters: [{ 'recipient.recipientId': userId }],
        new: true 
      }
    );

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    // Check if the user was actually in the recipients
    const userInRecipients = notification.recipients.some(
      (recipient) => recipient.recipientId.toString() === userId
    );
    
    if (!userInRecipients) {
      return res.status(404).json({ error: "User not found in recipients" });
    }

    res.json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({ error: "Failed to mark as read" });
  }
};

// Get unread count
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's PGs for announcements
    const userPGs = await PG.find({ tenants: userId });
    const pgIds = userPGs.map((pg) => pg._id);

    const count = await Notification.countDocuments({
      $or: [
        {
          recipient: userId,
          isRead: false,
        },
        {
          type: "announcement",
          pg: { $in: pgIds },
          "readBy.user": { $ne: userId },
        },
      ],
    });

    res.json({
      success: true,
      unreadCount: count,
    });
  } catch (error) {
    console.error("Get unread count error:", error);
    res.status(500).json({ error: "Failed to get unread count" });
  }
};

// Mark all as read
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Mark all as read error:", error);
    res.status(500).json({ error: "Failed to mark all as read" });
  }
};