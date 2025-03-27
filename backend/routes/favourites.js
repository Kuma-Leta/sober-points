const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favouriteController");
const {authenticate}  = require("../middleware/authMiddleware");

router.post("/add", authenticate, favoriteController.addFavorite);
router.post("/remove", authenticate, favoriteController.removeFavorite);
router.get("/", authenticate, favoriteController.getFavourites);

module.exports = router;
