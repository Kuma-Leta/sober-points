const Favorite = require("../models/Favourite");
const Venue = require("../models/Venue");

const addFavorite = async (req, res) => {
  try {
    const { venueId } = req.body;
    const userId = req.user._id;

    // Check if the venue exists
    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    // Check if the favorite already exists
    const existingFavorite = await Favorite.findOne({ userId, venueId });
    
    if (existingFavorite) {
      return res.status(400).json({ message: "Venue already in favorites" });
    }

    // Create a new favorite
    const favorite = new Favorite({ userId, venueId });
    await favorite.save();

    res.status(200).json({ message: "Venue added to favorites" });
  } catch (error) {
    res.status(500).json({ message: "Failed to add to favorites", error });
  }
};
const removeFavorite = async (req, res) => {
  try {
    const { venueId } = req.body;
    console.log("here the venu id coming",venueId)
    const userId = req.user._id;

    // Delete the favorite
    const result = await Favorite.findOneAndDelete({ userId, venueId });
    if (!result) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    res.status(200).json({ message: "Venue removed from favorites" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove from favorites", error });
  }
};
const getFavourites = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all favorites for the user and populate venue details
    const favorites = await Favorite.find({ userId }).populate("venueId");

    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch favorites", error });
  }
};
module.exports={getFavourites ,removeFavorite,addFavorite}