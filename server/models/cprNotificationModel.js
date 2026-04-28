const mongoose = require("mongoose");

const cprNotificationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Landlord",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    formData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    metadata: {
      senderName: String,
      senderEmail: String,
      senderPhone: String,
      city: String,
      areaCode: String,
    },
    type: {
      type: String,
      default: "create_pg_request",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
cprNotificationSchema.index({ recipient: 1, createdAt: -1 });

module.exports = mongoose.model("CPRNotification", cprNotificationSchema);
