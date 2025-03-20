const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  venueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Venue", // Reference to the Venue model
    required: true,
  },
});

// Ensure a user can only favorite a venue once
favoriteSchema.index({ userId: 1, venueId: 1 }, { unique: true });

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;
