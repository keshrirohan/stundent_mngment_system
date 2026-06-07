"use client";
import React, { useEffect, useState } from "react";

import Card from "@/components/Card";

// Fix #19: Removed duplicate <Toaster /> — already rendered in layout.tsx
// Fix #19: Removed unused Navbar import — Navbar is rendered in layout.tsx

// ─── Product type definition ──────────────────────────────────────────────────
type Product = {
  _id: string;
  imageUrl: string[];
  name: string;
  description: string;
  reviews?: number;
  selling_price: number;
  mrp: number;
  isInStock: boolean;
};

const Home = () => {
  // All products fetched from the backend
  const [products, setProducts] = useState<Product[]>([]);

  // Search query entered by the user
  const [searchQuery, setSearchQuery] = useState("");

  // ─── Fetch all products on mount ───────────────────────────────────────────
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URI}/products/fetchdata`,
        );
        const data = await response.json();
        // Fix #18: backend now always returns 200 with an array, but guard here too
        setProducts(data.products ?? []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // ─── Client-side filtering ─────────────────────────────────────────────────
  // Filter products by name or description based on the search query.
  // This runs on every keystroke without any extra API calls.
  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true; // show all if search is empty
    return (
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      <h1 className="text-4xl font-bold text-center mt-10">
        Welcome to the Store
      </h1>
      <p className="text-center mt-4 text-gray-600">
        Discover our wide range of products and enjoy seamless shopping
        experience.
      </p>

      {/* ── Search Bar ─────────────────────────────────────────────────────── */}
      <div className="flex justify-center mt-6 px-4">
        <input
          id="product-search"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products by name or description…"
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-full shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          aria-label="Search products"
        />
      </div>

      {/* ── Search result count hint ───────────────────────────────────────── */}
      {searchQuery && (
        <p className="text-center text-sm text-gray-500 mt-2">
          {filteredProducts.length === 0
            ? "No products match your search."
            : `Showing ${filteredProducts.length} result${
                filteredProducts.length !== 1 ? "s" : ""
              } for "${searchQuery}"`}
        </p>
      )}

      {/* ── Product grid ──────────────────────────────────────────────────── */}
      <div className="flex flex-wrap justify-center gap-6 p-6">
        <Card products={filteredProducts} />
      </div>
    </div>
  );
};

export default Home;
