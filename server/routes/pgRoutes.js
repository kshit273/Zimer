const express = require("express");
const router = express.Router();
const {
  getAllPGs,
  getPGById,
  getPGByIdToShow,
  createPG,
  updatePG,
  generateToken,
  validateInvite,
  removeTenantsFromRoom,
  addReview,
  getReviews,
  updateReview,
  updatePGPhotos,
  getTenantPGData,
} = require("../controllers/pgController");
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");

// Review routes
router.post("/:pgId/reviews", authMiddleware, addReview); 
router.get("/:pgId/reviews", getReviews); 
router.put("/:pgId/reviews/:reviewId", authMiddleware, updateReview)

// PG routes
router.get("/", getAllPGs);
router.get("/:pgId",authMiddleware, getPGById);
router.get("/show-data/:pgId",authMiddleware, getPGByIdToShow);
router.post("/", upload.any(), authMiddleware, createPG);
router.put("/:id",authMiddleware, updatePG);
router.put("/:id/photos", upload.any(),authMiddleware, updatePGPhotos);

// Tenant routes
router.post("/remove-tenants", authMiddleware, removeTenantsFromRoom); 
router.post("/generate-tenant-token", authMiddleware, generateToken); 
router.get("/validate-invite/:RID/:roomId", authMiddleware, validateInvite);
router.get("/tenant-pg/:pgId", authMiddleware, getTenantPGData);

module.exports = router;