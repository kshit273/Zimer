const mongoose = require("mongoose");

const adminNotificationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Tenant",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    pg: {
      type: String,  
      ref: "PG",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    metadata: {
      tenantName: String,
      tenantEmail: String,
      tenantPhone: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
adminNotificationSchema.index({ pg: 1, type: 1, createdAt: -1 });
adminNotificationSchema.index({ sender: 1, type: 1, status: 1 });

module.exports = mongoose.model("AdminNotification", adminNotificationSchema);