import User from "../models/user.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

// Register
export const register = async (req, res) => {
  const { name, email,phone, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: "User exists" });

  // Hash the password before saving
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({ name, email,phone, password: hashedPassword, role });

  res.json({
    token: generateToken(user),
    user
  });
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
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
