const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  logout,
  verifyToken,
  updateUser,
  getUser,
  getTenantsBatch,
  updateLandlordPGs,
  getSavedPGs,
  clearTenantPG,
  sendOtp,
  verifyOtp,
  resetPassword,
  postSavedPGs,
  getLandlordData
} = require("../controllers/authController");

const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");

// Auth routes
router.post("/signup", upload.single("profilePicture"), signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify-token", verifyToken);
router.put(
  "/update",
  authMiddleware,
  upload.single("profilePicture"),
  updateUser
);
router.post("/forgot-password/send-otp",sendOtp)
router.post("/forgot-password/verify-otp",verifyOtp)
router.post("/forgot-password/reset",resetPassword)
router.post("/clear-pg", clearTenantPG);
router.get("/me", authMiddleware, getUser);
router.post("/tenants-batch", getTenantsBatch);
router.get("/saved-pgs", authMiddleware, getSavedPGs);
router.post("/saved-pgs", authMiddleware, postSavedPGs);
router.put("/update-landlord-pgs",authMiddleware, updateLandlordPGs);
router.get("/landlord-data/:lid", getLandlordData);

module.exports = router;
