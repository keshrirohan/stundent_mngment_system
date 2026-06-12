"use client";
import React, { useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";

const Cart = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Fetch cart items from API or local storage
    const fetchCartItems = async () => {
      if (!user) return; // Ensure user is available before fetching cart items
      console.log("Fetching cart items for user:", user);
    };
    fetchCartItems();
  }, [user]);

  return (
    <div>
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <p className="text-gray-600">Your cart is currently empty.</p>
      </div>
    </div>
  );
};

export default Cart;
