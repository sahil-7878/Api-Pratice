const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const { Notice } = require("../models/Notice");

router.get("/", protect, async (req, res) => {
  const notices = await Notice.find({ isActive: true }).sort({ createdAt: -1 });
  res.json(notices);
});

router.post("/", protect, authorize("admin"), async (req, res) => {
  const notice = await Notice.create({ ...req.body, postedBy: req.user._id });
  res.status(201).json(notice);
});

router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  await Notice.findByIdAndDelete(req.params.id);
  res.json({ message: "Notice removed" });
});

module.exports = router;

const pollRouter = express.Router();
const { Poll } = require("../models/Notice");

pollRouter.get("/", protect, async (req, res) => {
  const polls = await Poll.find({ isActive: true });
  res.json(polls);
});

pollRouter.post("/", protect, authorize("admin"), async (req, res) => {
  const poll = await Poll.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json(poll);
});

pollRouter.post("/:id/vote", protect, authorize("resident"), async (req, res) => {
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

module.exports = { noticeRouter: router, pollRouter };
