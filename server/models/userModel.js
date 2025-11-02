const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },

    dob: { type: String, required: true },
    gender: { type: String, required: true, lowercase: true },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },

    // role-based access: tenant, owner, admin
    role: {
      type: String,
      enum: ["tenant", "landlord", "admin"],
      default: "tenant",
    },

    // For PG owners — they can create PG listings
    ownedPGs: [{ type: String }],

    // For tenants — which PG they live in
    currentPG: { type: String },

    // rewards balance
    rewardPoints: {
      type: Number,
      default: 0,
    },

    // ZTRS score
    ztrsScore: {
      type: Number,
      default: 0,
    },

    //Saved PGs list
    savedPGs:[{ type: String }],

    // Tenant PG details
    rentalHistory: [
      {
        RID: { type: String, required: true },
        roomId: { type: String }, // or roomType if no unique room number
        rent: { type: Number },
        joinedFrom: { type: Date },
        leftOn: { type: Date },
      },
    ],
  },
  { timestamps: true }
);

// 🔐 Middleware: hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔐 Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
