import express from "express";
import User from "../model/user.model.js";
import tokenVerification from "../middleware/tokenVerification.js";

const router = express.Router();

/*
GET USER WISHLIST
*/
router.get("/", tokenVerification, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "likedProducts",
      "name description imageUrl selling_price mrp isInStock reviews",
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      likedProducts: user.likedProducts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
});

/*
LIKE / UNLIKE PRODUCT
*/
router.post("/:productId", tokenVerification, async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const exists = user.likedProducts.some((id) => id.toString() === productId);
    if (exists) {
      // If the product is already liked, remove it from the likedProducts array
      user.likedProducts = user.likedProducts.filter(
        (id) => id.toString() !== productId,
      );

      await user.save();

      return res.status(200).json({
        liked: false,
        message: "Removed from wishlist",
      });
    }

    user.likedProducts.push(productId);

    await user.save();

    return res.status(200).json({
      liked: true,
      message: "Added to wishlist",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
});

export default router;
