require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("./models/adminModel"); // adjust path if needed


mongoose.connect(process.env.MONGO_URI);

const seedAdmins = async () => {
  try {
    // Clear old admins (optional)
    await Admin.deleteMany();

    const adminsData = [
      {
        id: 1042,
        firstName: "Kshitij",
        lastName: "Sharma",
        dob: "2007-01-01",
        gender: "male",
        email: "admin1@roomease.com",
        phone: "9999999991",
        password: "admin123",
        managedPGs: [],
        managedArea: "Dehradun"
      },
      {
        id: 2084,
        firstName: "Rahul",
        lastName: "Verma",
        dob: "2000-05-12",
        gender: "male",
        email: "admin2@roomease.com",
        phone: "9999999992",
        password: "admin123",
        managedPGs: [],
        managedArea: "Delhi"
      },
      {
        id: 4069,
        firstName: "Priya",
        lastName: "Mehta",
        dob: "1998-08-20",
        gender: "female",
        email: "admin3@roomease.com",
        phone: "9999999993",
        password: "admin123",
        managedPGs: [],
        managedArea: "Noida"
      }
    ];

    // Hash passwords
    const hashedAdmins = await Promise.all(
      adminsData.map(async (admin) => ({
        ...admin,
        password: await bcrypt.hash(admin.password, 10)
      }))
    );

    await Admin.insertMany(hashedAdmins);

    console.log("✅ Admins seeded successfully!");
    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error seeding admins:", error);
    mongoose.disconnect();
  }
};

seedAdmins();