const express = require("express");
const router = express.Router();

const { authenticate, authorize } = require("../middleware/authMiddleware");
const {
  createVenue,
  getAllVenues,
  getVenueById,
  updateVenue,
  deleteVenue,
  getNearbyVenues,
  deleteAllVenues,
  verifyVenue,
} = require("../controllers/venueController");

router.get("/nearby", getNearbyVenues);
// 📌 Create Venue
router.post("/", authenticate, authorize(["admin", "customer"]), createVenue);

// 📌 Verify Venue

router.patch("/:id/verify", authenticate, authorize(["admin"]), verifyVenue);
// 📌 Get All Venues
router.get("/", authenticate, getAllVenues);

// 📌 Get Venue by ID
router.get("/:id", authenticate, getVenueById);

// 📌 Update Venue
router.put(
  "/:venueId",
  authenticate,
  authorize(["admin", "Customer"]),
  updateVenue
);

// 📌 Delete one Venue
router.delete(
  "/:id",
  authenticate,
  authorize(["admin", "customer"]),
  deleteVenue
);
router.delete(
  "/",
  authenticate,
  authorize(["admin", "customer"]),
  deleteAllVenues
);

module.exports = router;
