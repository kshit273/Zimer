const express = require("express");
const router = express.Router();
const {
  getAllPGs,
  getPGById,
  createPG,
  updatePG,
  deletePG,
  generateToken,
  validateInvite,
  removeTenantsFromRoom,
  addReview,
  getReviews,
} = require("../controllers/pgController");
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/:pgId/reviews", authMiddleware,addReview);
router.get("/:pgId/reviews",getReviews);
router.put("/:pgId/reviews/:reviewId",addReview);
router.delete("/:pgId/reviews/:reviewId",addReview);
router.get("/", getAllPGs);
router.get("/:pgId", getPGById);
router.post("/", upload.any(), authMiddleware, createPG);
router.put("/:id", updatePG);
router.delete("/:id", deletePG);
router.post("/remove-tenants",removeTenantsFromRoom);
router.post("/generate-tenant-token",generateToken);
router.get("/validate-invite/:RID/:roomId", authMiddleware, validateInvite);


module.exports = router;
