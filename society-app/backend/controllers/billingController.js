
const Bill = require("../models/Bill");

const generateBill = async (req, res) => {
  try {
    const { residentId, flatNumber, month, year, maintenanceAmount, otherCharges, dueDate } = req.body;

    const existing = await Bill.findOne({ resident: residentId, month, year });
    if (existing) {
      return res.status(400).json({ message: "Bill already generated for this month" });
    }

    const totalAmount = (maintenanceAmount || 0) + (otherCharges || 0);

    const bill = await Bill.create({
      resident: residentId,
      flatNumber,
      month,
      year,
      maintenanceAmount,
      otherCharges: otherCharges || 0,
      totalAmount,
      dueDate,
    });

    res.status(201).json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBills = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "resident") {
      filter.resident = req.user._id;
    }

    const bills = await Bill.find(filter)
      .populate("resident", "name email flatNumber")
      .sort({ year: -1, createdAt: -1 });

    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markAsPaid = async (req, res) => {
  try {
    const { paymentMethod, transactionId } = req.body;

    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ message: "Bill not found" });

    if (bill.resident.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    bill.status = "paid";
    bill.paidAt = new Date();
    bill.paymentMethod = paymentMethod;
    bill.transactionId = transactionId;
    await bill.save();

    res.json({ message: "Payment recorded", bill });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const applyPenalties = async (req, res) => {
  try {
    const today = new Date();

    const overdueBills = await Bill.find({
      status: "pending",
      dueDate: { $lt: today },
    });

    let updated = 0;
    for (const bill of overdueBills) {
      bill.status = "overdue";
      bill.penaltyAmount = bill.totalAmount * 0.05;
      bill.totalAmount = bill.totalAmount + bill.penaltyAmount;
      await bill.save();
      updated++;
    }

    res.json({ message: `${updated} bills marked overdue with penalty applied` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateBill, getBills, markAsPaid, applyPenalties };
