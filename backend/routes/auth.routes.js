import express from "express";
import User from "../model/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hashSync(password, 8);

  const user = await User.create({ name, email, password: hashedPassword });
  const token = await jwt.sign({ email, name }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  res
    .status(201)
    .json(
      { token, id: user._id, name: user.name, email: user.email },
      { message: "User registered successfully" },
    );
});

router.get("/check-auth", async (req, res) => {
  res.send("Authenticated");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const token = await jwt.sign(
    { email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  res
    .status(200)
    .json(
      { token, id: user._id, name: user.name, email: user.email },
      { message: "User logged in successfully" },
    );
});

router.get("/profile", async (req, res) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ id: user._id, name: user.name, email: user.email });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

router.post("/logout", (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  res.json({ message: "User logged out successfully" });
});

export default router;
