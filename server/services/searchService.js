// services/searchService.js

const PG = require("../models/pgModel");

// ─── Helpers ────────────────────────────────────────────────────────────────

const CITY_PREFIX = {
  dehradun: "DEH",
  ddn:      "DEH",
  roorkee:  "ROO",
  rke:      "ROO",
  delhi:    "DEL",
  del:      "DEL",
  noida:    "NOI",
  gurgaon:  "GUR",
  gurugram: "GUR",
  meerut:   "MER",
};

const AMENITY_ALIASES = {
  wifi:     ["wifi", "wi-fi", "internet", "broadband"],
  ac:       ["ac", "air conditioning", "cooler"],
  parking:  ["parking", "bike", "vehicle", "car"],
  laundry:  ["laundry", "washing", "wash"],
  gym:      ["gym", "fitness", "workout"],
  tv:       ["tv", "television"],
  geyser:   ["geyser", "hot water", "heater"],
  fridge:   ["fridge", "refrigerator"],
};

const FOOD_WORDS  = ["food", "meal", "tiffin", "cooking", "kitchen", "mess"];
const PRICE_WORDS = {
  budget:  ["cheap", "affordable", "budget", "low"],
  premium: ["premium", "luxury", "expensive"],
};

function detectCity(keyword) {
  const kw = keyword.toLowerCase();
  for (const [alias, prefix] of Object.entries(CITY_PREFIX)) {
    if (kw.includes(alias)) return prefix;
  }
  return null;
}

function detectGender(keyword) {
  const kw = keyword.toLowerCase();
  if (/(boys?|male|gents|men|guys)/.test(kw))   return "boys";
  if (/(girls?|female|ladies|women)/.test(kw))  return "girls";
  if (/(both|unisex|coed|co-ed)/.test(kw))      return "both";
  return null;
}

function detectAmenities(keyword) {
  const kw = keyword.toLowerCase();
  return Object.entries(AMENITY_ALIASES)
    .filter(([, aliases]) => aliases.some((a) => kw.includes(a)))
    .map(([name]) => name);
}

function detectPriceRange(keyword) {
  const kw = keyword.toLowerCase();
  if (PRICE_WORDS.budget.some((w)  => kw.includes(w))) return "budget";
  if (PRICE_WORDS.premium.some((w) => kw.includes(w))) return "premium";
  return null;
}

function hasAvailableRoom(pg) {
  const capacityMap = { single: 1, double: 2, triple: 3, quad: 4 };
  return pg.rooms?.some((r) => {
    const cap = capacityMap[r.roomType] ?? 2;
    return (r.tenants?.length ?? 0) < cap;
  });
}

// ─── Scoring (runs on the filtered Mongo result set) ─────────────────────────

function scoreResult(pg, keyword) {
  let score = 0;
  const kw = keyword?.toLowerCase().trim() ?? "";

  // MongoDB text score (already filtered by relevance — amplify it)
  if (pg._textScore) score += pg._textScore * 20;

  // Name bonus
  if (pg.pgName?.toLowerCase().includes(kw)) score += 100;

  // Rating (0–30)
  if (pg.averageRatings?.overall) score += pg.averageRatings.overall * 6;

  // Plan tier
  if (pg.plan === "premium") score += 25;
  else if (pg.plan === "popular") score += 15;

  // Reviews
  if (pg.totalReviews > 10) score += 20;
  else if (pg.totalReviews > 5) score += 10;

  // Availability
  if (hasAvailableRoom(pg)) score += 15;

  // Food keywords
  if (FOOD_WORDS.some((fw) => kw.includes(fw))) {
    if (pg.foodAvailable)          score += 35;
    if (pg.selfCookingAllowed)     score += 25;
    if (pg.tiffinServiceAvailable) score += 25;
  }

  // Price range keywords
  const priceRange = detectPriceRange(kw);
  if (priceRange) {
    const minRent = Math.min(...(pg.rooms?.map((r) => r.rent) ?? [Infinity]));
    if (priceRange === "budget"  && minRent < 8000)  score += 40;
    if (priceRange === "premium" && minRent > 15000) score += 40;
  }

  return score;
}

// ─── Build the Mongo query from params ───────────────────────────────────────

