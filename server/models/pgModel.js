const mongoose = require("mongoose");

// Sub-schema for each Room
const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
    },
    roomType: {
      type: String,
      enum: ["single", "double", "triple", "quad", "other"],
      required: true,
    },
    tenants: [
      {
        tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        joinDate: { type: Date, default: Date.now },
        leaveDate: { type: Date },
        payments: [
          {
            month: { type: String, required: true }, 
            amount: { type: Number, required: true }, 
            paidOn: { type: Date, default: Date.now } 
          }
        ]
      }
    ],
    rent: { type: Number, required: true },
    furnished: { type: String, enum: ["fully", "no", "semi"], default: "no", required: true },
    amenities: [String], // ["AC", "Attached Bathroom", "Balcony"]
    photos: [String],
    security:{type: Number},
    availableFrom: { type: Date },
    description: { type: String },
  },
  { _id: false } // rooms don’t need their own ObjectId
);


// Main PG Schema
const pgSchema = new mongoose.Schema(
  {
    // 🔑 PG Identity
    RID: {
      type: String,
      unique: true,
      required: true,
    },

    // 📌 Basic Info
    pgName: { type: String, required: true },
    coverPhoto: { type: String }, 
    otherPhotos: [String], 
    address: { type: String, required: true },
    description: { type: String, required:true },
    amenities: [String],

    // 📌 Owner
    LID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 📌 PG Details
    gender: { type: String, enum: ["boys", "girls", "both"], required: true },
    rooms: [roomSchema], // Embed all rooms

    additionalInfo: { type: String }, // Free text for extra details
    rules:[String],

    // 📌 Food
    foodAvailable: { type: Boolean, default: false },
    foodDescription: { type: String },
    menu: [String], // ["Breakfast: Paratha", "Lunch: Dal Rice"]
    selfCookingAllowed: { type: Boolean, default: false },
    tiffinServiceAvailable: { type: Boolean, default: false },

    // 📌 Platform Plan
    plan: {
      type: String,
      enum: ["basic", "popular", "premium"],
      default: "basic",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PG", pgSchema);
