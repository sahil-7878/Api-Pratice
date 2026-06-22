const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const { Facility, Booking } = require("../models/Facility");

router.get("/", protect, async (req, res) => {
  const facilities = await Facility.find({ isAvailable: true });
  res.json(facilities);
});

router.post("/", protect, authorize("admin"), async (req, res) => {
  const facility = await Facility.create(req.body);
  res.status(201).json(facility);
});

router.post("/book", protect, authorize("resident"), async (req, res) => {
  try {
    const { facilityId, date, startTime, endTime, purpose } = req.body;

    const conflict = await Booking.findOne({
      facility: facilityId,
      date,
      status: "approved",
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
      ],
    });
    if (conflict) {
      return res.status(400).json({ message: "This time slot is already booked" });
    }

    const booking = await Booking.create({
      facility: facilityId,
      bookedBy: req.user._id,
      date,
      startTime,
      endTime,
      purpose,
    });
    res.status(201).json(booking);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/bookings", protect, async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { bookedBy: req.user._id };
  const bookings = await Booking.find(filter)
    .populate("facility", "name")
    .populate("bookedBy", "name flatNumber")
    .sort({ date: -1 });
  res.json(bookings);
});

router.put("/bookings/:id", protect, authorize("admin"), async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(booking);
});

module.exports = router;
