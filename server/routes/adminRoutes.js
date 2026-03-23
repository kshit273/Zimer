const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdminMiddleware");
const {
  getDashboard,
  getPGs,
  getPGDetails,
  adminLogin,
  getBRNotifications,
  updateBRResponse,
  postZTRS,
  getNotifications,
} = require("../controllers/adminController");

// Public route — no auth needed for login
router.post("/login", adminLogin);

// Protected routes
router.get("/dashboard", auth, isAdmin, getDashboard);
router.get("/pgs", auth, isAdmin, getPGs);
router.post("/pgs", auth, isAdmin, getPGs); // POST variant if RIDs sent in body

router.get("/br", auth, isAdmin, getBRNotifications);
router.put("/br", auth, isAdmin, updateBRResponse);

router.post("/ztrs", auth, isAdmin, postZTRS);

router.get("/notifications", auth, isAdmin, getNotifications);

// Must come LAST — catches /:pgId and won't shadow the routes above
router.get("/:pgId", auth, isAdmin, getPGDetails);

module.exports = router;