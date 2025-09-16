const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRole");
const {
  getMe,
  updateMe,
  deleteMe,
  getMyPGs,
  getMyPayments,
  getMyWishlist,
  getTenantPayments,
} = require("../controllers/userController");

router.get("/me", auth, getMe);
router.put("/update", auth, updateMe);
router.delete("/delete", auth, deleteMe);
router.get("/my-pgs", auth, checkRole(["landlord"]), getMyPGs); // For landlords
router.get("/my-payments", auth, checkRole(["tenant"]), getMyPayments); // For tenants
router.get("/wishlist", auth, getMyWishlist); // For tenants
router.get("/tenant-payments/:pgId", auth, getTenantPayments); // For landlords

module.exports = router;
