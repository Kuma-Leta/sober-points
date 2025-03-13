const User = require("../models/user");
const bcrypt = require("bcryptjs");
const APIfeatures = require("../utils/APIfeatures");
const { v4: uuidv4 } = require("uuid");
const { sendEmail } = require("../utils/email");
// Create a new user
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
const generateDefaultPassword = () => {
  return uuidv4().replace(/-/g, "").substring(0, 8);
};

exports.createUser = async (req, res) => {
  try {
    const { email, name, role, password } = req.body;
    const baseUsername = getUsernameFromEmail(email);
    if (role === "super-user" && req.user.role !== "super-user") {
      return res
        .status(400)
        .json({ message: "You are not allowed to create a super user" });
    }
    const username = await generateUniqueUsername(baseUsername);
    const defaultPassword = generateDefaultPassword();
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    let user1 = await User.findOne({ email });
    if (user1) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = new User({
      ...req.body,
      password: hashedPassword,
      username,
    });

    await user.save();

    await sendEmail({
      email: user.email,
      subject: "You Have Been added to Project-X",
      message: `
        You have been added to Project-X, as ${role ? role : "<b>Customer</b>"}
        email: ${email}
        Username: ${username}
        Password: ${defaultPassword}
        You can also change your password here: ${
          process.env.FRONTEND_URL
        }/auth/forgot-password
      `,
    });

    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.createAdmin = async (req, res) => {
  const { email, name, role } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      user = await User.findOneAndUpdate(email);
      return res
        .status(400)
        .json({ message: "User already exists, and updated" });
    }
    const defaultPassword = generateDefaultPassword();
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    user = new User({
      email,
      name,
      password: hashedPassword,
      role: "super-user",
    });

    await user.save();
    await sendEmail({
      email: user.email,
      subject: "You Have Been added to Project-X",
      message: `
        You have been added to Project-X, as ${"<b>Super User</b> of the system"}
        email: ${email}
        Username: ${username}
        Password: ${defaultPassword}
        You can also change your password here: ${
          process.env.FRONTEND_URL
        }/auth/forgot-password
      `,
    });
    res.json({ user: { _id: user._id, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get all users
exports.getUsers = async (req, res) => {
  try {
    const { role } = req.user; // Assuming req.user contains authenticated user details

    let query;

    query = User.find().select("-__v");

    const features = new APIfeatures(query, req.query)
      .multfilter(["username", "name", "email", "address"])
      .filter()
      .sort()
      .limiting()
      .paginatinating();

    const totalRecords = await User.countDocuments(
      await features.query.getQuery()
    );

    const users = await features.query;

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    const limit = req.query.limit * 1 || 10;
    const totalPages = Math.ceil(totalRecords / limit);

    return res.status(200).json({
      totalPages,
      totalRecords,
      users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    const { role } = req.body;
    if (role === "super-user" && req.user.role !== "super-user") {
      return res
        .status(400)
        .json({ message: "You are not allowed to create a super user" });
    }
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { oldPassword, newPassword, ...updateData } = req.body;

    // If oldPassword is provided, handle password update
    if (oldPassword && newPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Old password is incorrect" });
      }
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // Update the user's data
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
