import express from "express";

const router = express.Router();

router.get("/:id/cart", async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId).populate("cart.product"); // Populate product details in the cart
  res.json(user.cart);
});

export default router;
