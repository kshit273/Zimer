// server/controllers/authController.js
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Referral = require("../models/referralModel");
const bcrypt = require("bcrypt");
const pgModel = require("../models/pgModel");
const crypto = require("crypto");
const mongoose = require("mongoose");

const otpStore = new Map();

const sendWhatsAppOTP = async (phoneNumber, otp) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require("twilio")(accountSid, authToken);

  try {
    await client.messages.create({
      body: `Your OTP for password reset is: ${otp}. Valid for 10 minutes.`,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`, // e.g., whatsapp:+14155238886
      to: `whatsapp:${phoneNumber}`, // User's phone with country code
    });
    return true;
  } catch (error) {
    console.error("WhatsApp send error:", error);
    throw error;
  }
};

exports.sendOtp = async(req,res) =>{
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Store OTP with expiry (10 minutes)
    otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      attempts: 0,
    });

    // Send OTP via WhatsApp
    await sendWhatsAppOTP(user.phone, otp);

    // For development/testing - log OTP (REMOVE IN PRODUCTION)
    console.log(`OTP for ${email}: ${otp}`);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your registered mobile number",
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP. Please try again later.",
    });
  }
}

exports.verifyOtp = async(req,res) =>{
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // Check if OTP exists
    const otpData = otpStore.get(email);

    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or not found. Please request a new one.",
      });
    }

    // Check if OTP expired
    if (Date.now() > otpData.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Check attempt limit
    if (otpData.attempts >= 3) {
      otpStore.delete(email);
      return res.status(400).json({
        success: false,
        message: "Too many failed attempts. Please request a new OTP.",
      });
    }

    // Verify OTP
    if (otpData.otp !== otp) {
      otpData.attempts += 1;
      otpStore.set(email, otpData);
      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${3 - otpData.attempts} attempts remaining.`,
      });
    }

    // OTP verified successfully
    // Mark as verified but keep in store for password reset
    otpData.verified = true;
    otpStore.set(email, otpData);

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify OTP. Please try again.",
    });
  }
}

exports.resetPassword = async(req,res) =>{
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email and new password are required",
      });
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if OTP was verified
    const otpData = otpStore.get(email);

    if (!otpData || !otpData.verified) {
      return res.status(400).json({
        success: false,
        message: "OTP verification required before resetting password",
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update password (will be hashed by pre-save middleware)
    user.password = newPassword;
    await user.save();

    // Clear OTP from store
    otpStore.delete(email);

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset password. Please try again.",
    });
  }
}

exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      dob,
      gender,
      phone,
      role,
      password,
      referralCode,
    } = req.body;

    const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;

    // ✅ Check if email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // ✅ Create new user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      dob,
      gender,
      phone,
      password,
      role,
      profilePicture,
    });

    // ✅ Referral logic (optional field)
    if (referralCode) {
      const referral = await Referral.findOne({ code: referralCode });

      if (referral) {
        referral.invitedUsers.push(newUser._id);
        referral.bonusEarned += 50; // You can make this dynamic later
        await referral.save();
      }
    }

    // ✅ Create JWT token
    const token = jwt.sign(
      { 
        id: newUser._id,    
        name: newUser.name,    
        email: newUser.email,
        profilePicture: newUser.profilePicture,
        role: newUser.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: newUser._id,
        name: newUser.fullName,
        role: newUser.role,
        profilePicture: newUser.profilePicture,
      },
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: "Signup failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 🔐 Match password using method from userModel
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // ✅ Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 🎉 Success
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true, // prevents JS access
    secure: process.env.NODE_ENV === "production", // only https in production
    sameSite: "strict", // CSRF protection
  });
  return res.status(200).json({ message: "Logged out successfully" });
};

exports.clearTenantPG = async (req, res) => {
  try {
    const { tenantIds } = req.body;

    // Validate input
    if (!tenantIds || !Array.isArray(tenantIds) || tenantIds.length === 0) {
      return res.status(400).json({ 
        error: "tenantIds array is required" 
      });
    }

    // Clear currentPG field for all selected tenants
    const updateResult = await User.updateMany(
      { _id: { $in: tenantIds } },
      { $set: { currentPG: "" } }
    );

    console.log(`Updated ${updateResult.modifiedCount} users`);

    res.status(200).json({
      message: `Successfully cleared PG for ${updateResult.modifiedCount} tenant(s)`,
      modifiedCount: updateResult.modifiedCount
    });

  } catch (err) {
    console.error("Error clearing tenant PG:", err);
    res.status(500).json({ 
      error: "Failed to clear tenant PG",
      details: err.message 
    });
  }
};

exports.verifyToken = (req, res) => {
  const token = req.cookies.token; // 👈 read cookie
  if (!token)
    return res.status(401).json({ valid: false, message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ valid: true, user: decoded });
  } catch (error) {
    return res.status(401).json({ valid: false, message: "Invalid token" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, dob, gender, phone, email, password,profilePicture } =
      req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔐 If password change requested, check old password
    // if (newPassword) {
    //   const isMatch = await bcrypt.compare(oldPassword, user.password);
    //   if (!isMatch) {
    //     return res.status(401).json({ message: "Old password is incorrect" });
    //   }
    //   user.password = newPassword; // hashing is handled in User model's pre-save hook
    // }

    if (password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Password is incorrect" });
      }
    } else {
      return res.status(404).json({ message: "Password not provided" });
    }

    // ✅ Update allowed fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (dob) user.dob = dob;
    if (gender) user.gender = gender;
    if (phone) user.phone = phone;
    if (email) user.email = email;

    // Optional: profile picture update if using multer
    if (req.file) {
      user.profilePicture = `/uploads/${req.file.filename}`;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Update failed" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getTenantsBatch = async (req, res) => { 
  try {
    const { tenantIds } = req.body;

    // Validate input
    if (!tenantIds || !Array.isArray(tenantIds) || tenantIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "tenantIds array is required and cannot be empty"
      });
    }

    // Fetch tenants by IDs (assuming you're using MongoDB/Mongoose)
    const tenants = await User.find({
      _id: { $in: tenantIds }
    }).select('firstName lastName id phone'); 

    // Check if any tenants were not found
    const foundIds = tenants.map(tenant => tenant._id.toString());
    const notFoundIds = tenantIds.filter(id => !foundIds.includes(id));
    
    if (notFoundIds.length > 0) {
      console.warn(`Tenants not found: ${notFoundIds.join(', ')}`);
    }

    res.status(200).json({
      success: true,
      tenants,
      notFound: notFoundIds 
    });

  } catch (error) {
    console.error("Error fetching tenants in batch:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tenant data",
      error: error.message
    });
  }
};

