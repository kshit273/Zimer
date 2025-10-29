const PG = require("../models/pgModel");
const Invite = require("../models/inviteModel")
const { generateRID } = require("../middleware/ridService");
const crypto = require("crypto");

// GET all PGs
exports.getAllPGs = async (req, res) => {
  try {
    const pgs = await PG.find();
    res.json(pgs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch PGs" });
  }
};

// GET PG by ID
exports.getPGById = async (req, res) => {
  try {
    const pg = await PG.findOne({ RID: req.params.pgId }); 
    if (!pg) return res.status(404).json({ error: "PG not found" });
    res.json(pg);
  } catch (err) {
    res.status(500).json({ error: "Error getting PG" });
  }
};

// CREATE PG 
const organizeFiles = (files) => {
  const organized = {};
  
  if (!files || !Array.isArray(files)) return organized;
  
  files.forEach(file => {
    if (!organized[file.fieldname]) {
      organized[file.fieldname] = [];
    }
    organized[file.fieldname].push(file);
  });
  
  return organized;
};

const transformFormData = (formData, LID, files = {}) => {
  // Organize files by fieldname
  const organizedFiles = organizeFiles(files);
  
  console.log("Organized files:", Object.keys(organizedFiles)); // Debug log

  // Ensure rooms is an array
  let rooms = formData.rooms;
  if (typeof rooms === 'string') {
    try {
      rooms = JSON.parse(rooms);
    } catch (err) {
      rooms = [];
    }
  }
  
  // Ensure features is an array
  let features = formData.features || [];
  if (typeof features === 'string') {
    try {
      features = JSON.parse(features);
    } catch (err) {
      features = [];
    }
  }

  return {
    RID: "",
    pgName: formData.pgName,
    coverPhoto: organizedFiles.coverPhoto && organizedFiles.coverPhoto[0]
      ? `/uploads/${organizedFiles.coverPhoto[0].filename}`
      : null,
    otherPhotos: organizedFiles.otherPhotos
      ? organizedFiles.otherPhotos.map(p => `/uploads/${p.filename}`)
      : [],
    address: `${formData.address.line1}, ${formData.address.line2}, ${formData.address.landmark}, ${formData.address.city}, ${formData.address.state} - ${formData.address.pin}`,
    description: formData.description,
    amenities: [
      ...(Array.isArray(features) ? features : []), 
      ...(formData.otherFeatures ? 
        formData.otherFeatures.split(',').map(item => {
          const trimmed = item.trim();
          return trimmed ? trimmed.charAt(0).toUpperCase() + trimmed.slice(1) : '';
        }) : []
      )
    ].filter(Boolean),
    LID,
    gender: formData.pgType, 
    rooms: rooms.map((r, i) => ({
      roomId: r.id?.toString() || i.toString(),
      roomType: r.roomType?.toLowerCase() || '', 
      rent: Number(r.rent) || 0,
      security: r.security || r.rent,
      furnished: r.furnished?.toLowerCase() || '', 
      amenities: r.features || [],
      photos: organizedFiles[`roomPhotos_${i}`]
        ? organizedFiles[`roomPhotos_${i}`].map(p => `/uploads/${p.filename}`)
        : [],
      availableFrom: r.available ? new Date(r.availableFrom) : null,
      description: r.description || '',
    })),
    additionalInfo: formData.addInfo,
    rules: formData.rules ? 
      formData.rules.split(',').map(item => {
        const trimmed = item.trim();
        return trimmed ? trimmed.charAt(0).toUpperCase() + trimmed.slice(1) : '';
      }) : [], 
    foodAvailable: formData.foodAvailable === 'true', 
    foodDescription: formData.foodAvailabilityDesc,
    menu: organizedFiles.menuImage && organizedFiles.menuImage[0]
      ? [`/uploads/${organizedFiles.menuImage[0].filename}`]
      : [],
    selfCookingAllowed: formData.selfCooking === 'true',
    tiffinServiceAvailable: formData.tiffin === 'true',
    plan: "basic",
  };
};

exports.createPG = async (req, res) => {
  try {
    console.log("Files received:", req.files); // Debug log
    console.log("Body received:", req.body); // Debug log
    
    const formData = req.body;
    
    // Parse JSON strings
    if (typeof formData.address === "string") {
      formData.address = JSON.parse(formData.address);
    }
    
    const { address } = formData;

    if (!address || !address.city || !address.areaCode) {
      return res.status(400).json({ error: "City and area are required" });
    }

    const pgData = transformFormData(formData, req.user.id, req.files);
    console.log("Transformed PG data:", pgData); // Debug log
    
    const rid = await generateRID(address.city, address.areaCode);

    const newPG = new PG({
      ...pgData,
      RID: rid,
    });

    await newPG.save();
    res.status(201).json(newPG);
  } catch (err) {
    console.error("Full error:", err);
    res.status(400).json({ error: "Failed to create PG", details: err.message });
  }
};

// PUT update PG
exports.updatePG = async (req, res) => {
  try {
    const updated = await PG.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update PG" });
  }
};

exports.removeTenantsFromRoom = async (req, res) => {
  try {
    const { PGID, roomId, tenantIds } = req.body;

    // Validate input
    if (!PGID || !roomId || !tenantIds || !Array.isArray(tenantIds) || tenantIds.length === 0) {
      return res.status(400).json({ 
        error: "PGID, roomId, and tenantIds array are required" 
      });
    }

    const pg = await PG.findOne({ RID: PGID });
    
    if (!pg) {
      return res.status(404).json({ error: "PG not found" });
    }

    // Find the room in the PG
    const roomIndex = pg.rooms.findIndex(room => room.roomId === roomId);
    
    if (roomIndex === -1) {
      return res.status(404).json({ error: "Room not found in PG" });
    }

    // Get initial tenant count
    const initialCount = pg.rooms[roomIndex].tenants.length;

    // Remove tenants from the room's tenants array
    pg.rooms[roomIndex].tenants = pg.rooms[roomIndex].tenants.filter(
      tenant => !tenantIds.includes(tenant.tenantId.toString())
    );

    const removedCount = initialCount - pg.rooms[roomIndex].tenants.length;

    // Save the updated PG
    await pg.save();

    res.status(200).json({
      message: `Successfully removed ${removedCount} tenant(s) from room ${roomId}`,
      removedCount: removedCount,
      remainingTenants: pg.rooms[roomIndex].tenants.length
    });

  } catch (err) {
    console.error("Error removing tenants from room:", err);
    res.status(500).json({ 
      error: "Failed to remove tenants from room",
      details: err.message 
    });
  }
};

// DELETE PG
exports.deletePG = async (req, res) => {
  try {
    await PG.findByIdAndDelete(req.params.id);
    res.json({ message: "PG deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete PG" });
  }
};

// generate Token for tenant login into room
exports.generateToken = async (req, res) => {
  try {
    const { PGID, roomId } = req.body;

    // fetch PG using RID
    const pg = await PG.findOne({ RID: PGID });
    if (!pg) return res.status(404).json({ error: "PG not found" });

    const room = pg.rooms.find(r => r.roomId === roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });

    // calculate capacity
    let capacity;
    if (room.roomType === "single") capacity = 1;
    else if (room.roomType === "double") capacity = 2;
    else if (room.roomType === "triple") capacity = 3;
    else if (room.roomType === "quad") capacity = 4;
    else capacity = Infinity; // "other" = unlimited tenants

    const currentTenants = room.tenants.length;
    const maxJoins = capacity === Infinity ? null : capacity - currentTenants;

    if (maxJoins <= 0) {
      return res.status(400).json({ error: "Room is full" });
    }

    const token = crypto.randomBytes(16).toString("hex");

    const invite = new Invite({
      token,
      PGID: pg.RID,
      roomId,
      maxJoins,
      expiresAt: new Date(Date.now() + 7*24*60*60*1000), // 7 days
    });

    await invite.save();

    const inviteLink = `${process.env.BASE_URL}/join/${PGID}/${roomId}?token=${token}`;
    res.json({ inviteLink });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.validateInvite = async (req, res) => {
  try {
    const { RID, roomId } = req.params;
    const { token } = req.query;
    console.log(token);

    // 1. Validate invite token
    const invite = await Invite.findOne({ 
      roomId, 
      token, 
      expiresAt: { $gt: Date.now() },
      revoked: false 
    });
    
    if (!invite) {
      return res.status(400).json({ success: false, error: "Invalid or expired token" });
    }

    // 2. Find PG and room by RID
    const pg = await PG.findOne({ RID }).populate('LID');
    if (!pg) {
      return res.status(404).json({ success: false, error: "PG not found" });
    }

    const room = pg.rooms.find(r => r.roomId === roomId);
    if (!room) {
      return res.status(404).json({ success: false, error: "Room not found" });
    }

    // 3. Check room capacity
    let capacity;
    switch (room.roomType) {
      case "single": capacity = 1; break;
      case "double": capacity = 2; break;
      case "triple": capacity = 3; break;
      case "quad": capacity = 4; break;
      default: capacity = Infinity;
    }

    if (room.tenants.length >= capacity) {
      return res.status(400).json({ success: false, error: "Room is full" });
    }

    res.json({ 
      success: true, 
      pg: pg,
      room: room,
      availableSpots: capacity - room.tenants.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};



