const Venue = require("../models/Venue");
const APIfeatures = require("../utils/APIfeatures");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

exports.createVenues = async (req, res) => {
  try {
    const { name, description, address, location, menu } = req.body;

    // Validate required fields
    if (!name || !address || !location || !location.coordinates) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }

    // Upload images to the server (if provided)
    let imageUrls = [];
    if (req.files && req.files.images) {
      const files = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];
      files.forEach((file) => {
        imageUrls.push(file.path);
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
    });

    await venue.save();
    res.status(201).json(venue);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 📌 Create Venue
exports.createVenue = async (req, res) => {
  try {
    const { name, description, address, location, menu } = req.body;
    const createdBy = req.user._id; // Assuming user ID is available in the request

    // Validate required fields
    if (!name || !address || !location || !location.coordinates) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }

    // Upload images to the server (if provided)
    let imageUrls = [];
    if (req.files && req.files.images) {
      const files = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];
      files.forEach((file) => {
        imageUrls.push(file.path);
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

    await venue.save();
    res.status(201).json(venue);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Initialize the upload middleware
const upload = multer({ storage: storage });

// 📌 Update Venue
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

    await venue.remove();
    res.json({ message: "Venue deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
