const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema(
  {
    serviceRating: {
      type: Number,
      required: [true, "Service rating is required"],
      min: 1,
      max: 5,
    },
    locationRating: {
      type: Number,
      required: [true, "Location rating is required"],
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      trim: true,
      maxlength: [500, "Review cannot exceed 500 characters"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      required: true,
    },
  },
  { timestamps: true }
);

// Ensure a user can only review a venue once
RatingSchema.index({ user: 1, venueId: 1 }, { unique: true });

module.exports = mongoose.model("Rating", RatingSchema);
