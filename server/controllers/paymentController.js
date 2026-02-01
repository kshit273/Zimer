const Payment = require("../models/paymentModel");
const PG = require("../models/pgModel");
const Notification = require("../models/notificationModel");
const Tenant = require("../models/tenantModel")

// GET /payment/status/:id
exports.getPaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ error: "Payment not found" });
    res.json({ status: payment.status });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch payment status" });
  }
};

// POST /payment/confirm
exports.confirmPayment = async (req, res) => {
  const { paymentId, status } = req.body;
  try {
    const updated = await Payment.findOneAndUpdate(
      { paymentId },
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Payment not found" });
    res.json({ message: "Payment confirmed", updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to confirm payment" });
  }
};

// POST /payment/initiate
exports.payRent = async (req, res) => {
  try {
    const { pgId, roomId, amount, month } = req.body;
    const tenantId = req.user.id; // Assuming user info is in req.user from auth middleware

    // 1. Find the PG and specific room
    const pg = await PG.findOne({ RID: pgId });
    if (!pg) {
      return res.status(404).json({ success: false, message: "PG not found" });
    }

    const room = pg.rooms.find((r) => r.roomId === roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    // 2. Find the tenant in the room
    const tenant = room.tenants.find(
      (t) => t.tenantId.toString() === tenantId.toString()
    );
    if (!tenant) {
      return res.status(404).json({ 
        success: false, 
        message: "Tenant not found in this room" 
      });
    }

    // 3. Check if payment for this month already exists
    const existingPayment = tenant.payments.find((p) => p.month === month);
    if (existingPayment) {
      return res.status(400).json({ 
        success: false, 
        message: "Payment for this month already exists" 
      });
    }

    // 4. Create payment record in Payment collection
    const payment = await Payment.create({
      tenantId,
      pgId,
      amount,
      status: "success", // Set to success after payment gateway integration
      paymentId: `PAY_${Date.now()}_${tenantId}`, // Generate unique payment ID
    });

    // 5. Add payment to tenant's payment array in PG model
    tenant.payments.push({
      month,
      amount,
      paidOn: new Date(),
    });

    await pg.save();

    // 6. Get tenant details from User model
    const tenantDetails = await Tenant.findById(tenantId).select('firstName lastName name email phone');
    if (!tenantDetails) {
      return res.status(404).json({ 
        success: false, 
        message: "Tenant details not found" 
      });
    }

    // 7. Create notification for landlord
    const landlordId = pg.LID;
    
    const tenantName = tenantDetails.firstName && tenantDetails.lastName 
      ? `${tenantDetails.firstName} ${tenantDetails.lastName}`
      : tenantDetails.name || "Tenant";
    
    await Notification.create({
      type: "rent_paid",
      sender: tenantId,
      recipients: [
        {
          recipientId: landlordId,
          isRead: false,
        },
      ],
      pg: pgId,
      message: `${tenantName} of room ${roomId} has paid rent of ₹${amount} for ${month}`,
      status: "unread",
      metadata: {
        roomNumber: roomId,
        roomId: roomId,
        amount,
        paymentId: payment.paymentId,
        tenantName,
        tenantEmail: tenantDetails.email,
        tenantPhone: tenantDetails.phone,
      },
    });

    // 8. Send success response
    res.status(200).json({
      success: true,
      message: "Rent paid successfully",
      payment: {
        paymentId: payment.paymentId,
        amount: payment.amount,
        month,
        paidOn: tenant.payments[tenant.payments.length - 1].paidOn,
      },
    });
  } catch (error) {
    console.error("Error processing rent payment:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error processing payment", 
      error: error.message 
    });
  }
};

//GET /payment/history/:pgId/:roomId
exports.getPaymentHistory = async (req, res) => {
  try {
    const { pgId, roomId } = req.params;
    const tenantId = req.user.id;

    const pg = await PG.findById(pgId);
    if (!pg) {
      return res.status(404).json({ success: false, message: "PG not found" });
    }

    const room = pg.rooms.find((r) => r.roomId === roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    const tenant = room.tenants.find(
      (t) => t.tenantId.toString() === tenantId.toString()
    );
    if (!tenant) {
      return res.status(404).json({ 
        success: false, 
        message: "Tenant not found" 
      });
    }

    // Get all payments from Payment collection for this tenant and PG
    const payments = await Payment.find({
      tenantId,
      pgId,
      status: "success",
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      payments: tenant.payments,
      paymentRecords: payments,
    });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching payment history" 
    });
  }
};
