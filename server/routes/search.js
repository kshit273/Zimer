// routes/search.js

const express = require("express");
const router  = express.Router();
const { searchPGs, getFeaturedPGs } = require("../services/searchService");

// GET /pgs/search?q=boys+pg+dehradun&city=DEH&gender=boys&minRent=5000&maxRent=15000
//                &roomType=double&amenities=wifi,ac&food=true&sort=rating&page=1&limit=20
router.get("/search", async (req, res) => {
  try {
    const {
      q,
      city, gender, minRent, maxRent,
      roomType, amenities, food,
      sort,
      page  = 1,
      limit = 20,
    } = req.query;

    const filters = { city, gender, minRent, maxRent, roomType, amenities, food, sort };

    const data = await searchPGs(q ?? "", filters, Number(page), Number(limit));
    res.json(data);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Search failed. Please try again." });
  }
});

// GET /pgs/featured
router.get("/featured", async (req, res) => {
  try {
    const data = await getFeaturedPGs();
    res.json(data);
  } catch (err) {
    console.error("Featured error:", err);
    res.status(500).json({ error: "Failed to load featured listings." });
  }
});

module.exports = router;