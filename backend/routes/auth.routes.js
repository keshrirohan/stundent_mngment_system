import express from "express";
import User from "../model/user.model.js";
import Order from "../model/order.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();

// ─── Helper ──────────────────────────────────────────────────────────────────
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ─── Register ─────────────────────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Fix #11: Input validation — was completely absent
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({ message: "Name must be at least 2 characters" });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  if (typeof password !== "string" || password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Fix #9: was bcrypt.hashSync (sync, blocks event loop) — now async
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({ name: name.trim(), email, password: hashedPassword });

    // Fix #10: JWT payload now includes id and role (was missing both)
    // Fix: removed incorrect `await` — jwt.sign() is synchronous
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Fix #13: secure is now env-conditional — was always true, broke local dev over HTTP
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    // Fix #4: res.json() now takes ONE object — was called with two args, second was silently dropped
    res.status(201).json({
      token,
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: "User registered successfully",
    });
  } catch (error) {
    // Fix #12: try/catch was completely absent — unhandled promise rejections on any DB error
    console.error("Register error:", error);
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
});

// ─── Check Auth ───────────────────────────────────────────────────────────────
// Fix #7: was returning "Authenticated" for ALL users including unauthenticated ones
router.get("/check-auth", (req, res) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ authenticated: false });
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ authenticated: true });
  } catch {
    res.status(401).json({ authenticated: false });
  }
});

// ─── Login ────────────────────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Fix #11: Input validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Security: generic message — do not reveal whether email exists
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Fix #10: JWT payload now includes id and role
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Fix #13: secure is now env-conditional
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    // Fix #4: merged into single res.json() call
    res.status(200).json({
      token,
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: "User logged in successfully",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed. Please try again." });
  }
});

// ─── Profile ──────────────────────────────────────────────────────────────────
router.get("/me", async (req, res) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Now includes role — required for AuthContext session hydration
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// ─── Logout ───────────────────────────────────────────────────────────────────
// Fix #8: was setting cookie to "null" string — cookie was NOT deleted
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ message: "User logged out successfully" });
});

// ─── My Orders ────────────────────────────────────────────────────────────────
// Returns all orders belonging to the authenticated user, with product details populated.
router.get("/my-orders", async (req, res) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const orders = await Order.find({ user: decoded.id }).populate(
      "products.product",
      "name imageUrl selling_price mrp"
    );
    res.json({ orders, message: "Orders fetched successfully" });
  } catch (error) {
    console.error("Fetch orders error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;

