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
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      validate: {
        validator: function (value) {
          // Basic phone number validation (e.g., +1234567890 or 123-456-7890)
          return /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
            value
          );
        },
        message: "Please provide a valid phone number",
      },
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
    website: {
      type: String,
      trim: true,
      validate: {
        validator: function (value) {
          // Allow empty string or valid URL
          if (value === "" || value === null) return true; // Allow empty or null
          return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(
            value
          );
        },
        message: "Please provide a valid website URL",
      },
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
    rating: {
      type: Number,
      max: 5,
      default: 0, // Overall average rating (will be updated dynamically)
    },
    serviceRating: {
      type: Number,
      max: 5,
      default: 0, // Average service rating (will be updated dynamically)
    },
    locationRating: {
      type: Number,
      max: 5,
      default: 0, // Average location rating (will be updated dynamically)
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rating", // Reference to Rating model
      },
    ],
  },
  { timestamps: true }
);

// 🔹 Index for geospatial queries
VenueSchema.index({ location: "2dsphere" });

// 🔹 Function to calculate average ratings when a new review is added
VenueSchema.methods.calculateAverageRatings = async function () {
  const venue = this;
  const ratings = await mongoose.model("Rating").find({ venueId: venue._id });

  if (ratings.length > 0) {
    const totalServiceRating = ratings.reduce(
      (sum, review) => sum + review.serviceRating,
      0
    );
    const totalLocationRating = ratings.reduce(
      (sum, review) => sum + review.locationRating,
      0
    );

    // Calculate average ratings
    venue.serviceRating = (totalServiceRating / ratings.length).toFixed(1);
    venue.locationRating = (totalLocationRating / ratings.length).toFixed(1);

    // Calculate overall rating as the average of service and location ratings
    venue.rating = (
      (parseFloat(venue.serviceRating) + parseFloat(venue.locationRating)) /
      2
    ).toFixed(1);
  } else {
    // If no reviews, reset all ratings to 0
    venue.serviceRating = 0;
    venue.locationRating = 0;
    venue.rating = 0;
  }

  await venue.save();
};

module.exports = mongoose.model("Venue", VenueSchema);