function buildQuery(keyword, filters) {
  const query = {};

  // Full-text search (uses the index)
  if (keyword?.trim()) {
    query.$text = { $search: keyword.trim() };
  }

  // City — derived from keyword OR explicit filter param
  const cityPrefix = filters.city
    ? filters.city.toUpperCase().slice(0, 3)
    : detectCity(keyword ?? "");
  if (cityPrefix) {
    query.RID = { $regex: `^${cityPrefix}`, $options: "i" };
  }

  // Gender — derived from keyword OR explicit filter param
  const gender = filters.gender ?? detectGender(keyword ?? "");
  if (gender) {
    query.gender = gender === "boys" || gender === "girls"
      ? { $in: [gender, "both"] }
      : "both";
  }

  // Rent range
  if (filters.minRent || filters.maxRent) {
    query["rooms.rent"] = {};
    if (filters.minRent) query["rooms.rent"].$gte = Number(filters.minRent);
    if (filters.maxRent) query["rooms.rent"].$lte = Number(filters.maxRent);
  }

  // Room type
  if (filters.roomType) {
    query["rooms.roomType"] = filters.roomType.toLowerCase();
  }

  // Amenities (must have ALL requested amenities)
  const amenitiesFromKw = detectAmenities(keyword ?? "");
  const amenitiesFromFilter = filters.amenities
    ? (Array.isArray(filters.amenities)
        ? filters.amenities
        : filters.amenities.split(","))
    : [];
  const allAmenities = [...new Set([...amenitiesFromKw, ...amenitiesFromFilter])];
  if (allAmenities.length) {
    query.$and = allAmenities.map((a) => ({
      $or: [
        { amenities: { $regex: a, $options: "i" } },
        { "rooms.amenities": { $regex: a, $options: "i" } },
      ],
    }));
  }

  // Food
  if (filters.food === "true" || FOOD_WORDS.some((fw) => keyword?.toLowerCase().includes(fw))) {
    query.foodAvailable = true;
  }

  return query;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Search PGs with keyword + filters, return scored + sorted results.
 * @param {string} keyword
 * @param {object} filters  { city, gender, minRent, maxRent, roomType, amenities, food, sort }
 * @param {number} page     1-based
 * @param {number} limit
 */
async function searchPGs(keyword, filters = {}, page = 1, limit = 20) {
  const query = buildQuery(keyword, filters);
  const hasTextQuery = !!query.$text;

  const projection = hasTextQuery
    ? { score: { $meta: "textScore" } }
    : {};

  // Determine sort
  let sort = {};
  if (filters.sort === "rent_asc")   sort = { "rooms.rent": 1 };
  else if (filters.sort === "rent_desc") sort = { "rooms.rent": -1 };
  else if (filters.sort === "rating")    sort = { "averageRatings.overall": -1 };
  else if (hasTextQuery)             sort = { score: { $meta: "textScore" } };
  else                               sort = { "averageRatings.overall": -1, plan: -1, createdAt: -1 };

  const skip = (page - 1) * limit;

  const [pgs, total] = await Promise.all([
    PG.find(query, projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    PG.countDocuments(query),
  ]);

  // Attach text score for our own re-ranking
  const scored = pgs
    .map((pg) => ({ ...pg, _textScore: pg.score ?? 0, _searchScore: scoreResult(pg, keyword) }))
    .sort((a, b) => b._searchScore - a._searchScore);

  return {
    results: scored,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    hasMore: page * limit < total,
  };
}

/**
 * Featured PGs for the home page sliders.
 * Returns separate lists: verified, by city (DEH/ROO/DEL), by gender.
 */
async function getFeaturedPGs() {
  const base = { $sort: { plan: -1, "averageRatings.overall": -1 } };

  const [verified, dehradun, roorkee, delhi, girls, boys] = await Promise.all([
    PG.find({ isVerified: true  }).sort({ "averageRatings.overall": -1, plan: 1 }).limit(20).lean(),
    PG.find({ RID: /^DEH/i }).sort({ plan: -1, "averageRatings.overall": -1 }).limit(20).lean(),
    PG.find({ RID: /^ROO/i }).sort({ plan: -1, "averageRatings.overall": -1 }).limit(20).lean(),
    PG.find({ RID: /^DEL/i }).sort({ plan: -1, "averageRatings.overall": -1 }).limit(20).lean(),
    PG.find({ gender: { $in: ["girls", "both"] } }).sort({ plan: -1, "averageRatings.overall": -1 }).limit(20).lean(),
    PG.find({ gender: { $in: ["boys",  "both"] } }).sort({ plan: -1, "averageRatings.overall": -1 }).limit(20).lean(),
  ]);

  return { verified, dehradun, roorkee, delhi, girls, boys };
}

module.exports = { searchPGs, getFeaturedPGs };