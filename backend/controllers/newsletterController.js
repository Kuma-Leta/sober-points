const Newsletter = require("../models/Newsletter");
const Subscriber = require("../models/Subscriber");
const { sendEmail } = require("../utils/email");
const APIfeatures = require("../utils/APIfeatures");

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

exports.createAndSendNewsletter = async (req, res) => {
  try {
    const { subject, content } = req.body;

    // 1. Create the newsletter
    const newsletter = await Newsletter.create({
      subject,
      content,
      createdBy: req.user._id,
    });

    // 2. Get active subscribers
    const subscribers = await Subscriber.find({ status: "active" });
    if (subscribers.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No active subscribers available",
      });
    }

    // 3. Send emails
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

    // 4. Update newsletter record
    newsletter.status = "sent";
    newsletter.sentAt = new Date();
    newsletter.recipients = subscribers.map((s) => s._id);
    await newsletter.save();

    res.status(201).json({
      success: true,
      message: `Newsletter created and sent to ${subscribers.length} subscribers`,
      data: newsletter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
// Admin: Schedule a newsletter
// Admin: Delete a newsletter
exports.deleteNewsletter = async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);

    if (!newsletter) {
      return res
        .status(404)
        .json({ success: false, error: "Newsletter not found" });
    }

    await newsletter.deleteOne(); // Deletes the newsletter

    res.status(200).json({
      success: true,
      message: "Newsletter deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Admin: Get all newsletters (for dashboard)
exports.getNewsletters = async (req, res) => {
  try {
    let query = Newsletter.find().populate("createdBy", "name email");

    // Apply filtering, sorting, pagination
    const features = new APIfeatures(query, req.query)
      .multfilter(["subject", "status"])
      .filter()
      .sort()
      .limiting()
      .paginatinating();

    const totalRecords = await Newsletter.countDocuments(
      await features.query.getQuery()
    );

    const newsletters = await features.query;

    if (newsletters.length === 0) {
      return res.status(404).json({ message: "No newsletters found" });
    }

    const limit = req.query.limit * 1 || 10;
    const totalPages = Math.ceil(totalRecords / limit);

    return res.status(200).json({
      success: true,
      totalPages,
      totalRecords,
      data: newsletters,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getNewsletterById = async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);
    if (!newsletter) {
      return res.status(404).json({ message: "Newsletter not found" });
    }
    res.json(newsletter);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update newsletter
exports.updateNewsletter = async (req, res) => {
  try {
    const { subject, content } = req.body;
    const newsletter = await Newsletter.findByIdAndUpdate(
      req.params.id,
      { subject, content },
      { new: true }
    );
    if (!newsletter) {
      return res.status(404).json({ message: "Newsletter not found" });
    }
    res.json(newsletter);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
