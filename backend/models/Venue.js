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
    socialMedia: {
      website: { type: String, default: "" },
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
    },
    checklist: {
      type: [Boolean],
      required: true,
      validate: {
        validator: function (v) {
          return v.length >= 1; // Exactly 6 checklist items
        },
        message: "Checklist must contain exactly 6 items",
      },
    },
    additionalInformation: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      max: 5,
      default: 0,
    },
    serviceRating: {
      type: Number,
      max: 5,
      default: 0,
    },
    locationRating: {
      type: Number,
      max: 5,
      default: 0,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rating",
      },
    ],
  },
  { timestamps: true }
);

// Geospatial index
VenueSchema.index({ location: "2dsphere" });

// Rating calculation method
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

    venue.serviceRating = (totalServiceRating / ratings.length).toFixed(1);
    venue.locationRating = (totalLocationRating / ratings.length).toFixed(1);
    venue.rating = (
      (parseFloat(venue.serviceRating) + parseFloat(venue.locationRating)) /
      2
    ).toFixed(1);
  } else {
    venue.serviceRating = 0;
    venue.locationRating = 0;
    venue.rating = 0;
  }

  await venue.save();
};

module.exports = mongoose.model("Venue", VenueSchema);
