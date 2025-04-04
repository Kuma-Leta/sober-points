// routes/routes.js
const express = require("express");
const router = express.Router();
const ratingRoutes = require("./rating");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/authMiddleware");
const venueRoutes = require("./venue");

const favouritesRoutes = require("./favourites");
const subscriberRoutes = require("./subscriber");
const newsletterRoutes = require("./newsletter");
const blogRoutes = require("./blog");
const contactRoutes=require("./contact")
// Authentication route
router.post("/login", authController.login);
router.get("/logout", authController.logoutUser);
router.post("/register", authController.register);
router.get('/auth/verify-email/:token', authController.verifyEmail);
router.post("/auth/forgot-password", authController.forgotPassword);
router.post("/auth/reset-password/:token", authController.resetPassword);
router.post("/auth/resend-email", authController.resendEmail);
// router.post('/auth/verify-email', authenticate, authController.resendEmail);
router.post("/auth/google", authController.googleLogin);
router.post("/auth/google/register", authController.googleRegister);
router.get("/me", authenticate, authController.me);

router.put(
  "/profile-picture/:userId",
  authenticate,
  authorize(["admin", "customer"]),
  userController.updateProfilePicture
);

router.put(
  "/users/:userId",
  authenticate,
  authorize(["admin", "customer"]),
  userController.updateUserName
);
// Route to fetch and display the user's profile picture
router.get(
  "/profile-picture/:userId",
  authenticate,
  authorize(["admin", "customer"]),
  userController.getProfilePicture
);
// User routes
router.post(
  "/users",
  authenticate,
  authorize(["admin", "super-user"]),
  userController.createUser
);

router.post(
  "/create-admin",
  authenticate,
  authorize(["super-user"]),
  userController.createAdmin
);
router.get(
  "/users",
  authenticate,
  authorize(["admin", "super-user"]),
  userController.getUsers
);
router.put("/update", authenticate, userController.updateAccount);

router.get(
  "/users/:id",
  authenticate,
  authorize(["admin", "super-user"]),
  userController.getUserById
);
router.put(
  "/users/:id",
  authenticate,
  authorize(["admin", "super-user"]),
  userController.updateUser
);
router.delete(
  "/users/:id",
  authenticate,
  authorize(["admin", "super-user"]),
  userController.deleteUser
);

router.use("/venues", venueRoutes); // <-- Add this line
router.use("/ratings", ratingRoutes);
router.use("/favorites", favouritesRoutes);
router.use("/subscriber", subscriberRoutes);
router.use("/newsletter", newsletterRoutes);
router.use("/contact",contactRoutes)
router.use("/newsletters", newsletterRoutes);
// Venues

// blog
router.use("/blogs", blogRoutes);
module.exports = router;
