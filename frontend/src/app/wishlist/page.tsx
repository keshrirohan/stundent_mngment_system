"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";

export default function WishlistPage() {
  const [likedProducts, setLikedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Moved outside useEffect so it can be passed as a prop to Card
  const fetchWishlist = async () => {
    try {
      console.log("Fetching wishlist..."); // Debugging log to indicate fetch is starting
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/liked`,
        {
          credentials: "include",
        },
      );

      const data = await response.json();
      console.log("Fetched liked products:", data); // Debugging log to verify fetched data

      if (response.ok) {
        setLikedProducts(data.likedProducts || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleFetchWishlist = () => {
      fetchWishlist();
    };

    handleFetchWishlist();
  }, []);

  if (loading) {
    return <div className="pt-24 text-center text-white">Loading...</div>;
  }

  return (
    <div className="pt-24 px-5">
      <h1 className="text-3xl font-bold text-white mb-8">My Wishlist ❤️</h1>

      {likedProducts.length === 0 ? (
        <div className="text-center text-zinc-400">No products in wishlist</div>
      ) : (
        <Card
          products={likedProducts}
          refreshWishlist={fetchWishlist}
          isWishlistPage={true}
        />
      )}
    </div>
  );
}
