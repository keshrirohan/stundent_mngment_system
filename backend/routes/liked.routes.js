import express from "express";
import User from "../model/user.model.js";
import jwt from "jsonwebtoken";
import tokenVerification from "../middleware/tokenVerification.js";

const router = express.Router();

router.get("/liked", tokenVerification, async (req, res) => {
  const decoded = req.user; // tokenVerification middleware attaches decoded token to req.user
  try {
    const user = await User.findById(decoded.id).populate(
      "likedProducts",
      "name imageUrl selling_price mrp",
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      likedProducts: user.likedProducts,
      message: "Liked products fetched successfully",
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

router.post("/liked/:productId", tokenVerification, async (req, res) => {
  const decoded = req.user; // tokenVerification middleware attaches decoded token to req.user
  const { productId } = req.params;
  try {
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Toggle like: if already liked, remove it; otherwise, add it
    const index = user.likedProducts.indexOf(productId);
    if (index > -1) {
      user.likedProducts.splice(index, 1); // Remove product from likedProducts
      await user.save();
      return res.json({ message: "Product unliked successfully" });
    } else {
      user.likedProducts.push(productId); // Add product to likedProducts
      await user.save();
      return res.json({ message: "Product liked successfully" });
    }
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
