
const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    flatNumber: { type: String, required: true },

    category: {
      type: String,
      enum: [
        "electrical",
        "plumbing",
        "water",
        "cleaning",
        "security",
        "parking",
        "lift",
        "other",
      ],
      required: true,
    },

    title: { type: String, required: true },
    description: String,

    image: String,

    status: {
      type: String,
      enum: ["open", "assigned", "inProgress", "resolved", "closed"],
      default: "open",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    workNotes: [
      {
        note: String,
        addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        addedAt: { type: Date, default: Date.now },
      },
    ],

    resolvedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
