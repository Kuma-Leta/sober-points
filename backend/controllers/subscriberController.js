const Subscriber = require("../models/Subscriber");
const { sendEmail } = require("../utils/email");
// Add a new subscriber
exports.addSubscriber = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email already exists
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({
        error: "This email is already subscribed",
      });
    }

    // Create new subscriber with active status
    const subscriber = new Subscriber({
      email,
      status: "active",
    });

    await subscriber.save();

    // Send welcome email using the email utility
    await sendEmail({
      email: email,
      subject: "Thanks for subscribing!",
      message: `
        <p>Thank you for subscribing to our newsletter!</p>
        <p>You'll receive our latest updates and news.</p>
        <p><a href="${process.env.FRONTEND_URL}/subscriber/unsubscribe?email=${email}">
          Unsubscribe
        </a></p>
      `,
    });

    res.status(201).json({
      message: "Subscription successful!",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Unsubscribe a user
exports.unsubscribeSubscriber = async (req, res) => {
  const { email } = req.params;

  try {
    const subscriber = await Subscriber.findOne({ email });
    if (!subscriber) {
      return res.status(404).json({ message: "Subscriber not found." });
    }

    subscriber.status = "inactive";
    await subscriber.save();
    res.json({ message: "You have been unsubscribed." });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err });
  }
};

// Fetch all subscribers (Admin use)
exports.getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err });
  }
};

// Delete a subscriber (Admin use)
exports.deleteSubscriber = async (req, res) => {
  const { id } = req.params;

  try {
    await Subscriber.findByIdAndDelete(id);
    res.json({ message: "Subscriber deleted." });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err });
  }
};
