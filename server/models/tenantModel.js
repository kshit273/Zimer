const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const tenantSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["tenant", "landlord"] },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true },
    dob: { type: String, required: true },
    gender: { type: String, required: true, lowercase: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "" },
    ztrs: { type: Number, default: 0 },
    rentalHistory: [
      {
        RID: { type: String, required: true },
        roomId: { type: String, required: true },
        rent: { type: Number, required: true },
        joinedFrom: { type: Date, required: true },
        leftOn: { type: Date, required: true },
      },
    ],
    currentPG: { type: String },
    savedPGs: [{ type: String }],
    currentLandlord: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Landlord",
          required: true,
        },
  },
  { timestamps: true }
);

tenantSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

tenantSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Tenant", tenantSchema);3