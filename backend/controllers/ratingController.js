const Rating = require("../models/rating");
const Venue = require("../models/Venue");

// ✅ Add a new rating and review
exports.addRating = async (req, res) => {
  try {
    const { rating, review, venueId } = req.body;
    const userId = req.user.id; // Get user ID from auth middleware

    // Check if venue exists
    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    // Check if user has already reviewed the venue
    const existingReview = await Rating.findOne({ user: userId, venueId })
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this venue" });
    }

    // Create new rating
    const newRating = await Rating.create({
      rating,
      review,
      user: userId,
      venueId,
    })

    // Add rating to venue and update average rating
    venue.reviews.push(newRating._id);
    await venue.calculateAverageRating();

    res.status(201).json({ message: "Review added successfully", newRating, });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get all reviews for a venue
exports.getVenueRatings = async (req, res) => {
  try {
    const { venueId } = req.params;
console.log(venueId)
    const ratings = await Rating.find({ venueId }).populate(
      "user",
      "name email"
    );

    res.status(200).json({ ratings });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Update a user's rating (only the user who posted it can update)// Update a rating
exports.updateRating = async (req, res) => {
  try {
    const { ratingId } = req.params;
    const { rating, review } = req.body;
console.log("here is the raing body",req.body)
    // Find the rating by ID
    const existingRating = await Rating.findById(ratingId);
    if (!existingRating) {
      return res.status(404).json({ message: "Rating not found" });
    }

    // Update the rating
    existingRating.rating = rating;
    existingRating.review = review;
    await existingRating.save();

    // Populate the updated rating with user details
    const updatedRating = await Rating.findById(ratingId).populate(
      "user",
      "name"
    );

    res.status(200).json(updatedRating);
  } catch (error) {
    console.error("Error updating rating:", error);
    res.status(500).json({ message: "Error updating rating" });
  }
};

// ✅ Delete a user's rating (only the user who posted it can delete)
exports.deleteRating = async (req, res) => {
  try {
    const { ratingId } = req.params;
    const userId = req.user.id;

    const existingRating = await Rating.findOneAndDelete({
      _id: ratingId,
      user: userId,
    });
    if (!existingRating) {
      return res
        .status(404)
        .json({ message: "Review not found or unauthorized" });
    }

    // Remove the rating from the venue and recalculate rating
    const venue = await Venue.findById(existingRating.venueId);
    if (venue) {
      venue.reviews.pull(existingRating._id);
      await venue.calculateAverageRating();
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
