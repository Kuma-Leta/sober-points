const Venue = require("../models/Venue");
// const User = require("../models/User");
const User = require("../models/user");
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

// 📌 Create Venue
exports.createVenue = async (req, res) => {
  // Handle file uploads using Multer
  upload(req, res, async (err) => {
    if (err) {
      // Handle Multer errors
      return res.status(400).json({ error: err.message });
    }

    try {
      const { name, description, address, phone, location, menu, website } =
        req.body; // Include website field
      const createdBy = req.user._id; // Assuming user ID is available in the request
      const userRole = req.user.role; // Assuming the user's role is stored in req.user.role

      // Validate required fields
      if (!name || !address || !phone || !location || !location.coordinates) {
        return res
          .status(400)
          .json({ error: "Please provide all required fields" });
      }

      // Get uploaded file paths (if any)
      let imageUrls = [];
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          // Save file paths in the desired format: uploads\\filename
          const relativePath = `uploads\\${file.filename}`;
          imageUrls.push(relativePath);
        });
      }

      // Determine if the venue should be verified based on the user's role
      const isVerified = userRole === "admin"; // Set to true if user is admin, otherwise false

      // Create venue
      const venue = new Venue({
        name,
        description,
        address,
        phone,
        location: {
          type: "Point",
          coordinates: location.coordinates, // [longitude, latitude]
        },
        images: imageUrls,
        menu,
        website: website && website.trim() !== "" ? website : null, // Handle optional website field
        createdBy,
        isVerified, // Set isVerified based on the user's role
      });

      // Save venue to the database
      await venue.save();

      // Return success response with message
      res.status(201).json({
        success: true,
        message: "Venue uploaded successfully!",
        venue,
      });
    } catch (error) {
      // Handle other errors
      res.status(400).json({ error: error.message });
    }
  });
};
// 📌 Get All Venues with Filtering, Sorting, Pagination
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
      description: venue.description,
      address: venue.address,
      phone: venue.phone,
      location: venue.location,
      images: venue.images,
      menu: venue.menu,
      website: venue.website,
      isVerified: venue.isVerified,
      reviews: venue.reviews,
      rating: venue.rating,
      createdAt: venue.createdAt,
      updatedAt: venue.updatedAt,
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
      const { venueId } = req.params; // Get the venue ID from the request parameters
      const { name, description, address, phone, location, menu, website } =
        req.body;

      // Parse removedImages from the request body
      let removedImages = [];
      if (req.body.removedImages) {
        removedImages = JSON.parse(req.body.removedImages); // Parse the JSON string
      }

      // Validate required fields
      if (!name || !address || !phone || !location || !location.coordinates) {
        return res
          .status(400)
          .json({ error: "Please provide all required fields" });
      }

      // Find the venue by ID
      const venue = await Venue.findById(venueId);
      if (!venue) {
        return res.status(404).json({ error: "Venue not found" });
      }

      // Delete removed images from the server
      if (removedImages.length > 0) {
        removedImages.forEach((imagePath) => {
          const fullPath = path.join(__dirname, "..", imagePath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath); // Delete the file
          }
        });
      }

      // Get uploaded file paths (if any)
      let imageUrls = venue.images || [];
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          const relativePath = `uploads\\${file.filename}`;
          imageUrls.push(relativePath);
        });
      }

      // Filter out removed images from the venue's images array
      if (removedImages.length > 0) {
        imageUrls = imageUrls.filter((image) => !removedImages.includes(image));
      }

      // Update venue fields
      venue.name = name;
      venue.description = description;
      venue.address = address;
      venue.phone = phone;
      venue.location = {
        type: "Point",
        coordinates: location.coordinates,
      };
      venue.images = imageUrls;
      venue.menu = menu;
      venue.website = website && website.trim() !== "" ? website : null;

      // Save the updated venue to the database
      await venue.save();

      // Return success response with message
      res.status(200).json({
        success: true,
        message: "Venue updated successfully!",
        venue,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
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
      $or: [{ address: { $regex: query, $options: "i" } }],
    };

    // Fetch matching venues
    const venues = await Venue.find(searchQuery).populate(
      "createdBy",
      "name email"
    );

    if (venues.length === 0) {
      return res.status(404).json({ message: "No matching venues found" });
    }

    res.status(200).json({ success: true, results: venues.length, venues });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    const { lat, lng, query } = req.query;

    // Validate latitude and longitude
    if (!lat || !lng) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude are required." });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    // Check if latitude and longitude are within valid ranges
    if (isNaN(latitude)) {
      return res.status(400).json({ message: "Invalid latitude value." });
    }
    if (isNaN(longitude)) {
      return res.status(400).json({ message: "Invalid longitude value." });
    }

    if (latitude < -90 || latitude > 90) {
      return res
        .status(400)
        .json({ message: "Latitude must be between -90 and 90." });
    }
    if (longitude < -180 || longitude > 180) {
      return res
        .status(400)
        .json({ message: "Longitude must be between -180 and 180." });
    }

    // MongoDB Geospatial Query
    let filter = {
      isVerified: true,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude], // Note: MongoDB expects [longitude, latitude]
          },
          // $maxDistance: 5000, // 5km radius (optional)
        },
      },
    };

    // If there's a query, search by name or description
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ];
    }

    const venues = await Venue.find(filter).limit(10).populate("reviews");

    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving venues" });
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
    const venues = await Venue.find({
      isVerified: true,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude], // Note: MongoDB expects [longitude, latitude]
          },
        },
      },
    }).limit(10); // Limit to 10 nearest venues

    res.status(200).json({ success: true, venues });
  } catch (error) {
    console.error("Error fetching nearest venues:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
