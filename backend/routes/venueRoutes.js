const express = require("express");
const router = express.Router();

const { authenticate, authorize } = require("../middleware/authMiddleware");
const {
  createVenue,
  createVenues,
  getAllVenues,
  getVenueById,
  updateVenue,
  deleteVenue,
} = require("../controllers/venueController");

router.post("/test", createVenues);

// 📌 Create Venue
router.post("/", authenticate, authorize(["admin", "customer"]), createVenue);

// 📌 Get All Venues
router.get("/", authenticate, getAllVenues);

// 📌 Get Venue by ID
router.get("/:id", authenticate, getVenueById);

// 📌 Update Venue
router.put("/:id", authenticate, authorize(["admin", "Customer"]), updateVenue);

// 📌 Delete Venue
router.delete(
  "/:id",
  authenticate,
  authorize(["admin", "customer"]),
  deleteVenue
);

module.exports = router;
