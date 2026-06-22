const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const { generateBill, getBills, markAsPaid, applyPenalties } = require("../controllers/billingController");

router.get("/",                    protect, authorize("admin", "resident"), getBills);
router.post("/generate",           protect, authorize("admin"),   generateBill);
router.put("/:id/pay",             protect, authorize("resident","admin"), markAsPaid);
router.put("/apply-penalties",     protect, authorize("admin"),   applyPenalties);

module.exports = router;
