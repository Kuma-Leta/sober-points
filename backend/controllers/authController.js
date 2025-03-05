const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { sendEmail } = require("../utils/email");
const crypto = require("crypto");
const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: "10h",
  });
};
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("access_token", token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Incorrect email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "invalid credentials" });
    }

    const userLog = { _id: user._id, role: user.role };
    createSendToken(userLog, 200, res);
    // res.json({ token: token, user: { _id: user._id, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//logout
exports.logoutUser = (req, res) => {
  res.cookie("access_token", "", {
    expires: new Date(0),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

const generateUniqueUsername = async (baseUsername) => {
  let username = baseUsername;
  let suffix = 1;

  while (await User.findOne({ username })) {
    username = `${baseUsername}${suffix}`;
    suffix++;
  }

  return username;
};
const getUsernameFromEmail = (email) => {
  const atIndex = email.indexOf("@");
  return atIndex !== -1 ? email.substring(0, atIndex) : email;
};

exports.register = async (req, res) => {
  const { email, name, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "Benutzer existiert bereits" });
    }
    const baseUsername = getUsernameFromEmail(email);
    const username = await generateUniqueUsername(baseUsername);

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      email,
      name,
      username,
      password: hashedPassword,
    });

    const verificationToken = user.createVerificationToken();
    const test = await user.save();

    // const userLog = { _id: user._id, role: user.role };
    // createSendToken(userLog, 200, res);

    // Send verification email (commented out for now)
    // const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?code=${verificationToken}`;
    // await sendEmail({
    //   email: user.email,
    //   subject: "Verify your email address",
    //   message: `Thank you for registering with SCIeLAB .To complete your registration, please verify your email address by clicking the link below: ${verificationUrl} \n`,
    // });

    res.status(201).json({
      message: "Registration successful!",
      data: test,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password").populate('company', 'name logo _id');
    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    let user = await User.findOne({ email }).select("-children -__v");

    if (!user || !user.password)
      return res.status(400).json({ message: "User doesn't exist" });

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Send reset password email with frontend URL
    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;

    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message: `You requested to reset your password. Please use the following link to reset your password: ${resetUrl}. If you did not request this, please ignore this email.`,
    });

    res.status(201).json({
      message: "Password reset token sent! Please check your email.",
    });
  } catch (error) {
    console.log(error);
    const user = await User.findOne({ email });
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500).json({
      message: "There was an error sending the email. Try again later.",
    });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    let user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Token is invalid or has expired" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
    await sendEmail({
      email: user.email,
      subject: "Your password has been reset",
      message: `Your password has been successfully reset, if it is not from you You can reset your password`,
    });

    const userLog = { _id: user._id, username: user.username, role: user.role };
    //  createSendToken(userLog, 200, res);

    res.status(201).json({
      message: "Your password has been reset! You can now login.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resendEmail = async (req, res) => {
  const { email, type } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }
    if (type === "reset-password") {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      const resetToken = user.createPasswordResetToken();
      await user.save({ validateBeforeSave: false });

      // Send reset password email with frontend URL
      const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;

      await sendEmail({
        email: user.email,
        subject: "Password Reset Request",
        message: `You requested to reset your password. Please use the following link to reset your password: ${resetUrl}. If you did not request this, please ignore this email.`,
      });

      res.status(201).json({
        message: "Password reset token sent! Please check your email.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "There was an error sending the email. Try again later.",
    });
  }
};
