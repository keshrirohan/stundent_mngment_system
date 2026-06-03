"use client";
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";

const Home = () => {
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/products/fetchdata`,
        );
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <Navbar />
      <h1 className="text-4xl font-bold text-center mt-10">
        Welcome to the Store
      </h1>
      <p className="text-center mt-4 text-gray-600">
        Discover our wide range of products and enjoy seamless shopping
        experience.
      </p>
      <div className="flex flex-wrap justify-center gap-6 p-6">
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden w-72">
          {/* Product Image */}
        </div>
      </div>
    </div>
  );
};

export default Home;
