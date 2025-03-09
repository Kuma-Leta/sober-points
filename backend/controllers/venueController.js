const Venue = require("../models/Venue");
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
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
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
}).array("images", 5); // Allow up to 5 images

// 📌 Create Venue
exports.createVenue = async (req, res) => {
  // Handle file uploads using Multer
  upload(req, res, async (err) => {
    if (err) {
      // Handle Multer errors
      return res.status(400).json({ error: err.message });
    }

    try {
      const { name, description, address, location, menu } = req.body;
      const createdBy = req.user._id; // Assuming user ID is available in the request

      // Validate required fields
      if (!name || !address || !location || !location.coordinates) {
        return res
          .status(400)
          .json({ error: "Please provide all required fields" });
      }

      // Get uploaded file paths (if any)
      let imageUrls = [];
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          imageUrls.push(file.path); // Save file paths
        });
      }

      // Create venue
      const venue = new Venue({
        name,
        description,
        address,
        location: {
          type: "Point",
          coordinates: location.coordinates, // [longitude, latitude]
        },
        images: imageUrls,
        menu,
        createdBy,
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
    let query = Venue.find();

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
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// 📌 Get Venue by ID
exports.getVenueById = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }
    res.json(venue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Define the uploads directory
const uploadsDir = path.join(__dirname, "uploads");

// Create the uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// // Initialize the upload middleware
// const upload = multer({ storage: storage });

// // 📌 Update Venue
exports.updateVenue = async (req, res) => {
  upload.array("images", 5)(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "File upload failed", error: err.message });
    }
    try {
      const { name, description, address, location, menu } = req.body;

      // Find the venue
      const venue = await Venue.findById(req.params.id);
      if (!venue) {
        return res.status(404).json({ message: "Venue not found" });
      }

      // Check if the user is the creator of the venue
      if (venue.createdBy.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this venue" });
      }

      // Update venue fields
      venue.name = name || venue.name;
      venue.description = description || venue.description;
      venue.address = address || venue.address;
      venue.menu = menu || venue.menu;

      // Update location if provided
      if (location && location.coordinates) {
        venue.location = {
          type: "Point",
          coordinates: location.coordinates,
        };
      }

      // Update images if provided
      if (req.files && req.files.length > 0) {
        const imageUrls = req.files.map((file) => file.path);
        venue.images = [...venue.images, ...imageUrls];
      }

      const updatedVenue = await venue.save();
      res.json(updatedVenue);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
};

// 📌 Delete Venue
exports.deleteVenue = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    // Check if the user is the creator of the venue
    if (venue.createdBy.toString() !== req.user._id.toString()) {
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
