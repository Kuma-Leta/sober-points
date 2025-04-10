const Venue = require("../models/Venue");
// const User = require("../models/User");
const User = require("../models/User");
const APIfeatures = require("../utils/APIfeatures");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// 📌 Create Venue

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads")); // Save files in the "uploads" directory
  },
  filename: function (req, file, cb) {
    // Generate a unique filename with the desired format: uploads\\timestamp-originalname
    const uniqueFilename = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueFilename); // Unique filename
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
}).array("images", 10); // Allow up to 10 images






exports.createVenue = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const {
        name,
        address,
        website,
        instagram,
        facebook,
        location,
        checklist,
        additionalInformation,
      } = req.body;

      // Validate required fields
      if (
        !name ||
        !address ||
        !location ||
        !location.coordinates ||
        !checklist
      ) {
        return res.status(400).json({
          error: "Name, address, location, and checklist are required",
        });
      }

      // Parse checklist (should be array of booleans)
      const parsedChecklist = JSON.parse(checklist);
      if (!Array.isArray(parsedChecklist) || parsedChecklist.length < 6 ) {
        return res.status(400).json({
          error: "Checklist must contain 6 items",
        });
      }

      // Handle image uploads
      let imageUrls = [];
      if (req.files && req.files.length > 0) {
        imageUrls = req.files.map((file) => `uploads/${file.filename}`);
      }

      // Create new venue
      const venue = new Venue({
        name,
        address,
        socialMedia: {
          website: website || "",
          instagram: instagram || "",
          facebook: facebook || "",
        },
        checklist: parsedChecklist,
        additionalInformation: additionalInformation || "",
        images: imageUrls,
        location: {
          type: "Point",
          coordinates: JSON.parse(location.coordinates),
        },
        createdBy: req.user._id,
        isVerified: req.user.role === "admin",
      });

      await venue.save();

      res.status(201).json({
        success: true,
        message: "Venue created successfully!",
        venue,
      });
    } catch (error) {
      console.error("Error creating venue:", error);
      res.status(500).json({
        error: "Server Error",
        message: error.message,
      });
    }
  });
};
exports.getAllVenues = async (req, res) => {
  try {
    let query = Venue.find().select("-__v");

    // Handle the `filter` query parameter for `isVerified` status
    if (req.query.filter === "verified") {
      query = query.where({ isVerified: true });
    } else if (req.query.filter === "unverified") {
      query = query.where({ isVerified: false });
    }

    // Apply APIfeatures for filtering, sorting, limiting, and pagination
    const features = new APIfeatures(query, req.query)
      .multfilter(["name", "address", "description"]) // Specify searchable fields
      .filter()
      .sort()
      .limiting()
      .paginatinating();

    // Fetch the total number of records for pagination
    const totalRecords = await Venue.countDocuments(
      await features.query.getQuery()
    );

    // Fetch the paginated and filtered venues
    const venues = await features.query.populate("createdBy", "name email");

    if (venues.length === 0) {
      return res.status(404).json({ message: "No venues found" });
    }

    // Calculate total pages based on total records and limit
    const limit = req.query.limit * 1 || 10;
    const totalPages = Math.ceil(totalRecords / limit);

    return res.status(200).json({
      totalPages,
      totalRecords,
      venues,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// 📌 Get Venue by ID
// 🔹 Get all venues created by the logged-in user
exports.getUserVenues = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is available in the request (from auth middleware)

    // Fetch venues created by the user
    const venues = await Venue.find({ createdBy: userId })
      .select("name images rating isVerified") // Select only necessary fields
      .lean();

    // Format the response
    const formattedVenues = venues.map((venue) => ({
      _id: venue._id,
      name: venue.name,
      image: venue.images[0] || null, // Use the first image or null if no images
      rating: venue.rating,
      status: venue.isVerified ? "Verified" : "Pending", // Status based on isVerified
    }));

    // Return success response with data
    res.status(200).json({ success: true, data: formattedVenues });
  } catch (error) {
    // Handle errors
    console.error("Error fetching user venues:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getVenueDetails = async (req, res) => {
  try {
    const { venueId } = req.params; // Venue ID from request params
    const userId = req.user._id; // Logged-in user ID

    // Fetch the venue and ensure it belongs to the user
    const venue = await Venue.findOne({
      _id: venueId,
      createdBy: userId,
    }).lean();

    if (!venue) {
      return res
        .status(404)
        .json({ success: false, message: "Venue not found" });
    }

    // Format the response
    const venueDetails = {
      _id: venue._id,
      name: venue.name,
      additionalInformation: venue?.additionalInformation,
      address: venue.address,

      location: venue?.location,
      images: venue?.images,
      checklist: venue?.checklist,

      website: venue?.socialMedia?.website,
      socialMedia: venue?.socialMedia,
      isVerified: venue?.isVerified,
      reviews: venue?.reviews,
      rating: venue?.rating,
      createdAt: venue?.createdAt,
      updatedAt: venue?.updatedAt,
    };

    // console.log("location:", venue.location);

    // Return success response with data
    res.status(200).json({ success: true, data: venueDetails });
  } catch (error) {
    // Handle errors
    console.error("Error fetching venue details:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getVenueById = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id).populate(
      "reviews",
      "user"
    );
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }
    res.json(venue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// // 📌 Update Venue

exports.updateVenue = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const { venueId } = req.params;
      const {
        name,
        address,
        website,
        instagram,
        facebook,
        location,
        checklist,
        additionalInformation,
        removedImages,
      } = req.body;

      // Find existing venue
      const venue = await Venue.findById(venueId);
      if (!venue) {
        return res.status(404).json({ error: "Venue not found" });
      }

      // Handle image updates
      let currentImages = venue.images || [];

      // Remove images marked for deletion
      if (removedImages) {
        const imagesToRemove = JSON.parse(removedImages);
        imagesToRemove.forEach((imagePath) => {
          const fullPath = path.join(__dirname, "..", imagePath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        });
        currentImages = currentImages.filter(
          (img) => !imagesToRemove.includes(img)
        );
      }

      // Add new images
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map((file) => `uploads/${file.filename}`);
        currentImages = [...currentImages, ...newImages];
      }

      // Update venue fields
      venue.name = name || venue.name;
      venue.address = address || venue.address;
      venue.socialMedia = {
        website: website || venue.socialMedia.website,
        instagram: instagram || venue.socialMedia.instagram,
        facebook: facebook || venue.socialMedia.facebook,
      };
      venue.images = currentImages;

      if (checklist) {
        const parsedChecklist = JSON.parse(checklist);
        if (Array.isArray(parsedChecklist)) {
          venue.checklist = parsedChecklist;
        }
      }

      venue.additionalInformation =
        additionalInformation || venue.additionalInformation;

      if (location && location.coordinates) {
        venue.location.coordinates = JSON.parse(location.coordinates);
      }

      await venue.save();

      res.json({
        success: true,
        message: "Venue updated successfully!",
        venue,
      });
    } catch (error) {
      console.error("Error updating venue:", error);
      res.status(500).json({
        error: "Server Error",
        message: error.message,
      });
    }
  });
};

// 📌 Delete Venue

exports.searchVenues = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    // Case-insensitive search across multiple fields using regex
   const searchQuery = {
     $or: [
       { name: { $regex: query, $options: "i" } },
       { address: { $regex: query, $options: "i" } },
       { description: { $regex: query, $options: "i" } },
     ],
     isVerified: true,
   };

    // Fetch matching venues
    const venues = await Venue.find(searchQuery).populate(
      "createdBy",
      "name email"
    );

    if (venues.length === 0) {
      return res.status(404).json({ message: "No venues found in this area" });
    }

    res.status(200).json({ success: true, results: venues.length, venues });
  } catch (error) {
    res.status(500).json({ error: "no search results" });
  }
};

