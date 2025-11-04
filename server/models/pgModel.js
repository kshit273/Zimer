const mongoose = require("mongoose");

// Sub-schema for Reviews
const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewText: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    ratings: {
      community: { type: Number, required: true, min: 1, max: 5 },
      value: { type: Number, required: true, min: 1, max: 5 },
      location: { type: Number, required: true, min: 1, max: 5 },
      food: { type: Number, required: true, min: 1, max: 5 },
      landlord: { type: Number, required: true, min: 1, max: 5 },
    },
    overallRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

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
            paidOn: { type: Date, default: Date.now },
          },
        ],
      },
    ],
    rent: { type: Number, required: true },
    furnished: { type: String, enum: ["fully", "no", "semi"], default: "no", required: true },
    amenities: [String],
    photos: [String],
    security: { type: Number },
    availableFrom: { type: Date },
    description: { type: String },
  },
  { _id: false }
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
    description: { type: String, required: true },
    amenities: [String],

    // 📌 Owner
    LID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 📌 PG Details
    gender: { type: String, enum: ["boys", "girls", "both"], required: true },
    rooms: [roomSchema],

    additionalInfo: { type: String },
    rules: [String],

    // 📌 Food
    foodAvailable: { type: Boolean, default: false },
    foodDescription: { type: String },
    menu: [String],
    selfCookingAllowed: { type: Boolean, default: false },
    tiffinServiceAvailable: { type: Boolean, default: false },

    // 📌 Reviews
    reviews: [reviewSchema],
    averageRatings: {
      community: { type: Number, default: 0 },
      value: { type: Number, default: 0 },
      location: { type: Number, default: 0 },
      food: { type: Number, default: 0 },
      landlord: { type: Number, default: 0 },
      overall: { type: Number, default: 0 },
    },
    totalReviews: { type: Number, default: 0 },

    // 📌 Platform Plan
    plan: {
      type: String,
      enum: ["basic", "popular", "premium"],
      default: "basic",
    },
  },
  { timestamps: true }
);

// Method to calculate average ratings
pgSchema.methods.calculateAverageRatings = function () {
  if (this.reviews.length === 0) {
    this.averageRatings = {
      community: 0,
      value: 0,
      location: 0,
      food: 0,
      landlord: 0,
      overall: 0,
    };
    this.totalReviews = 0;
    return;
  }

  const totals = this.reviews.reduce(
    (acc, review) => {
      acc.community += review.ratings.community;
      acc.value += review.ratings.value;
      acc.location += review.ratings.location;
      acc.food += review.ratings.food;
      acc.landlord += review.ratings.landlord;
      acc.overall += review.overallRating;
      return acc;
    },
    { community: 0, value: 0, location: 0, food: 0, landlord: 0, overall: 0 }
  );

  const count = this.reviews.length;
  this.averageRatings = {
    community: parseFloat((totals.community / count).toFixed(1)),
    value: parseFloat((totals.value / count).toFixed(1)),
    location: parseFloat((totals.location / count).toFixed(1)),
    food: parseFloat((totals.food / count).toFixed(1)),
    landlord: parseFloat((totals.landlord / count).toFixed(1)),
    overall: parseFloat((totals.overall / count).toFixed(1)),
  };
  this.totalReviews = count;
};

module.exports = mongoose.model("PG", pgSchema);