import User from "../models/user.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import {
  createPasswordResetToken,
  hashPasswordResetToken,
  isValidNewPassword,
} from "../utils/passwordReset.js";
import {
  isPasswordResetEmailConfigured,
  sendPasswordResetEmail,
} from "../utils/sendPasswordResetEmail.js";

const genericResetMessage =
  "If an account with that email exists, a password reset link will be sent.";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Register
export const register = async (req, res) => {
  const { name, email,phone, password, role } = req.body;

  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) return res.status(400).json({ message: "User exists" });

  // Hash the password before saving
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email: normalizedEmail,
    phone,
    password: hashedPassword,
    role,
  });

  res.json({
    token: generateToken(user),
    user
  });
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) return res.status(400).json({ message: "Invalid email or password." });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid email or password." });

  if (user.active === false) {
    return res.status(403).json({ message: "SUSPENDED" });
  }

  res.json({
    token: generateToken(user),
    user
  });
};

// Request a reset link. The response does not reveal whether an account exists.
export const forgotPassword = async (req, res) => {
  const email = typeof req.body.email === "string"
    ? req.body.email.trim().toLowerCase()
    : "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Enter a valid email address." });
  }

  if (!isPasswordResetEmailConfigured()) {
    return res.status(503).json({
      message: "Password reset email is not configured. Please contact the site administrator.",
    });
  }

  try {
    const user = await User.findOne({
      email: new RegExp(`^${escapeRegex(email)}$`, "i"),
    }).select("+passwordResetToken +passwordResetExpires");

    if (!user) return res.json({ message: genericResetMessage });

    const { token, tokenHash, expiresAt } = createPasswordResetToken();
    user.passwordResetToken = tokenHash;
    user.passwordResetExpires = expiresAt;
    await user.save();

    try {
      await sendPasswordResetEmail(user, token);
    } catch (error) {
      user.passwordResetToken = null;
      user.passwordResetExpires = null;
      await user.save();
      console.error("Password reset email delivery failed:", error.message);
      return res.status(503).json({
        message: "We could not send the reset email right now. Please try again later.",
      });
    }

    return res.json({ message: genericResetMessage });
  } catch (error) {
    console.error("Password reset request failed:", error.message);
    return res.status(500).json({ message: "Unable to process the password reset request." });
  }
};

// A reset token is single-use and expires after 30 minutes.
export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (typeof token !== "string" || !token.trim()) {
    return res.status(400).json({ message: "The reset link is invalid or expired." });
  }
  if (!isValidNewPassword(password)) {
    return res.status(400).json({ message: "Password must be between 8 and 128 characters." });
  }

  try {
    const user = await User.findOne({
      passwordResetToken: hashPasswordResetToken(token),
      passwordResetExpires: { $gt: new Date() },
    }).select("+passwordResetToken +passwordResetExpires");

    if (!user) {
      return res.status(400).json({ message: "The reset link is invalid or expired." });
    }

    user.password = await bcrypt.hash(password, await bcrypt.genSalt(10));
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    user.tokenVersion = (user.tokenVersion ?? 0) + 1;
    await user.save();

    return res.json({ message: "Your password has been reset. Please sign in with your new password." });
  } catch (error) {
    console.error("Password reset failed:", error.message);
    return res.status(500).json({ message: "Unable to reset the password right now." });
  }
};

// Change password for an authenticated account. Revokes all previous JWTs.
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!isValidNewPassword(newPassword)) {
    return res.status(400).json({ message: "New password must be between 8 and 128 characters." });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "Account not found." });

    const currentPasswordMatches = await bcrypt.compare(
      typeof currentPassword === "string" ? currentPassword : "",
      user.password
    );
    if (!currentPasswordMatches) {
      return res.status(400).json({ message: "Current password is incorrect." });
    }

    user.password = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    user.tokenVersion = (user.tokenVersion ?? 0) + 1;
    await user.save();

    return res.json({ message: "Password changed. Please sign in again." });
  } catch (error) {
    console.error("Password change failed:", error.message);
    return res.status(500).json({ message: "Unable to change the password right now." });
  }
};
