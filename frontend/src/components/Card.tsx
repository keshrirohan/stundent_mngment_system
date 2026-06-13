"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

type Product = {
  _id: string;
  imageUrl: string[];
  name: string;
  description: string;
  selling_price: number;
  mrp: number;
  isInStock: boolean;
};

type CardProps = {
  products?: Product[];
  likedProductIds?: string[];
  refreshWishlist?: () => void;
  isWishlistPage?: boolean;
};

const Card = ({
  products = [],
  likedProductIds = [],
  refreshWishlist,
  isWishlistPage = false,
}: CardProps) => {
  const router = useRouter();
  const { user } = useAuth();

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleLikedIds = () => {
      setLikedIds(
        new Set(
          isWishlistPage
            ? products.map((product) => product._id)
            : likedProductIds,
        ),
      );
    };
    handleLikedIds();
  }, [products, likedProductIds, isWishlistPage]);

  const toggleLike = async (
    productId: string,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.stopPropagation();

    if (!user) {
      router.push("/login");
      return;
    }

    const wasLiked = likedIds.has(productId);

    // Optimistic Update
    setLikedIds((prev) => {
      const next = new Set(prev);

      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }

      return next;
    });

    try {
      setLoadingId(productId);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/liked/${productId}`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update wishlist");
      }

      const data = await response.json();

      setLikedIds((prev) => {
        const next = new Set(prev);

        if (data.liked) {
          next.add(productId);
        } else {
          next.delete(productId);
        }

        return next;
      });

      if (refreshWishlist) {
        refreshWishlist();
      }
    } catch (error) {
      console.error(error);

      // Rollback
      setLikedIds((prev) => {
        const next = new Set(prev);

        if (wasLiked) {
          next.add(productId);
        } else {
          next.delete(productId);
        }

        return next;
      });
    } finally {
      setLoadingId(null);
    }
  };

  if (!products.length) {
    return (
      <div className="w-full text-center py-10 text-zinc-400">
        No Products Found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => {
        const isLiked = likedIds.has(product._id);

        return (
          <div
            key={product._id}
            onClick={() => router.push(`/products/${product._id}`)}
            className="cursor-pointer rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Product Image */}
            <div className="relative">
              <Image
                src={product.imageUrl?.[0] || "/placeholder.png"}
                alt={product.name}
                width={400}
                height={300}
                className="w-full h-56 object-cover"
              />

              {/* Heart Button */}
              <button
                onClick={(e) => toggleLike(product._id, e)}
                disabled={loadingId === product._id}
                className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm p-2 rounded-full disabled:opacity-50"
              >
                <Heart
                  className={`h-5 w-5 transition-all ${
                    isLiked ? "fill-red-500 text-red-500" : "text-white"
                  }`}
                />
              </button>

              {/* Discount */}
              {product.mrp > product.selling_price && (
                <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  {Math.round(
                    ((product.mrp - product.selling_price) / product.mrp) * 100,
                  )}
                  % OFF
                </span>
              )}

              {/* Stock */}
              <span
                className={`absolute bottom-3 left-3 text-xs font-medium px-2 py-1 rounded-full ${
                  product.isInStock
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {product.isInStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Content */}
            <div className="p-4">
              <h2 className="text-white font-semibold truncate">
                {product.name}
              </h2>

              <p className="text-zinc-400 text-sm mt-2 line-clamp-2">
                {product.description}
              </p>

              {/* Price */}
              <div className="flex items-center gap-2 mt-4">
                <span className="text-xl font-bold text-white">
                  ₹{product.selling_price.toLocaleString()}
                </span>

                {product.mrp > product.selling_price && (
                  <span className="text-zinc-500 line-through text-sm">
                    ₹{product.mrp.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="mt-5">
                {isWishlistPage ? (
                  <button
                    onClick={(e) => toggleLike(product._id, e)}
                    disabled={loadingId === product._id}
                    className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
                  >
                    {loadingId === product._id
                      ? "Removing..."
                      : "Remove From Wishlist"}
                  </button>
                ) : (
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="w-full py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition"
                  >
                    Add To Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Card;
