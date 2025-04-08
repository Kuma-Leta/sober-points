const express = require("express");
const router = express.Router();
const { addRating ,getVenueRatings,updateRating, getRatingDistribution,verifyRating, deleteAllRatings} = require("../controllers/ratingController");
const { authenticate } = require("../middleware/authMiddleware");

router.post("/addRatings", authenticate, addRating);
router.put("/:ratingId", updateRating);
router.get("/distribution/:venueId",getRatingDistribution);
router.delete('/deleteAll',deleteAllRatings)
router.get("/:venueId/getRating",getVenueRatings)
router.patch("/verify/:ratingId/:venueId",verifyRating)

module.exports = router;   