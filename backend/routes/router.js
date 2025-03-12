// routes/routes.js
const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const { authenticate, authorize } = require("../middleware/authMiddleware");
const venueRoutes = require("./venue");
const ratingRoutes = require("./rating");

// Authentication route
router.post("/login", authController.login);
router.get("/logout", authController.logoutUser);
router.post("/register", authController.register);
// router.get('/auth/verify-email/:token', authController.verifyEmail);
router.post("/auth/forgot-password", authController.forgotPassword);
router.post("/auth/reset-password/:token", authController.resetPassword);
router.post("/auth/resend-email", authController.resendEmail);
// router.post('/auth/verify-email', authenticate, authController.resendEmail);
router.get("/me", authenticate, authController.me);

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

//companies
router.use("/companies", require("./company"));
router.use("/venues", venueRoutes); // <-- Add this line
router.use("/ratings", ratingRoutes);

// Venues
module.exports = router;
