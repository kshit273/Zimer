const PG = require("../models/pgModel");
const Admin = require("../models/adminModel");
const Tenant = require("../models/tenantModel");
const Br = require("../models/brModel");
const ZTRS = require("../models/ztrsModel");
const AdminNotification = require("../models/adminNotificationModel");
const Notification = require("../models/notificationModel");
const CPRNotification = require("../models/cprNotificationModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// GET /pgs — basic data for up to 30 PGs by RID array
// Expected body/query: { rids: ["RID1", "RID2", ...] }  (max 30)
const getPGs = async (req, res) => {
  try {
    // Accept RIDs from query params or body
    const rids = req.query.rids || req.query["rids[]"];

    if (!rids || !Array.isArray(rids) || rids.length === 0) {
      return res.status(400).json({ message: "Please provide an array of RIDs." });
    }

    if (rids.length > 30) {
      return res.status(400).json({ message: "Maximum 30 RIDs allowed per request." });
    }

    const pgs = await PG.find({ RID: { $in: rids } }).select(
      "RID pgName coverPhoto address rooms"
    );

    const result = pgs.map((pg) => {
      // Count rooms with no current tenants (empty rooms)
      let emptyRoomsCount = 0;
      let pendingRentCount = 0;

      pg.rooms.forEach((room) => {
        // Active tenants: those without a leaveDate (still residing)
        const activeTenants = room.tenants.filter((t) => !t.leaveDate);

        if (activeTenants.length === 0) {
          emptyRoomsCount++;
        }

        // Current month key e.g. "2025-06"
        const now = new Date();
        const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

        activeTenants.forEach((tenant) => {
          // Check if there's no payment entry for the current month
          const hasPaidThisMonth = tenant.payments.some(
            (p) => p.month === currentMonthKey
          );
          if (!hasPaidThisMonth) {
            pendingRentCount++;
          }
        });
      });

      return {
        RID: pg.RID,
        pgName: pg.pgName,
        coverPhoto: pg.coverPhoto,
        address: pg.address,
        emptyRoomsCount,
        pendingRentCount,
      };
    });

    return res.status(200).json({ pgs: result });
  } catch (error) {
    console.error("getPGs error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// GET /:pgId — full PG details by RID
const getPGDetails = async (req, res) => {
  try {
    const { pgId } = req.params;

    const pg = await PG.findOne({ RID: pgId }).populate(
      "LID",
      "firstName lastName email phone"
    );

    if (!pg) {
      return res.status(404).json({ message: `PG with RID '${pgId}' not found.` });
    }

    return res.status(200).json({ pg });
  } catch (error) {
    console.error("getPGDetails error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const getTenantData = async(req,res) =>{
  try{
    const {tenantId} = req.params;

    const tenant = await Tenant.findById(tenantId);

    if (!tenant){
      return res.status(404).json({message: `Tenant could not be found`});
    }

    return res.status(200).json({tenant});
  }catch(error){
    console.error("Error fetching tenant data :",error);
    return res.status(500).json({message:"Internal server error."});
  }
}

// POST /login — authenticate admin and return JWT + user data
// Body: { id: Number, password: String }
const adminLogin = async (req, res) => {
  try {
    const { id, password } = req.body;

    if (!id || !password) {
      return res.status(400).json({ message: "ID and password are required." });
    }

    const admin = await Admin.findOne({ id });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      {_id:admin._id, id: admin.id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
    });

    const userData = {
      _id: admin._id,
      id: admin.id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      phone: admin.phone,
      gender: admin.gender,
      managedArea: admin.managedArea,
      managedPGs: admin.managedPGs,
    };

    return res.status(200).json({ token, admin: userData });
  } catch (error) {
    console.error("adminLogin error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// GET /br — get all BR (booking requests) for the logged-in admin
// Admin _id is taken from req.user (set by auth middleware)
const getBRNotifications = async (req, res) => {
  try {
    const adminId = req.user._id;

    const brs = await Br.find({ receiver: adminId })
      .populate("sender", "firstName lastName")
      .sort({ reqTime: -1 });

    return res.status(200).json({ brs });
  } catch (error) {
    console.error("getBRNotifications error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// PUT /br — update response and resTime for a BR
// Body: { brId: String, response: String }
const updateBRResponse = async (req, res) => {
  try {
    const { brId, response } = req.body;

    if (!brId || !response) {
      return res.status(400).json({ message: "brId and response are required." });
    }

    const br = await Br.findById(brId);

    if (!br) {
      return res.status(404).json({ message: "Booking request not found." });
    }

    // Ensure only the intended admin can update
    if (br.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this request." });
    }

    br.response = response;
    br.resTime = new Date();
    await br.save();

    return res.status(200).json({ message: "BR updated successfully.", br });
  } catch (error) {
    console.error("updateBRResponse error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const getJRNotification = async (req, res) => {
  try {
    const adminId = req.user._id;

    // 1. Find the admin to get their managedPGs
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    const { managedPGs } = admin;
    if (!managedPGs || managedPGs.length === 0) {
      return res.status(200).json({ jrs: [] });
    }

    // 2. Fetch pending join_request notifications whose pg is in managedPGs
    const jrs = await Notification.find({
      type: "join_request",
      status: "pending",
      pg: { $in: managedPGs },
    })
      .populate("sender", "firstName lastName")
      .sort({ createdAt: -1 });

    return res.status(200).json({ jrs });
  } catch (error) {
    console.error("getJRNotification error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// POST /ztrs — create or update ZTRS for a tenant
// Body: { tenantId: String, RID: String, reason: String, ztrs: Number }
const postZTRS = async (req, res) => {
  try {
    const { tenantId, RID, reason, ztrs, notificationId } = req.body;

    if (!tenantId || !RID || !reason || ztrs === undefined) {
      return res
        .status(400)
        .json({ message: "tenantId, RID, reason, and ztrs are required." });
    }

    let ztrsDoc = await ZTRS.findOne({ tenantId });

    if (!ztrsDoc) {
      // Create new ZTRS record for tenant
      ztrsDoc = new ZTRS({
        tenantId,
        timeline: [{ RID, reason, ztrs }],
        finalScore: ztrs,
      });
    } else {
      // Append new entry to the timeline
      ztrsDoc.timeline.push({ RID, reason, ztrs });

      // Recalculate finalScore as average of all ztrs entries
      ztrsDoc.finalScore = ztrsDoc.timeline.reduce((sum, entry) => sum + entry.ztrs, 0) / ztrsDoc.timeline.length;
    }

    await ztrsDoc.save();

    // Update the leave notification status to accepted
    if (notificationId) {
      await Notification.findByIdAndUpdate(notificationId, { status: "accepted" });
    }

    return res.status(201).json({ message: "ZTRS posted successfully.", ztrs: ztrsDoc });
  } catch (error) {
    console.error("postZTRS error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// GET /notifications — get all notifications for the logged-in admin
const getNotifications = async (req, res) => {
  try {
    const adminId = req.user._id;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }
    const managedPGs = admin.managedPGs || [];

    const notifications = await AdminNotification.find({ recipient: adminId })
      .populate("sender", "firstName lastName email phone")
      .sort({ createdAt: -1 })
      .lean();

    const result = notifications.map((notif) => {
      const isImportant = notif.pg && managedPGs.includes(notif.pg);
      return {
        ...notif,
        important: !!isImportant,
      };
    });

    return res.status(200).json({ notifications: result });
  } catch (error) {
    console.error("getNotifications error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// GET /request-notifications — get all CPR notifications for the logged-in admin
const getRequestNotifications = async (req, res) => {
  try {
    const adminId = req.user._id;

    const cprNotifications = await CPRNotification.find({ recipient: adminId })
      .populate("sender", "firstName lastName email phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({ notifications: cprNotifications });
  } catch (error) {
    console.error("getRequestNotifications error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  getPGs,
  getPGDetails,
  adminLogin,
  getBRNotifications,
  updateBRResponse,
  postZTRS,
  getNotifications,
  getTenantData,
  getJRNotification,
  getRequestNotifications,
};