exports.getSavedPGs = async(req, res) => {
  try {
    const userId = req.user?.id || req.user?._id; // Get userId from authenticated user
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "User not authenticated" 
      });
    }

    // Find user and get savedPGs
    const user = await User.findById(userId).select('savedPGs');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Fetch the full PG details
    const savedPGDetails = await pgModel.find({ 
      RID: { $in: user.savedPGs } 
    });

    // Fetch landlord details for each PG
    const pgsWithLandlordInfo = await Promise.all(
      savedPGDetails.map(async (pg) => {
        // Find landlord by LID
        const landlord = await User.findById(pg.LID).select('firstName lastName');
        
        // Convert mongoose document to plain object and add landlord info
        const pgObject = pg.toObject();
        pgObject.landlordName = landlord 
          ? `${landlord.firstName} ${landlord.lastName}`.trim()
          : 'Unknown';
        pgObject.landlordFirstName = landlord?.firstName || '';
        pgObject.landlordLastName = landlord?.lastName || '';
        
        return pgObject;
      })
    );

    return res.status(200).json({
      success: true,
      data: pgsWithLandlordInfo,
      count: pgsWithLandlordInfo.length
    });

  } catch (error) {
    console.error("Error fetching saved PGs:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch saved PGs",
      error: error.message
    });
  }
};

exports.postSavedPGs = async(req, res) => {
  try {
    const userId = req.user?.id || req.user?._id; // Get userId from authenticated user
    const { RID } = req.body; // Get RID from request body
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "User not authenticated" 
      });
    }

    if (!RID) {
      return res.status(400).json({ 
        success: false, 
        message: "PG ID (RID) is required" 
      });
    }

    // Check if PG exists
    const pgExists = await pgModel.findOne({ RID });
    if (!pgExists) {
      return res.status(404).json({ 
        success: false, 
        message: "PG not found" 
      });
    }

    // Find user
    const user = await User.findById(userId).select('savedPGs');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Check if PG is already saved
    const pgIndex = user.savedPGs.indexOf(RID);
    let message = '';
    
    if (pgIndex > -1) {
      // PG is already saved, remove it
      user.savedPGs.splice(pgIndex, 1);
      message = "PG removed from saved list";
    } else {
      // PG is not saved, add it
      user.savedPGs.push(RID);
      message = "PG added to saved list";
    }

    // Save the updated user
    await user.save();

    return res.status(200).json({
      success: true,
      message: message,
      savedPGs: user.savedPGs,
      count: user.savedPGs.length
    });

  } catch (error) {
    console.error("Error updating saved PGs:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update saved PGs",
      error: error.message
    });
  }
};

exports.updateLandlordPGs = async (req, res) => {
  try {
    const { ownedPGs } = req.body;
    const userId = req.user.id; // From authMiddleware

    // Validate input
    if (!ownedPGs || !Array.isArray(ownedPGs)) {
      return res.status(400).json({
        success: false,
        message: "ownedPGs must be an array"
      });
    }

    // Find the user and check if they exist
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if user has landlord role
    if (user.role !== "landlord") {
      return res.status(403).json({
        success: false,
        message: "Only landlords can own PGs"
      });
    }

    // Update the ownedPGs array
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        $set: { ownedPGs: ownedPGs }
      },
      { 
        new: true, // Return updated document
        runValidators: true // Run schema validation
      }
    ).select('-password'); // Exclude password from response

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Failed to update user"
      });
    }

    res.status(200).json({
      success: true,
      message: "Landlord PGs updated successfully",
      data: {
        user: updatedUser,
        ownedPGs: updatedUser.ownedPGs
      }
    });

  } catch (error) {
    console.error("Error updating landlord PGs:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

exports.getLandlordData = async (req, res) => {
  try {
    const { lid } = req.params;

    // Validate LID format (MongoDB ObjectId)
    if (!mongoose.Types.ObjectId.isValid(lid)) {
      return res.status(400).json({
        success: false,
        message: "Invalid landlord ID format",
      });
    }

    // Find the landlord by ID
    const landlord = await User.findById(lid).select(
      "firstName lastName email phone profilePicture role ownedPGs"
    );

    if (!landlord) {
      return res.status(404).json({
        success: false,
        message: "Landlord not found",
      });
    }

    // Verify the user is actually a landlord
    if (landlord.role !== "landlord") {
      return res.status(403).json({
        success: false,
        message: "User is not a landlord",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: landlord._id,
        name: `${landlord.firstName} ${landlord.lastName || ""}`.trim(),
        email: landlord.email,
        phone: landlord.phone,
        profilePicture: landlord.profilePicture,
        ownedPGs: landlord.ownedPGs,
      },
    });
  } catch (error) {
    console.error("Error fetching landlord data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch landlord data",
      error: error.message,
    });
  }
};