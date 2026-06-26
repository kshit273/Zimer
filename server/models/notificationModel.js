const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["announcement", "join_request", "leave_request", "rent_paid", "kick_request"],
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'senderModel',
    },
    senderModel: {
      type: String,
      required: true,
      enum: ['Tenant', 'Landlord'],
      default: function() {
        if (this.type === 'announcement') return 'Landlord';
        if (this.type === 'join_request' || this.type === 'leave_request') return 'Tenant';
        if (this.type === 'kick_request') return 'Landlord';
        return 'Landlord';
      }
    },
    recipients: [
      {
        recipientId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          refPath: 'recipients.recipientModel',
        },
        recipientModel: {
          type: String,
          required: true,
          enum: ['Tenant', 'Admin'],
          default: 'Tenant',
        },
        isRead: {
          type: Boolean,
          default: false,
        },
      },
    ],
    pg: {
      type: String,
      ref: "PG",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "sent", "pending_ztrs"],
      default: function () {
        if (this.type === "announcement") return "sent";
        if (this.type === "join_request" || this.type === "leave_request" || this.type === "kick_request")
          return "pending";
        return "sent";
      },
    },
    metadata: {
      roomId: String,
      amount: Number,
      paymentId: String,
      tenantName: String,
      tenantEmail: String,
      tenantPhone: String,
      moveInDate: Date,
      moveOutDate: Date,
      inviteToken: String,
      reason: String,
      tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant" },
      tenantIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tenant" }],
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ "recipients.recipientId": 1, createdAt: -1 });
notificationSchema.index({ pg: 1, type: 1, createdAt: -1 });
notificationSchema.index({ sender: 1, type: 1, status: 1 });

module.exports = mongoose.model("Notification", notificationSchema);