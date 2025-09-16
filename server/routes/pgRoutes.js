const express = require("express");
const router = express.Router();
const {
  getAllPGs,
  getPGById,
  createPG,
  updatePG,
  deletePG,
  generateToken,
  joinRoom,
} = require("../controllers/pgController");
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", getAllPGs);
router.get("/:pgId", getPGById);
router.post("/", upload.any(), authMiddleware, createPG);
router.put("/:id", updatePG);
router.delete("/:id", deletePG);
router.post("/generate-tenant-token",generateToken);
router.post("/join/:RID/:roomId", authMiddleware, joinRoom);


module.exports = router;