exports.deleteVenue = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    // Allow deletion if the user is an admin or the creator of the venue
    if (
      req.user.role !== "admin" &&
      venue.createdBy.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this venue" });
    }

    await Venue.deleteOne({ _id: req.params.id }); // ✅ Correct way to delete
    res.json({ message: "Venue deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getNearbyVenues = async (req, res) => {
  try {
    const { lat, lng, query, page = 1, limit = 20 } = req.query;

    // Validate coordinates
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude))
      return res.status(400).json({ message: "Invalid latitude" });
    if (isNaN(longitude))
      return res.status(400).json({ message: "Invalid longitude" });
    if (latitude < -90 || latitude > 90)
      return res.status(400).json({ message: "Latitude out of range" });
    if (longitude < -180 || longitude > 180)
      return res.status(400).json({ message: "Longitude out of range" });

    // Base match query (excluding geospatial)
    const matchQuery = {};
    if (query) {
      matchQuery.$or = [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ];
    }

    // Using aggregation pipeline for proper geospatial handling
    const aggregation = [
      {
        $geoNear: {
          near: { type: "Point", coordinates: [longitude, latitude] },
          distanceField: "distance",
          spherical: true,
          maxDistance: 16000,
          query: matchQuery,
        },
      },
      { $skip: (parseInt(page) - 1) * parseInt(limit) },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "venue",
          as: "reviews",
        },
      },
    ];

    // Get count separately (since countDocuments doesn't work with $geoNear)
    const count = await Venue.countDocuments(matchQuery);
    const venues = await Venue.aggregate(aggregation);

    res.status(200).json({
      success: true,
      totalPages: Math.ceil(count / limit),
      totalRecords: count,
      count: venues.length,
      venues,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error retrieving venues",
      error: error.message,
    });
  }
};
exports.deleteAllVenues = async (req, res) => {
  try {
    // Delete all documents in the Venue collection
    const result = await Venue.deleteMany({});

    // Check if any venues were deleted
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No venues found to delete.",
      });
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} venues.`,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting venues.",
      error: error.message,
    });
  }
};
// PATCH /venues/:id/verify
exports.verifyVenue = async (req, res) => {
  try {
    const venue = await Venue.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );
    if (!venue) {
      return res.status(404).json({ error: "Venue not found" });
    }
    res.status(200).json({ success: true, venue });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAdminDashboardAnalytics = async (req, res) => {
  try {
    // 1. Venue Analytics
    const totalVenues = await Venue.countDocuments();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30); // Calculate date 30 days ago

    // New Venues in the Last 30 Days
    const newVenuesLast30Days = await Venue.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Venue Status Breakdown
    const verifiedVenues = await Venue.countDocuments({ isVerified: true });
    const pendingVenues = await Venue.countDocuments({ isVerified: false });

    // Simulate Rejected Venues
    const rejectedVenues = await Venue.countDocuments({
      isVerified: false,
      createdAt: { $lt: thirtyDaysAgo }, // Venues older than 30 days and not verified
    });

    const venueStatusBreakdown = [
      { status: "Verified", count: verifiedVenues },
      { status: "Pending", count: pendingVenues - rejectedVenues }, // Subtract rejected venues from pending
      { status: "Rejected", count: rejectedVenues },
    ];

    // Average Venue Rating
    const averageRatingResult = await Venue.aggregate([
      {
        $group: {
          _id: null, // Group all venues
          averageRating: { $avg: "$rating" }, // Calculate average rating
        },
      },
    ]);
    const averageRating = averageRatingResult[0]?.averageRating || 0;

    // 2. User Analytics
    const totalUsers = await User.countDocuments();

    const newUsersLast30Days = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    const userRoleBreakdown = await User.aggregate([
      {
        $group: {
          _id: "$role", // Group by role (user or admin)
          count: { $sum: 1 }, // Count users in each role
        },
      },
      {
        $project: {
          role: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    // Prepare the response
    const analytics = {
      venueAnalytics: {
        totalVenues,
        newVenuesLast30Days,
        venueStatusBreakdown,
        averageRating: averageRating.toFixed(1), // Round to 1 decimal place
      },
      userAnalytics: {
        totalUsers,
        newUsersLast30Days,

        userRoleBreakdown,
      },
    };

    // Send the response
    res.status(200).json({ success: true, data: analytics });
  } catch (error) {
    console.error("Error fetching admin dashboard analytics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin dashboard analytics",
    });
  }
};
// 📌 Controller: Fetch Venue Suggestions
exports.getVenueSuggestions = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 3) {
      return res
        .status(400)
        .json({ message: "Query must be at least 3 characters long" });
    }

    // Use MongoDB's $regex to find venues matching the query
    const suggestions = await Venue.find({
      isVerified: true,
      $or: [
        { name: { $regex: query, $options: "i" } }, // Case-insensitive search on name
        { address: { $regex: query, $options: "i" } }, // Case-insensitive search on address
      ],
    }).limit(10); // Limit to 10 suggestions

    if (suggestions.length === 0) {
      return res.status(404).json({ message: "No matching venues found" });
    }

    // Format the suggestions
    const formattedSuggestions = suggestions.map((venue) => ({
      name: venue.name,
      address: venue.address,
      location: venue.location.coordinates, // [longitude, latitude]
    }));

    res.status(200).json({ suggestions: formattedSuggestions });
  } catch (error) {
    console.error("Error fetching venue suggestions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// 📌 Controller: Fetch Most Rated Venues
exports.getMostRatedVenues = async (req, res) => {
  console.log("most rated");
  try {
    const venues = await Venue.find({ isVerified: true })
      .sort({ rating: -1 })
      .limit(10); // Sort by rating in descending order
    res.status(200).json({ success: true, venues });
  } catch (error) {
    console.error("Error fetching most rated venues:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📌 Controller: Fetch Newest Venues
exports.getNewestVenues = async (req, res) => {
  try {
    const venues = await Venue.find({ isVerified: true })
      .sort({ createdAt: -1 })
      .limit(10); // Sort by creation date in descending order
    res.status(200).json({ success: true, venues });
  } catch (error) {
    console.error("Error fetching newest venues:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📌 Controller: Fetch Nearest Venues
exports.getNearestVenues = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude are required." });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    // Validate latitude and longitude
    if (isNaN(latitude)) {
      return res.status(400).json({ message: "Invalid latitude value." });
    }
    if (isNaN(longitude)) {
      return res.status(400).json({ message: "Invalid longitude value." });
    }

    // MongoDB Geospatial Query
 const venues = await Venue.aggregate([
   {
     $geoNear: {
       near: {
         type: "Point",
         coordinates: [longitude, latitude], // [long, lat]
       },
       distanceField: "distance", // Adds a field with distance in meters
       maxDistance: 16000, // 16 km (in meters)
       query: { isVerified: true }, // Additional filters
       spherical: true, // Required for 2dsphere index
     },
   },
   { $limit: 20 },
 ]);// Limit to 20 nearest venues

    res.status(200).json({ success: true, venues });
  } catch (error) {
    console.error("Error fetching nearest venues:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


  const DEFAULT_IMAGE  = path.join(__dirname, '..', 'uploads', '1741502329403-france3.jpg.jpg'); // You'll need to define this

// Add this to your venue routes


// In your venueController.js
exports.bulkCreateVenues = async (req, res) => {
  try {
    const { venues } = req.body; // Array of venue objects
    const createdBy = req.user.id; // From authenticated user

    if (!Array.isArray(venues)) {
      return res.status(400).json({
        success: false,
        message: "Payload must contain an array of venues"
      });
    }

    // Default image path - adjust this to your actual default image
  

    // Process venues
    const venueDocs = venues.map(venueData => {
      return {
        name: venueData.name,
        address: venueData.address,
        location: {
          type: "Point",
          coordinates: [venueData.longitude, venueData.latitude]
        },
        images: [DEFAULT_IMAGE], // Set default image
        socialMedia: {
          website: venueData.website || ''
        },
        isVerified:true,
        additionalInformation: venueData.additionalInformation || '',
        createdBy,
        isVerified: false, // Default to unverified
        rating: 0,
        serviceRating: 0,
        locationRating: 0
      };
    });

    // Insert all venues
    const createdVenues = await Venue.insertMany(venueDocs);

    res.status(201).json({
      success: true,
      count: createdVenues.length,
      venues: createdVenues
    });

  } catch (error) {
    console.error("Bulk venue creation error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating venues in bulk",
      error: error.message
    });
  }
};