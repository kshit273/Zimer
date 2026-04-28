const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    id: { type: Number, required : true},
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true },
    dob: { type: String, required: true },
    gender: { type: String, required: true, lowercase: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    managedPGs: [{ type: String }],
    managedArea:{type: String, required: true, trim: true},
    areaPGs: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
