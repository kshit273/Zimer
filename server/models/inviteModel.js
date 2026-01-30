const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true, // so two invites don’t clash
    },
    PGID: {
      type: String,
      ref: "PG",
      required: true,
    },
    roomId: {
      type: String, // matches the `roomId` in the PG.rooms array
      required: true,
    },
    maxJoins: {
      type: Number,
      required: true, // set to room capacity
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date, 
      required : true
    },
    revoked: {
      type: Boolean,
      default: false, // landlord can revoke anytime
    },
    usedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tenant",
      },
    ], // track which tenants joined via this link
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invite", inviteSchema);
