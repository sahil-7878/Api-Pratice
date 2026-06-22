
const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    flatNumber: { type: String, required: true },

    month: { type: String, required: true },
    year: { type: Number, required: true },

    maintenanceAmount: { type: Number, required: true },
    penaltyAmount: { type: Number, default: 0 },
    otherCharges: { type: Number, default: 0 },

    totalAmount: { type: Number, required: true },

    dueDate: { type: Date, required: true },

    status: {
      type: String,
      enum: ["pending", "paid", "overdue"],
      default: "pending",
    },

    paidAt: Date,
    paymentMethod: String,
    transactionId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bill", billSchema);
