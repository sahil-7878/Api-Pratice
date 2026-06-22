const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const { Poll } = require("../models/Notice");

router.get("/", protect, async (req, res) => {
  const polls = await Poll.find({ isActive: true });
  res.json(polls);
});

router.post("/", protect, authorize("admin"), async (req, res) => {
  const poll = await Poll.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json(poll);
});

router.post("/:id/vote", protect, authorize("resident"), async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll || !poll.isActive) {
      return res.status(400).json({ message: "Poll not available" });
    }

    const { optionIndex } = req.body;

    poll.options.forEach((opt) => {
      opt.votes = opt.votes.filter(
        (v) => v.toString() !== req.user._id.toString()
      );
    });

    poll.options[optionIndex].votes.push(req.user._id);
    await poll.save();

    res.json({ message: "Vote cast", poll });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
