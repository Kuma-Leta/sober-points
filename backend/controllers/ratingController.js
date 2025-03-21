const Rating = require("../models/rating");
const Venue = require("../models/Venue");

// ✅ Add or update a rating and review
exports.addRating = async (req, res) => {
  try {
    const { serviceRating, locationRating, review, venueId } = req.body;
    const userId = req.user.id; // Get user ID from auth middleware

    // Validate rating values
    if (
      serviceRating < 1 ||
      serviceRating > 5 ||
      locationRating < 1 ||
      locationRating > 5
    ) {
      return res
        .status(400)
        .json({ message: "Ratings must be between 1 and 5" });
    }

    // Check if venue exists
    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    // Check if user has already reviewed the venue
    const existingReview = await Rating.findOne({ user: userId, venueId });

    if (existingReview) {
      // If the user has already reviewed the venue, update the existing review
      existingReview.serviceRating = serviceRating;
      existingReview.locationRating = locationRating;
      existingReview.review = review;
      await existingReview.save();

      // Update the venue's average ratings
      await venue.calculateAverageRatings();

      return res
        .status(200)
        .json({ message: "Review updated successfully", updatedRating: existingReview });
    } else {
      // If the user has not reviewed the venue, create a new review
      const newRating = await Rating.create({
        serviceRating,
        locationRating,
        review,
        user: userId,
        venueId,
      });

      // Add rating to venue and update average ratings
      venue.reviews.push(newRating._id);
      await venue.calculateAverageRatings();

      return res
        .status(201)
        .json({ message: "Review added successfully", newRating });
    }
  } catch (error) {
    console.error("Error in addRating:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// ✅ Get all reviews for a venue
exports.getVenueRatings = async (req, res) => {
  try {
    const { venueId } = req.params;
    const { page = 1, limit = 5 } = req.query;

    const ratings = await Rating.find({ venueId })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({ ratings });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Update a user's rating (only the user who posted it can update)// Update a rating
exports.updateRating = async (req, res) => {
  try {
    const { ratingId } = req.params;
    const { serviceRating, locationRating, review } = req.body;

    // Find the rating by ID
    const existingRating = await Rating.findById(ratingId);
    if (!existingRating) {
      return res.status(404).json({ message: "Rating not found" });
    }

    // Update the rating
    existingRating.serviceRating = serviceRating;
    existingRating.locationRating = locationRating;
    existingRating.review = review;
    await existingRating.save();

    // Populate the updated rating with user details
    const updatedRating = await Rating.findById(ratingId).populate(
      "user",
      "name"
    );

    // Update the venue's average ratings
    const venue = await Venue.findById(existingRating.venueId);
    if (venue) {
      await venue.calculateAverageRatings();
    }

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
const mongoose = require("mongoose");

exports.getRatingDistribution = async (req, res) => {
  try {
    const { venueId } = req.params;

    // Validate venueId format
    if (!mongoose.Types.ObjectId.isValid(venueId)) {
      return res.status(400).json({ message: "Invalid venue ID" });
    }

    // Fetch ratings from the database
    const ratings = await Rating.find({ venueId });
    const totalRatings = ratings.length;

    // Initialize distribution object
    const distribution = {
      5: { count: 0, percentage: "0%" },
      4: { count: 0, percentage: "0%" },
      3: { count: 0, percentage: "0%" },
      2: { count: 0, percentage: "0%" },
      1: { count: 0, percentage: "0%" },
    };

    if (totalRatings === 0) {
      return res
        .status(200)
        .json({ message: "No ratings yet", totalRatings, distribution });
    }

    // Categorize ratings into buckets
    ratings.forEach(({ serviceRating, locationRating }) => {
      const overallRating = (serviceRating + locationRating) / 2;

      if (overallRating >= 4.5) {
        distribution[5].count++;
      } else if (overallRating >= 3.5) {
        distribution[4].count++;
      } else if (overallRating >= 2.5) {
        distribution[3].count++;
      } else if (overallRating >= 1.5) {
        distribution[2].count++;
      } else {
        distribution[1].count++;
      }
    });

    // Calculate percentages
    for (let star in distribution) {
      const count = distribution[star].count;
      distribution[star].percentage =
        ((count / totalRatings) * 100).toFixed(1) + "%";
    }

    res.status(200).json({ totalRatings, distribution });
  } catch (error) {
    console.error("Error getting rating distribution:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.deleteAllRatings = async (req, res) => {
  try {
    // Delete all ratings from the database
    await Rating.deleteMany({});

    // Remove all rating references from venues
    await Venue.updateMany({}, { $set: { reviews: [] ,rating:0} });

    res.status(200).json({ message: "All ratings deleted successfully" });
  } catch (error) {
    console.error("Error deleting all ratings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// ✅ Get a user's review for a venue
exports.getUserReview = async (req, res) => {
  try {
    const { venueId } = req.params;
    const userId = req.user.id; // Get user ID from auth middleware

    // Find the user's review for the venue
    const userReview = await Rating.findOne({ user: userId, venueId }).populate(
      "user",
      "name email"
    );

    if (!userReview) {
      return res.status(404).json({ message: "No review found for this user" });
    }

    res.status(200).json(userReview);
  } catch (error) {
    console.error("Error fetching user review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};