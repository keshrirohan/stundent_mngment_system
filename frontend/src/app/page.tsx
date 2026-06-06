"use client";
import React, { useEffect } from "react";
import Image from "next/image";

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
          `${process.env.NEXT_PUBLIC_BACKEND_URI}/products/fetchdata`
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
        {products.map((product) => (
          <div
            key={product._id}
            className="w-72 bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
          >
            <div className="relative">
              {/* Fix #16: guard against empty imageUrl array — was crashing with imageUrl[0] on undefined */}
              {product.imageUrl?.[0] ? (
                <Image
                  src={product.imageUrl[0]}
                  alt={product.name}
                  className="w-full h-56 object-cover"
                  width={288}
                  height={224}
                />
              ) : (
                <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No Image</span>
                </div>
              )}

              <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {Math.round(
                  ((product.mrp - product.selling_price) / product.mrp) * 100
                )}
                % OFF
              </span>
            </div>

            <div className="p-4">
              <h2 className="text-lg font-bold text-gray-800">
                {product.name}
              </h2>

              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center mt-3">
                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                  4.5 ★
                </span>

                <span className="ml-2 text-sm text-gray-500">
                  {product.reviews || 0} Reviews
                </span>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <span className="text-2xl font-bold text-gray-900">
                  ₹{product.selling_price.toLocaleString()}
                </span>

                <span className="text-gray-400 line-through">
                  ₹{product.mrp.toLocaleString()}
                </span>

                <span className="text-green-600 text-sm font-semibold">
                  Save ₹{(product.mrp - product.selling_price).toLocaleString()}
                </span>
              </div>

              <div className="mt-2">
                {product.isInStock ? (
                  <span className="text-green-600 text-sm font-medium">
                    In Stock
                  </span>
                ) : (
                  <span className="text-red-600 text-sm font-medium">
                    Out of Stock
                  </span>
                )}
              </div>

              <div className="flex gap-3 mt-5">
                <button className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg font-medium">
                  Add to Cart
                </button>

                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
