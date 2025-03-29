const Newsletter = require("../models/Newsletter");
const Subscriber = require("../models/Subscriber");
const { sendEmail } = require("../utils/email");

// Admin: Create a new newsletter draft
exports.createNewsletter = async (req, res) => {
  try {
    const { subject, content, scheduledAt } = req.body;

    const newsletter = await Newsletter.create({
      subject,
      content,
      scheduledAt: scheduledAt || null,
      createdBy: req.user._id, // Admin user from auth middleware
    });

    res.status(201).json({
      success: true,
      data: newsletter,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Admin: Send newsletter immediately
exports.sendNewsletter = async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);
    if (!newsletter) {
      return res.status(404).json({ error: "Newsletter not found" });
    }

    // Get active subscribers
    const subscribers = await Subscriber.find({ status: "active" });
    if (subscribers.length === 0) {
      return res.status(400).json({ error: "No active subscribers" });
    }

    // Send emails (batched for performance)
    const emailPromises = subscribers.map((subscriber) =>
      sendEmail({
        email: subscriber.email,
        subject: newsletter.subject,
        message: `
          ${newsletter.content}
          <p><a href="${process.env.BASE_URL}/unsubscribe?email=${subscriber.email}">
            Unsubscribe
          </a></p>
        `,
      })
    );

    await Promise.all(emailPromises);

    // Update newsletter record
    newsletter.status = "sent";
    newsletter.sentAt = new Date();
    newsletter.recipients = subscribers.map((s) => s._id);
    await newsletter.save();

    res.json({
      success: true,
      message: `Newsletter sent to ${subscribers.length} subscribers`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Admin: Schedule a newsletter
exports.scheduleNewsletter = async (req, res) => {
  try {
    const newsletter = await Newsletter.findByIdAndUpdate(
      req.params.id,
      {
        status: "scheduled",
        scheduledAt: req.body.scheduledAt,
      },
      { new: true }
    );

    res.json({
      success: true,
      data: newsletter,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Admin: Get all newsletters (for dashboard)
exports.getNewsletters = async (req, res) => {
  try {
    const newsletters = await Newsletter.find()
      .sort("-createdAt")
      .populate("createdBy", "name email");

    res.json({
      success: true,
      count: newsletters.length,
      data: newsletters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Admin: Get newsletter stats
exports.getNewsletterStats = async (req, res) => {
  try {
    const stats = await Newsletter.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          lastSent: { $max: "$sentAt" },
        },
      },
    ]);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
