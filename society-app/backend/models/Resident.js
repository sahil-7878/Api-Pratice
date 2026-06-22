
const mongoose = require("mongoose");

const familyMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  relation: String,
  age: Number,
  phone: String,
});

const vehicleSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true },
  vehicleType: {
    type: String,
    enum: ["car", "bike", "other"],
    default: "car",
  },
  model: String,
});

const residentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    flatNumber: { type: String, required: true },

    occupancyType: {
      type: String,
      enum: ["owner", "tenant"],
      default: "owner",
    },

    ownerName: String,

    familyMembers: [familyMemberSchema],
    vehicles: [vehicleSchema],

    moveInDate: { type: Date, default: Date.now },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resident", residentSchema);
