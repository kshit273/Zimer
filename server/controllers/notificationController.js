const Notification = require("../models/notificationModel");
const Tenant = require("../models/tenantModel");
const PG = require("../models/pgModel");
const Invite = require("../models/inviteModel");

// Create announcement (landlord only)
exports.createAnnouncement = async (req, res) => {
  try {
    const { message, pgId } = req.body;
    const landlordId = req.user.id;

    // ✅ Verify landlord owns this PG - find by RID
    const pg = await PG.findOne({ RID: pgId, LID: landlordId });
    if (!pg) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // ✅ Collect all tenant IDs from all rooms
    const tenantIds = pg.rooms.flatMap((room) => room.tenants.map(tenant => tenant.tenantId));
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
      isRead: false,
    }));

    // ✅ Create announcement notification - use RID instead of _id
    const notification = await Notification.create({
      type: "announcement",
      sender: landlordId,
      recipients,
      pg: pg.RID, // Changed from pgId to pg.RID
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

// createJoinRequest 
exports.createJoinRequest = async (req, res) => {
  try {
    const { pgId, message, moveInDate, roomId, token } = req.body;
    const tenantId = req.user.id;

    // Validate the invite token
    const invite = await Invite.findOne({ 
      roomId, 
      token, 
      expiresAt: { $gt: Date.now() },
      revoked: false 
    });
    
    if (!invite) {
      return res.status(400).json({ error: "Invalid or expired invitation" });
    }

    // Get PG details with landlord - find by RID
    const pg = await PG.findOne({ RID: pgId }).populate("LID");
    if (!pg) {
      return res.status(404).json({ error: "PG not found" });
    }

    // Get room details
    const room = pg.rooms.find(r => r.roomId === roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Check if tenant is already in this room
    if (room.tenants.includes(tenantId)) {
      return res.status(400).json({ error: "You are already in this room" });
    }

    // Get tenant details
    const tenant = await Tenant.findById(tenantId);

    // Check if join request already exists for this specific room
    const existingRequest = await Notification.findOne({
      sender: tenantId,
      pg: pgId, // pgId is already RID
      type: "join_request",
      status: "pending",
      "metadata.roomId": roomId,
    });

    if (existingRequest) {
      return res.status(400).json({ error: "Join request already pending for this room" });
    }

    // Create join request notification - use RID
    const notification = await Notification.create({
      type: "join_request",
      sender: tenantId,
      recipients: [{
        recipientId: pg.LID._id,
        isRead: false
      }],
      pg: pg.RID, // Use RID instead of _id
      message: message || `${tenant.firstName} ${tenant.lastName} has sent a join request for room ${roomId}`,
      status: "pending",
      metadata: {
        roomId: roomId,
        tenantName: `${tenant.firstName} ${tenant.lastName}`,
        tenantEmail: tenant.email,
        tenantPhone: tenant.phone,
        moveInDate,
        inviteToken: token,
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

// acceptJoinRequest 
exports.acceptJoinRequest = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const landlordId = req.user.id;

    // Find the notification and populate pg by RID
    const notification = await Notification.findById(notificationId)
      .populate('sender');

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    if (notification.type !== "join_request") {
      return res.status(400).json({ error: "Invalid notification type" });
    }

    // Get PG by RID
    const pg = await PG.findOne({ RID: notification.pg });
    if (!pg) {
      return res.status(404).json({ error: "PG not found" });
    }

    // Verify landlord owns this PG
    if (pg.LID.toString() !== landlordId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Validate the stored invite token
    const invite = await Invite.findOne({
      roomId: notification.metadata.roomId,
      token: notification.metadata.inviteToken,
      revoked: false
    });

    if (!invite) {
      notification.status = "rejected";
      await notification.save();
      return res.status(400).json({ error: "Invitation has expired or been revoked" });
    }

    // Get the room and check capacity
    const room = pg.rooms.find(r => r.roomId === notification.metadata.roomId);
    
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Check room capacity
    let capacity;
    switch (room.roomType) {
      case "single": capacity = 1; break;
      case "double": capacity = 2; break;
      case "triple": capacity = 3; break;
      case "quad": capacity = 4; break;
      default: capacity = Infinity;
    }

    if (room.tenants.length >= capacity) {
      notification.status = "rejected";
      await notification.save();
      return res.status(400).json({ error: "Room is now full" });
    }

    // Check if tenant is already in the room
    const existingTenant = room.tenants.find(tenant => 
      tenant.tenantId.toString() === notification.sender._id.toString()
    );

    if (existingTenant) {
      notification.status = "accepted";
      await notification.save();
      return res.json({ success: true, message: "Tenant already in room" });
    }

    // Add tenant to room
    room.tenants.push({
      tenantId: notification.sender._id,
      joinDate: new Date()
    });
    await pg.save();

    // Update tenant's currentPG
    await Tenant.findByIdAndUpdate(notification.sender._id, {
      currentPG: pg.RID, // Use RID
      $push: {
        rentalHistory: {
          RID: pg.RID,
          roomId: notification.metadata.roomId,
          rent: room.rent,
          joinedFrom: new Date(),
        }
      }
    });

    // Update invite usage
    invite.usedCount += 1;
    invite.usedBy.push(notification.sender._id);
    
    if (invite.usedCount >= invite.maxJoins) {
      await invite.deleteOne();
    } else {
      await invite.save();
    }

    // Update notification status
    notification.status = "accepted";
    await notification.save();

    // Create a success notification for the tenant - use RID
    await Notification.create({
      type: "announcement",
      sender: landlordId,
      recipients: [{
        recipientId: notification.sender._id,
        isRead: false
      }],
      pg: pg.RID, // Use RID instead of _id
      message: `Welcome to ${pg.pgName}! Your join request for room ${notification.metadata.roomId} has been accepted.`,
      status: "unread",
    });

    res.json({
      success: true,
      message: "Join request accepted and tenant added to room",
    });
  } catch (error) {
    console.error("Accept join request error:", error);
    res.status(500).json({ error: "Failed to accept join request" });
  }
};

// Create leave request (tenant)
exports.createLeaveRequest = async (req, res) => {
  try {
    const { pgId, roomNumber, reason, moveOutDate } = req.body;
    const tenantId = req.user.id;

    // Get PG details by RID
    const pg = await PG.findOne({ RID: pgId });
    if (!pg) {
      return res.status(404).json({ error: "PG not found" });
    }

    // Get tenant details
    const tenant = await Tenant.findById(tenantId);

    // Create leave request notification - use RID
    const notification = await Notification.create({
      type: "leave_request",
      sender: tenantId,
      recipients: [{
        recipientId: pg.LID,
        isRead: false
      }],
      pg: pg.RID, // Use RID
      message: `${tenant.firstName} ${tenant.lastName} has requested to leave room ${roomNumber}`,
      status: "pending",
      metadata: {
        roomNumber,
        tenantName: `${tenant.firstName} ${tenant.lastName}`,
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

// acceptLeaveRequest 
exports.acceptLeaveRequest = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const landlordId = req.user.id;

    // Find the notification and populate sender
    const notification = await Notification.findById(notificationId).populate('sender');

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    if (notification.type !== "leave_request") {
      return res.status(400).json({ error: "Invalid notification type" });
    }

    // Get PG by RID
    const pg = await PG.findOne({ RID: notification.pg });
    if (!pg) {
      return res.status(404).json({ error: "PG not found" });
    }

    // Verify landlord owns this PG
    if (pg.LID.toString() !== landlordId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Check if already processed
    if (notification.status !== "pending") {
      return res.status(400).json({ error: "Leave request already processed" });
    }

    // Find the room and remove tenant
    const room = pg.rooms.find(r => r.roomId === notification.metadata.roomNumber);
    
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Check if tenant exists in room
    const tenantIndex = room.tenants.findIndex(
      tenant => tenant.tenantId.toString() === notification.sender._id.toString()
    );

    if (tenantIndex === -1) {
      notification.status = "accepted";
      await notification.save();
      return res.json({ 
        success: true, 
        message: "Tenant already removed from room" 
      });
    }

    // Remove tenant from room
    room.tenants.splice(tenantIndex, 1);
    await pg.save();

    // Update tenant's currentPG and rental history
    const tenant = await Tenant.findById(notification.sender._id);
    if (tenant && tenant.currentPG === pg.RID) {
      // Update the rental history end date
      const historyIndex = tenant.rentalHistory.findIndex(
        history => history.RID === pg.RID && !history.leftOn
      );
      
      if (historyIndex !== -1) {
        tenant.rentalHistory[historyIndex].leftOn = new Date();
      }

      // Clear currentPG
      tenant.currentPG = null;
      await tenant.save();
    }

    // Update notification status
    notification.status = "accepted";
    await notification.save();

    // Create a confirmation notification for the tenant
    await Notification.create({
      type: "announcement",
      sender: landlordId,
      recipients: [{
        recipientId: notification.sender._id,
        isRead: false
      }],
      pg: pg.RID,
      message: `Your leave request for room ${notification.metadata.roomNumber} at ${pg.pgName} has been accepted. We wish you all the best!`,
      status: "unread",
    });

    res.json({
      success: true,
      message: "Leave request accepted and tenant removed from room",
    });
  } catch (error) {
    console.error("Accept leave request error:", error);
    res.status(500).json({ error: "Failed to accept leave request" });
  }
};

// Create rent payment notification
exports.createRentPaymentNotification = async (req, res) => {
  try {
    const { pgId, amount, paymentId, month, year } = req.body;
    const tenantId = req.user.id;

    // Get PG and tenant details by RID
    const pg = await PG.findOne({ RID: pgId });
    const tenant = await Tenant.findById(tenantId);

    if (!pg) {
      return res.status(404).json({ error: "PG not found" });
    }

    // Create rent paid notification - use RID
    const notification = await Notification.create({
      type: "rent_paid",
      sender: tenantId,
      recipients: [{
        recipientId: pg.LID,
        isRead: false
      }],
      pg: pg.RID, // Use RID
      message: `${tenant.firstName} ${tenant.lastName} has paid rent of ₹${amount} for ${month}/${year}`,
      status: "unread",
      metadata: {
        amount,
        paymentId,
        tenantName: `${tenant.firstName} ${tenant.lastName}`,
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

    const query = {
      $or: [
        { 
          sender: userId,
          type: { $ne: "join_request" }
        },
        { "recipients.recipientId": userId }
      ]
    };

    if (type) query.type = type;
    if (status) query.status = status;
    if (pgId) query.pg = pgId; // pgId is now RID string

    const notifications = await Notification.find(query)
      .populate("sender", "firstName lastName email")
      .populate("recipients.recipientId", "firstName lastName email")
      .sort({ createdAt: -1 });

    // Manually populate PG data since it's now a string reference
    const populatedNotifications = await Promise.all(
      notifications.map(async (notif) => {
        const notifObj = notif.toObject();
        const pgData = await PG.findOne({ RID: notif.pg }).select('pgName RID');
        notifObj.pg = pgData;
        return notifObj;
      })
    );

    res.json({
      success: true,
      notifications: populatedNotifications,
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
    const { notificationId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    // Check if user is in recipients
    const isRecipient = notification.recipients.some(
      r => r.recipientId.toString() === userId
    );

    if (!isRecipient) {
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

    // Get PG by RID for additional operations
    const pg = await PG.findOne({ RID: notification.pg });

    // If join request is accepted, add tenant to PG
    if (notification.type === "join_request" && status === "accepted" && pg) {
      // This logic should be in acceptJoinRequest function
    }

    // If leave request is accepted, remove tenant from PG
    if (notification.type === "leave_request" && status === "accepted" && pg) {
      const room = pg.rooms.find(r => r.roomNumber === notification.metadata.roomNumber);
      if (room) {
        room.tenants = room.tenants.filter(
          t => t.tenantId.toString() !== notification.sender.toString()
        );
        await pg.save();
      }
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

    // Get user's current PG
    const user = await Tenant.findById(userId).select('currentPG');
    
    const count = await Notification.countDocuments({
      $or: [
        {
          "recipients.recipientId": userId,
          "recipients.isRead": false,
        },
        {
          type: "announcement",
          pg: user.currentPG, // currentPG is now RID
          "recipients.recipientId": userId,
          "recipients.isRead": false,
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
      { "recipients.recipientId": userId, "recipients.isRead": false },
      { $set: { "recipients.$[recipient].isRead": true } },
      { arrayFilters: [{ "recipient.recipientId": userId }] }
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