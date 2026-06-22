const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const Resident = require("../models/Resident");

router.get("/", protect, authorize("admin"), async (req, res) => {
  const residents = await Resident.find().populate("user", "name email phone flatNumber");
  res.json(residents);
});

router.get("/me", protect, authorize("resident"), async (req, res) => {
  const resident = await Resident.findOne({ user: req.user._id });
  res.json(resident);
});

router.post("/", protect, authorize("resident", "admin"), async (req, res) => {
  try {
    const existing = await Resident.findOne({ user: req.user._id });
    if (existing) {
      Object.assign(existing, req.body);
      await existing.save();
      return res.json(existing);
    }
    const resident = await Resident.create({ user: req.user._id, ...req.body });
    res.status(201).json(resident);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
