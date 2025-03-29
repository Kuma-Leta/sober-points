const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/authMiddleware");
const {
  createNewsletter,
  sendNewsletter,

  getNewsletters,

  deleteNewsletter,
  getNewsletterById,
  updateNewsletter,
  createAndSendNewsletter,
} = require("../controllers/newsletterController");

// Admin-protected routes
router.use(authenticate, authorize("admin"));

router.route("/").post(createNewsletter).get(getNewsletters);

router.delete("/:id", deleteNewsletter);

router.route("/:id/send").post(sendNewsletter);
router.get("/:id", getNewsletterById);
router.put("/:id", updateNewsletter);
router.post("/create-and-send", createAndSendNewsletter);

module.exports = router;
