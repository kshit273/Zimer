const mongoose = require("mongoose");

const ztrsSchema = new mongoose.Schema(
  {
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Tenant",
        required: true,
    },
    timeline: [{
      RID: {
      type: String,  
      ref: "PG",
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    ztrs:{
        type : Number,
        required : true,
    }
  }],
    finalScore: {
      type: Number,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ZTRS", ztrsSchema);