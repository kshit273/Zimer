// server/controllers/authController.js
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Referral = require("../models/referralModel");
const bcrypt = require("bcrypt");

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