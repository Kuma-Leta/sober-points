// models/Venue.js
const mongoose = require("mongoose");

const VenueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Venue name is required"],
      trim: true,
      maxlength: [100, "Venue name cannot exceed 100 characters"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    latitude: {
      type: Number,
      required: [true, "Latitude is required"],
    },
    longitude: {
      type: Number,
      required: [true, "Longitude is required"],
    },
    images: {
      type: [String], // Array of image URLs
      default: [],
    },
    menu: {
      type: String, // Optional field for menu details or link
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false, // Admin can verify venue submissions
    },
  },
  { timestamps: true }
);

// Index for geospatial queries
VenueSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Venue", VenueSchema);
