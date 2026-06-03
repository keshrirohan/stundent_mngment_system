"use client";
import React, { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const handleSearch = async (e) => {
    // Implement search logic here
    e.preventDefault();
    await fetch(
      `${process.env.Backend_URI}/products/search?query=${e.target.value}`,
    );
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-lg font-bold">MyApp</div>

        {/* Search - hidden on very small screens */}
        <div className="relative hidden sm:block sm:w-1/3">
          <input
            type="text"
            placeholder="Search..."
            aria-label="Search"
            onChange={handleSearch}
            className="w-full bg-gray-700 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

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
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-1">
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
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
