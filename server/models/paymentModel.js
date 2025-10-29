const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    pgId: { type: String, required:true },
    amount: Number,
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    paymentId: String, // from Razorpay or other gateway
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
