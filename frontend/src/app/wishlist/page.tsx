"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";

const wishlistItems = [
  {
    id: 1,
    name: "Wireless Gaming Headset",
    price: 2999,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    stock: true,
  },
  {
    id: 2,
    name: "Mechanical Keyboard",
    price: 4499,
    image:
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500",
    stock: true,
  },
  {
    id: 3,
    name: "Gaming Mouse",
    price: 1999,
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500",
    stock: false,
  },
];

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              My Wishlist
            </h1>
            <p className="text-zinc-400">
              {wishlistItems.length} items saved for later
            </p>
          </div>
        </div>

        {/* Empty State */}
        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Heart className="w-20 h-20 text-zinc-700" />
            <h2 className="text-2xl font-semibold mt-5">
              Your Wishlist is Empty
            </h2>
            <p className="text-zinc-400 mt-2">
              Save products you love and find them here.
            </p>

            <Link
              href="/products"
              className="mt-6 bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-zinc-200 transition"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <>
            {/* Wishlist Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="group bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-zinc-700 transition-all"
                >
                  {/* Product Image */}
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />

                    <button className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm p-2 rounded-full hover:bg-red-500 transition">
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-5">
                    <h3 className="font-semibold text-lg line-clamp-2">
                      {item.name}
                    </h3>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-2xl font-bold">
                        ₹{item.price.toLocaleString()}
                      </span>

                      {item.stock ? (
                        <span className="text-green-400 text-sm">
                          In Stock
                        </span>
                      ) : (
                        <span className="text-red-400 text-sm">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    <div className="flex gap-3 mt-5">
                      <button
                        disabled={!item.stock}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition ${
                          item.stock
                            ? "bg-white text-black hover:bg-zinc-200"
                            : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                        }`}
                      >
                        <ShoppingCart size={18} />
                        Add to Cart
                      </button>

                      <button className="p-3 rounded-xl border border-zinc-700 hover:bg-zinc-800 transition">
                        <Heart
                          size={20}
                          className="fill-red-500 text-red-500"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
              <div>
                <h3 className="font-semibold text-xl">
                  Ready to purchase?
                </h3>
                <p className="text-zinc-400">
                  Move your favorite items to cart and checkout.
                </p>
              </div>

              <button className="bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-zinc-200 transition">
                Add All To Cart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}