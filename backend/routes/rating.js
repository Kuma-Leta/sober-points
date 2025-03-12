const express = require("express");
const router = express.Router();
const { addRating } = require("../controllers/ratingController");
const { authenticate } = require("../middleware/authMiddleware");
router.post("/:venueId/rate", authenticate, addRating);
module.exports = router;   