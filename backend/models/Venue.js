const mongoose = require("mongoose");

const VenueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Venue name is required"],
      trim: true,
      maxlength: [100, "Venue name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        validate: {
          validator: function (value) {
            return value.length === 2;
          },
          message:
            "Location must contain exactly two values: [longitude, latitude]",
        },
      },
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
