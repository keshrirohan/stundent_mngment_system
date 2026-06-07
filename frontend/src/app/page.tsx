"use client";
import React, { useEffect } from "react";

import Card from "@/components/Card";

// Fix #19: Removed duplicate <Toaster /> — already rendered in layout.tsx
// Fix #19: Removed unused Navbar import — Navbar is rendered in layout.tsx

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
  const [products, setProducts] = React.useState<Product[]>([]);

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

  return (
    <div>
      <h1 className="text-4xl font-bold text-center mt-10">
        Welcome to the Store
      </h1>
      <p className="text-center mt-4 text-gray-600">
        Discover our wide range of products and enjoy seamless shopping
        experience.
      </p>
      <div className="flex flex-wrap justify-center gap-6 p-6">
        <Card products={products} />
      </div>
    </div>
  );
};

export default Home;
