const mongoose = require("mongoose");
const { Schema } = mongoose;
const crypto = require("crypto");

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  company: { type: Schema.Types.ObjectId, ref: "Company"},
  username: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ["admin", "customer"],
    default: "customer",
  },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  verificationTokenExpires: { type: Date },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  notifications: [{ type: Schema.Types.ObjectId, ref: "Notification" }],
});

// Methods for tokens
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000;
  return resetToken;
};

userSchema.methods.createVerificationToken = function () {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  this.verificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  this.verificationTokenExpires = Date.now() + 30 * 60 * 1000;
  return verificationToken;
};

module.exports = mongoose.model("User", userSchema);
