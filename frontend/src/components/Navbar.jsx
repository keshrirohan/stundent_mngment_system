"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

const Navbar = () => {
  // const { user, logout } = useAuth();
  // Replace with actual user state
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-lg font-bold">Ecommerce</div>

        {/* Desktop links */}
        <div className="hidden md:flex space-x-4 items-center">
          <Link href="/" className="px-3 py-2 hover:bg-gray-700 rounded">
            Home
          </Link>
          <Link href="/about" className="px-3 py-2 hover:bg-gray-700 rounded">
            About
          </Link>
          <Link
            href="/products"
            className="px-3 py-2 hover:bg-gray-700 rounded"
          >
            Products
          </Link>
          {user ? (
            <div className="flex items-center space-x-2">
              <Link
                href="/cart"
                className="px-3 py-2 hover:bg-gray-700 rounded"
              >
                <ShoppingCart />
              </Link>
              <Link
                href="/profile"
                className="px-3 py-2 hover:bg-gray-700 rounded"
              >
                <User />
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                href="/login"
                className="px-3 py-2 hover:bg-gray-700 rounded"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-3 py-2 hover:bg-gray-700 rounded"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen((s) => !s)}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
            className="px-3 py-2 hover:bg-gray-700 rounded"
          >
            Menu
          </button>
        </div>
      </div>

      {/* Mobile collapsible menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700 animate-fade-in">
          <div className="container mx-auto px-4 py-3 flex text-center flex-col space-y-1">
            <Link href="/" className="px-3 py-2 hover:bg-gray-700 rounded">
              Home
            </Link>
            <Link href="/about" className="px-3 py-2 hover:bg-gray-700 rounded">
              About
            </Link>
            <Link
              href="/products"
              className="px-3 py-2 hover:bg-gray-700 rounded"
            >
              Products
            </Link>
            {user ? (
              <div className="border-t border-gray-700 pt-2">
                <button className="px-3 py-2 hover:bg-gray-700 rounded">
                  Logout
                </button>
                <Link
                  href="/cart"
                  className="px-3 py-2 hover:bg-gray-700 rounded mt-1 block  "
                >
                  <ShoppingCart className="w-full" />
                </Link>
                <Link
                  href="/profile"
                  className="px-3 py-2 hover:bg-gray-700 rounded mt-1 block"
                >
                  Profile
                </Link>
              </div>
            ) : (
              <div className="border-t border-gray-700 pt-2">
                <Link
                  href="/login"
                  className="px-3 py-2 hover:bg-gray-700 rounded"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-2 hover:bg-gray-700 rounded mt-1 block"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
