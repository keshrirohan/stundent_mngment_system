import express from "express";
import Product from "../model/product.model.js";
import isAdmin from "../middleware/isadmin.js";
const router = express.Router();

router.post("/add", isAdmin, async (req, res) => {
  const { name, description, imageUrl, mrp, stock, selling_price } = req.body;
  try {
    const product = await Product.create({
      name,
      description,
      imageUrl,
      mrp,
      stock,
      selling_price,
    });
    res.status(201).json({ product, message: "Product added successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add product", error: error.message });
  }
});

router.get("/fetchdata", async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json({ products, message: "Products fetched successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch products", error: error.message });
  }
});

router.put("/update_product/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, description, price, imageUrl, mrp, stock, selling_price } =
    req.body;
  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { name, description, price, imageUrl, mrp, stock, selling_price },
      { new: true },
    );
    res.json({ product, message: "Product updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update product", error: error.message });
  }
});

router.delete("/delete_product/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndDelete(id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete product", error: error.message });
  }
});

router.get("/search", async (req, res) => {
  const { query } = req.query;
  try {
    const products = await Product.find({
      name: { $regex: query, $options: "i" }, // Case-insensitive search
    });
    res.json({ products, message: "Search completed successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to search products", error: error.message });
  }
});

export default router;
