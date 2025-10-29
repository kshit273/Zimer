const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getPaymentStatus,
  confirmPayment,
  payRent,
  getPaymentHistory,
} = require("../controllers/paymentController");

router.get("/status/:id", getPaymentStatus);
router.post("/confirm", confirmPayment);
router.post("/initiate", authMiddleware, payRent);
router.get("/history/:pgId/:roomId",getPaymentHistory);

module.exports = router;
