
const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    purpose: {
      type: String,
      enum: ["guest", "delivery", "service", "other"],
      default: "guest",
    },

    photo: String,

    flatNumber: { type: String, required: true },

    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    entryTime: { type: Date, default: Date.now },
    exitTime: Date,

    isInside: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Visitor", visitorSchema);
