const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: {
      type: String,
      enum: ["general", "emergency", "event", "meeting", "maintenance"],
      default: "general",
    },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
    expiresAt: Date,
  },
  { timestamps: true }
);

const pollSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    options: [
      {
        label: { type: String, required: true },
        votes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      },
    ],

    isActive: { type: Boolean, default: true },
    endsAt: Date,
  },
  { timestamps: true }
);

const Notice = mongoose.model("Notice", noticeSchema);
const Poll = mongoose.model("Poll", pollSchema);

module.exports = { Notice, Poll };
