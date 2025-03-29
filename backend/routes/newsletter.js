const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/authMiddleware");
const {
  createNewsletter,
  sendNewsletter,
  scheduleNewsletter,
  getNewsletters,
  getNewsletterStats,
} = require("../controllers/newsletterController");

// Admin-protected routes
router.use(authenticate, authorize("customer"));

router.route("/").post(createNewsletter).get(getNewsletters);

router.route("/stats").get(getNewsletterStats);

router.route("/:id/send").post(sendNewsletter);

router.route("/:id/schedule").put(scheduleNewsletter);

module.exports = router;
