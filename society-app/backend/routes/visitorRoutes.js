const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const { registerVisitor, approveVisitor, recordExit, getVisitors } = require("../controllers/visitorController");

router.get("/",           protect, authorize("admin", "security", "resident"), getVisitors);
router.post("/",          protect, authorize("security"),  registerVisitor);
router.put("/:id/approve",protect, authorize("resident"), approveVisitor);
router.put("/:id/exit",   protect, authorize("security"), recordExit);

module.exports = router;
