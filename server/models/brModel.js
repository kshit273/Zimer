const mongoose = require("mongoose");

const brSchema = new mongoose.Schema(
  {
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Tenant",
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Admin",
        required: true,
    },
     RID: {
      type: String,  
      ref: "PG",
      required: true,
    },
    response: {
      type: String,
      default:'',
    },
    pgName: {
      type: String,
      required: true,
    },
    senderEmail: { type: String, unique: true, required: true, lowercase: true },
    senderContact: { type: String, required: true, unique: true },
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

module.exports = mongoose.model("Br", brSchema);