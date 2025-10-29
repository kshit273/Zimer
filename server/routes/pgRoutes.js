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
} = require("../controllers/pgController");
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", getAllPGs);
router.get("/:pgId", getPGById);
router.post("/", upload.any(), authMiddleware, createPG);
router.put("/:id", updatePG);
router.delete("/:id", deletePG);
router.post("/remove-tenants",removeTenantsFromRoom);
router.post("/generate-tenant-token",generateToken);
router.get("/validate-invite/:RID/:roomId", authMiddleware, validateInvite);


module.exports = router;
