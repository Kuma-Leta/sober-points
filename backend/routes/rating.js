const express = require("express");
const router = express.Router();
const { addRating ,getVenueRatings} = require("../controllers/ratingController");
const { authenticate } = require("../middleware/authMiddleware");
router.post("/giveRating", authenticate, addRating);
router.get("/:venueId/getRating",getVenueRatings)
module.exports = router;   