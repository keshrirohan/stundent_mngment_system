"use client";

import React, { useEffect, useState } from "react";
import Card from "@/components/Card";

export default function WishlistPage() {
  const [likedProduct, setLikedProduct] = useState([]);

  useEffect(() => {
    const fetchLikedProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URI}/auth/liked`,
          { credentials: "include" },
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Liked products fetched:", data.likedProducts);
          setLikedProduct(data.likedProducts ?? []);
        }
      } catch (error) {
        console.error("Error fetching liked products:", error);
      }
    };
    fetchLikedProducts();
  }, [likedProduct]);

  return (
    <div className="flex flex-wrap justify-center gap-5">
      <Card products={likedProduct} />
    </div>
  );
}
