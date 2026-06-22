
const Complaint = require("../models/Complaint");

const createComplaint = async (req, res) => {
  try {
    const { category, title, description } = req.body;

    const complaint = await Complaint.create({
      raisedBy: req.user._id,
      flatNumber: req.user.flatNumber,
      category,
      title,
      description,
      image: req.file?.filename,
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComplaints = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "resident") {
      filter.raisedBy = req.user._id;
    }

    if (req.user.role === "maintenance") {
      filter.assignedTo = req.user._id;
    }

    const complaints = await Complaint.find(filter)
      .populate("raisedBy", "name email flatNumber")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const assignComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        assignedTo: req.body.staffId,
        status: "assigned",
      },
      { new: true }
    ).populate("assignedTo", "name email");

    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateComplaintStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    complaint.status = status;

    if (note) {
      complaint.workNotes.push({ note, addedBy: req.user._id });
    }

    if (status === "resolved") {
      complaint.resolvedAt = new Date();
    }

    await complaint.save();
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteComplaint = async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ message: "Complaint removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  assignComplaint,
  updateComplaintStatus,
  deleteComplaint,
};
