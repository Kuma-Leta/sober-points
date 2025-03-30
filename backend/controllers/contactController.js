const nodemailer = require("nodemailer");
require("dotenv").config();

exports.sendContactEmail = async (req, res) => {
  const { firstName, lastName, email, phone, topic, message } = req.body;

  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.SYSTEM_OWNER_EMAIL, // Admin email
      subject: `New Contact Form Submission: ${topic}`,
      text: `
        Name: ${firstName} ${lastName}
        Email: ${email}
        Phone: ${phone}
        Topic: ${topic}
        Message: ${message}
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Your message has been sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
