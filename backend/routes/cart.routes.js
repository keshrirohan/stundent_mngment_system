import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get("/cart", async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).populate("carts");
    console.log("User's cart:", user); // Debugging log to verify cart contents
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
