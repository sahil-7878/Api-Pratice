const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  createComplaint,
  getComplaints,
  assignComplaint,
  updateComplaintStatus,
  deleteComplaint,
} = require("../controllers/complaintController");

const { protect, authorize } = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

router.get("/",           protect, authorize("admin", "resident", "maintenance"), getComplaints);
router.post("/",          protect, authorize("resident"), upload.single("image"), createComplaint);
router.put("/:id/assign", protect, authorize("admin"),        assignComplaint);
router.put("/:id/update", protect, authorize("maintenance"),  updateComplaintStatus);
router.delete("/:id",     protect, authorize("admin"),        deleteComplaint);

module.exports = router;
