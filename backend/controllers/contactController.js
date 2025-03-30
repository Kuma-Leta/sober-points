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
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
          <h2 style="text-align: center; color: #333;">📩 New Contact Request</h2>
          <hr style="border: none; height: 1px; background-color: #ddd;">
          <p style="font-size: 16px;"><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p style="font-size: 16px;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #007BFF;">${email}</a></p>
          <p style="font-size: 16px;"><strong>Phone:</strong> ${
            phone || "N/A"
          }</p>
          <p style="font-size: 16px;"><strong>Topic:</strong> ${topic}</p>
          <div style="background-color: #f9f9f9; padding: 10px; border-left: 4px solid #007BFF; margin: 10px 0;">
            <p style="font-size: 16px; margin: 0;"><strong>Message:</strong></p>
            <p style="font-size: 15px; margin: 0; color: #555;">${message}</p>
          </div>
          <hr style="border: none; height: 1px; background-color: #ddd;">
          <p style="text-align: center; color: #777; font-size: 14px;">This email was sent automatically from the contact form.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Your message has been sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
