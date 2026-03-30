const mongoose = require("mongoose");

const brSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    RID: {
      type: String,
      ref: "PG",
      required: true,
    },
    response: {
      type: String,
      default: "",
    },
    pgName: {
      type: String,
      required: true,
    },
    senderEmail: { type: String, required: true, lowercase: true },  
    senderContact: { type: String, required: true },                  
    reqTime: {
      type: Date,
      default: Date.now,
    },
    resTime: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

brSchema.index({ sender: 1, RID: 1 }, { unique: true });

module.exports = mongoose.model("Br", brSchema);