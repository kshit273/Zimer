const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["announcement", "join_request", "leave_request", "rent_paid"],
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipients: [
      {
        recipientId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        isRead: {
          type: Boolean,
          default: false,
        },
        readAt: {
          type: Date,
        },
      },
    ],
    pg: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PG",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "read", "unread"],
      default: function () {
        if (this.type === "announcement") return "unread";
        if (this.type === "join_request" || this.type === "leave_request")
          return "pending";
        return "unread";
      },
    },
    metadata: {
      roomNumber: String,
      roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
      },
      amount: Number,
      paymentId: String,
      tenantName: String,
      tenantEmail: String,
      tenantPhone: String,
      moveInDate: Date,
      moveOutDate: Date,
      reason: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
notificationSchema.index({ "recipients.recipientId": 1, createdAt: -1 });
notificationSchema.index({ pg: 1, type: 1, createdAt: -1 });
notificationSchema.index({ sender: 1, type: 1, status: 1 });

module.exports = mongoose.model("Notification", notificationSchema);
