const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db");
const cookieParser = require("cookie-parser");

const authAndUserRoutes = require("./routes/authAndUserRoutes");
const pgRoutes = require("./routes/pgRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const rewardRoutes = require("./routes/rewardRoutes");
const referralRoutes = require("./routes/referralRoutes");
const verificationRoutes = require("./routes/verificationRoutes");
// const adminRoutes = require("./routes/adminRoutes"); // for later
const wishlistRoutes = require("./routes/wishlistRoutes");
const geocodeRoutes = require("./routes/geocode");

dotenv.config();
connectDB();
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // 👈 your frontend URL
    credentials: true, // 👈 allow cookies
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🔗 All Routes
app.use("/auth", authAndUserRoutes); // Done
app.use("/pgs", pgRoutes); // Done
app.use("/notifications", notificationRoutes);
app.use("/payment", paymentRoutes);
app.use("/rewards", rewardRoutes);
app.use("/referral", referralRoutes);
app.use("/verification", verificationRoutes); // No need ig
// app.use("/admin", adminRoutes); // enable later
app.use("/wishlist", wishlistRoutes);
app.use("/geocode", geocodeRoutes); // Done
app.use("/uploads", express.static("public/uploads")); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
