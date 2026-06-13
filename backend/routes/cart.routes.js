import express from "express";
import User from "../model/user.model.js";
import verifyToken from "../middleware/tokenVerification.js";

const router = express.Router();

router.get("/cart", verifyToken, async (req, res) => {
  try {
    const decoded = req.user; // Assuming verifyToken middleware sets req.user with the decoded token
    const userCart = await User.findById(decoded.id).populate("carts");
    console.log("User's cart:", userCart); // Debugging log to verify cart contents
    res.json(userCart || { carts: [] }); // Return user data with carts, or an empty array if user not found
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
