import express from "express";
import Product from "../model/product.model.js";
import isAdmin from "../middleware/isadmin.js";

const router = express.Router();

// ─── Add Product ──────────────────────────────────────────────────────────────
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

// ─── Fetch All Products ───────────────────────────────────────────────────────
// Fix #18: was returning 404 on empty array — frontend's setProducts(data.products) crashed
//          because data.products was undefined. Now always returns 200 with an array.
router.get("/fetchdata", async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ products, message: "Products fetched successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch products", error: error.message });
  }
});

// ─── Update Product ───────────────────────────────────────────────────────────
// Fix #24: removed ghost `price` field — it doesn't exist in the Product schema
router.put("/update_product/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, description, imageUrl, mrp, stock, selling_price } = req.body;
  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { name, description, imageUrl, mrp, stock, selling_price },
      { new: true },
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ product, message: "Product updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update product", error: error.message });
  }
});

// ─── Delete Product ───────────────────────────────────────────────────────────
router.delete("/delete_product/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete product", error: error.message });
  }
});

// ─── Search Products ──────────────────────────────────────────────────────────
// GET /products/search?query=<term>
// Performs a case-insensitive regex search on product names.
// The frontend currently uses client-side filtering (no extra API calls),
// but this route is available for future server-side or advanced search use.
router.get("/search", async (req, res) => {
  const { query } = req.query;

  // Return 400 if no query string was provided
  if (!query || typeof query !== "string") {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    // $options: "i" makes the regex case-insensitive
    const products = await Product.find({
      name: { $regex: query, $options: "i" },
    });
    res.json({ products, message: "Search completed successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to search products", error: error.message });
  }
});


export default router;
