
const mongoose = require("mongoose");

const facilitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    capacity: Number,
    isAvailable: { type: Boolean, default: true },

    openTime: { type: String, default: "06:00" },
    closeTime: { type: String, default: "22:00" },
    maxHoursPerBooking: { type: Number, default: 2 },
  },
  { timestamps: true }
);

const bookingSchema = new mongoose.Schema(
  {
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facility",
      required: true,
    },

    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },

    purpose: String,

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Facility = mongoose.model("Facility", facilitySchema);
const Booking = mongoose.model("Booking", bookingSchema);

module.exports = { Facility, Booking };
