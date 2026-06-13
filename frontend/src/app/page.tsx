"use client";
import React, { useEffect, useState } from "react";
import Card from "@/components/Card";

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
  const [products, setProducts] = useState<Product[]>([]);
  const [likedProductIds, setLikedProductIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URI}/products/fetchdata`
        );
        if (!response.ok) return;
        const data = await response.json();
        setProducts(data.products ?? []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchLikedIds = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URI}/liked`,
          { credentials: "include" }
        );
        if (!response.ok) return; // not logged in or error — just skip
        const data = await response.json();
        // Extract only IDs from the populated likedProducts array
        const ids = (data.likedProducts ?? []).map((p: Product) => p._id);
        setLikedProductIds(ids);
      } catch (error) {
        // User not logged in — silently ignore
      }
    };

    // Fetch both in parallel
    Promise.all([fetchProducts(), fetchLikedIds()]);
  }, []);

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen pt-16" style={{ background: "#09090b" }}>
      {/* Hero section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
          Welcome to the Store
        </h1>
        <p className="mt-3 text-zinc-400 text-base sm:text-lg max-w-xl mx-auto">
          Discover our wide range of products and enjoy a seamless shopping
          experience.
        </p>

        {/* Search */}
        <div className="flex justify-center mt-8 px-4">
          <div className="relative w-full max-w-md">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              id="product-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products…"
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-zinc-500 outline-none transition-all"
              style={{
                background: "#18181b",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
              }
              aria-label="Search products"
            />
          </div>
        </div>

        {/* Result count */}
        {searchQuery && (
          <p className="text-zinc-500 text-sm mt-3">
            {filteredProducts.length === 0
              ? "No products match your search."
              : `${filteredProducts.length} result${filteredProducts.length !== 1 ? "s" : ""} for "${searchQuery}"`}
          </p>
        )}
      </div>

      {/* Product grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-wrap justify-center gap-5">
          <Card products={filteredProducts} likedProductIds={likedProductIds} />
        </div>

        {/* Empty state */}
        {filteredProducts.length === 0 && !searchQuery && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <svg
                className="w-7 h-7 text-zinc-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <p className="text-white font-semibold">No products available</p>
            <p className="text-zinc-500 text-sm mt-1">
              Check back later for new arrivals.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;