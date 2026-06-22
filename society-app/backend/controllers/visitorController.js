
const Visitor = require("../models/Visitor");
const User = require("../models/User");

const registerVisitor = async (req, res) => {
  try {
    const { name, phone, purpose, flatNumber } = req.body;

    const resident = await User.findOne({ flatNumber, role: "resident" });
    if (!resident) {
      return res.status(404).json({ message: "No resident found for that flat" });
    }

    const visitor = await Visitor.create({
      name,
      phone,
      purpose,
      flatNumber,
      resident: resident._id,
      registeredBy: req.user._id,
      photo: req.file?.filename,
    });

    res.status(201).json({ message: "Visitor registered, awaiting resident approval", visitor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveVisitor = async (req, res) => {
  try {
    const { status } = req.body;

    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) return res.status(404).json({ message: "Visitor not found" });

    if (visitor.resident.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized for this visitor" });
    }

    visitor.approvalStatus = status;
    if (status === "approved") visitor.isInside = true;
    await visitor.save();

    res.json({ message: `Visitor ${status}`, visitor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const recordExit = async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      { exitTime: new Date(), isInside: false },
      { new: true }
    );
    if (!visitor) return res.status(404).json({ message: "Visitor not found" });

    res.json({ message: "Exit recorded", visitor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVisitors = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "resident") {
      filter.resident = req.user._id;
    }

    const visitors = await Visitor.find(filter)
      .populate("registeredBy", "name")
      .sort({ entryTime: -1 });

    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerVisitor, approveVisitor, recordExit, getVisitors };
