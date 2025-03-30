const express = require("express");
const router = express.Router();
const { addRating } = require("../controllers/ratingController");
const { authenticate, authorize } = require("../middleware/authMiddleware");
const {
  createVenue,
  getAllVenues,
  getVenueById,
  updateVenue,
  deleteVenue,
  getNearbyVenues,
  searchVenues,
  deleteAllVenues,
  verifyVenue,
  getVenueSuggestions,
  getMostRatedVenues,
  getNewestVenues,
  getNearestVenues,
  getUserVenues,
  getVenueDetails,
  getAdminDashboardAnalytics,
} = require("../controllers/venueController");

// 📌 Add Rating
router.get("/most-rated", getMostRatedVenues);
router.get("/newest", getNewestVenues);
router.get("/nearest", getNearestVenues);
router.post(
  "/create",
  authenticate,
  authorize(["admin", "customer"]),
  createVenue
);
router.post("/add-rating", authenticate, addRating);
router.get("/suggestions", getVenueSuggestions);
// 📌 Get Nearby Venues
router.get("/nearby", getNearbyVenues);

router.get("/my-venues", authenticate,  getUserVenues);
router.get(
  "/my-venue/:venueId",
  authenticate,
  getVenueDetails
);

// 📌 Search Venues
router.get("/search", searchVenues);

// 📌 Create Venue

// 📌 Verify Venue
router.patch("/:id/verify", authenticate, authorize(["admin"]), verifyVenue);

// 📌 Get All Venues
router.get("/", getAllVenues);

// 📌 Get Venue by ID
router.get("/:id", getVenueById);

// 📌 Update Venue
router.put(
  "/:venueId",
  authenticate,
  updateVenue
);

// 📌 Delete one Venue
router.delete(
  "/:id",
  authenticate,
  deleteVenue
);

// 📌 Delete All Venues
router.delete(
  "/",
  authenticate,
  authorize(["admin", "customer"]),
  deleteAllVenues
);

router.get(
  "/admin/analytics",
  authenticate,
  authorize(["admin", "customer"]),
  getAdminDashboardAnalytics
);

module.exports = router;
