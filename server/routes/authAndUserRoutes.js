const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  logout,
  verifyToken,
  updateUser,
  getUser,
  getTenantsBatch
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
router.get("/me", authMiddleware, getUser);
router.post("/tenants-batch", getTenantsBatch);

module.exports = router;
