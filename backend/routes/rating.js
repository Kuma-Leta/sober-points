const express = require("express");
const router = express.Router();
const { addRating ,getVenueRatings,updateRating, getRatingDistribution, deleteAllRatings} = require("../controllers/ratingController");
const { authenticate } = require("../middleware/authMiddleware");

router.post("/addRatings", authenticate, addRating);
router.get("/:venueId/getRating",getVenueRatings)
router.put("/:ratingId", updateRating);
router.get("/distribution/:venueId",getRatingDistribution);
router.delete('/deleteAll',deleteAllRatings)

module.exports = router;   