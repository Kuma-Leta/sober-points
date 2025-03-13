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

      console.log("Removed Images:", removedImages);

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
      console.error("Error updating venue:", error); // Log the error
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

// 📌 Get Nearby Venues
exports.getNearbyVenues = async (req, res) => {
  try {
    const { lat, lng, query } = req.query;
    console.log(lat, lng, query);
    if (!lat || !lng) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude are required." });
    }

    // MongoDB Geospatial Query
    let filter = {
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: 5000, // 5km radius
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

    const venues = await Venue.find(filter).limit(10);

    res.status(200).json(venues);
  } catch (error) {
    console.error("Error fetching nearby venues:", error);
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
    console.error("Error deleting all venues:", error);
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
