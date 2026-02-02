const express = require("express");
const router = express.Router();
const {
  getAllPGs,
  getPGById,
  createPG,
  updatePG,
  generateToken,
  validateInvite,
  removeTenantsFromRoom,
  addReview,
  getReviews,
  getRoomById,
  updateRoomAvailability,
  updatePGPhotos,
  getTenantPGData,
} = require("../controllers/pgController");
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");

// Review routes
router.post("/:pgId/reviews", authMiddleware, addReview);
router.get("/:pgId/reviews", getReviews);

router.get("/:pgId/room/:roomId", getRoomById);
router.patch("/:pgId/room/:roomId/availability", updateRoomAvailability);

// PG routes
router.get("/", getAllPGs);
router.get("/:pgId",authMiddleware, getPGById);
router.post("/", upload.any(), authMiddleware, createPG);
router.put("/:id", updatePG);
router.put("/:id/photos", upload.any(), updatePGPhotos);

// Tenant routes
router.post("/remove-tenants", removeTenantsFromRoom);
router.post("/generate-tenant-token", generateToken);
router.get("/validate-invite/:RID/:roomId", authMiddleware, validateInvite);
router.get("/tenant-pg/:pgId", authMiddleware, getTenantPGData);

module.exports = router;