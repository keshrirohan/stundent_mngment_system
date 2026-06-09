"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    router.push("/login");
  };

  const isActive = (href: string) => pathname === href;

  const linkCls = (href: string) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
      isActive(href)
        ? "bg-zinc-700 text-white"
        : "text-zinc-400 hover:text-white hover:bg-zinc-800"
    }`;

  const mobileLinkCls = (href: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
      isActive(href)
        ? "bg-zinc-800 text-white"
        : "text-zinc-400 hover:text-white hover:bg-zinc-800/70"
    }`;

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-200"
        style={{
          background: scrolled ? "rgba(9,9,11,0.97)" : "#09090b",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          boxShadow: scrolled ? "0 1px 20px rgba(0,0,0,0.4)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Brand */}
            <Link href="/" className="flex items-center gap-2.5" id="nav-brand">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm"
                style={{ background: "linear-gradient(135deg, #3f3f46, #71717a)" }}
              >
                E
              </div>
              <span className="text-white font-bold text-lg tracking-tight">Ecommerce</span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              <Link href="/" className={linkCls("/")} id="nav-home">Home</Link>
              <Link href="/about" className={linkCls("/about")} id="nav-about">About</Link>
              {user && <Link href="/products" className={linkCls("/products")} id="nav-products">Products</Link>}
            </div>

            {/* Desktop auth */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <>
                  <Link
                    href="/cart"
                    className={linkCls("/cart")}
                    id="nav-cart"
                    aria-label="Cart"
                  >
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </svg>
                      Cart
                    </span>
                  </Link>

                  <Link
                    href="/profile"
                    id="nav-profile"
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive("/profile") ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: "linear-gradient(135deg, #3f3f46, #71717a)" }}
                    >
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    {user.name?.split(" ")[0] || "Profile"}
                  </Link>

                  <button
                    id="nav-logout"
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-150"
                    style={{ border: "1px solid rgba(239,68,68,0.15)" }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    id="nav-login"
                    className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all duration-150"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    id="nav-register"
                    className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all duration-150 hover:opacity-90"
                    style={{ background: "#27272a", border: "1px solid rgba(255,255,255,0.12)" }}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Hamburger */}
            <button
              id="nav-hamburger"
              onClick={() => setMenuOpen((s) => !s)}
              aria-expanded={menuOpen}
              aria-label="Toggle navigation menu"
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-zinc-800 transition-all duration-150 gap-1.5 p-2"
            >
              <span className={`block h-0.5 w-5 bg-zinc-400 rounded-full transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block h-0.5 w-5 bg-zinc-400 rounded-full transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
              <span className={`block h-0.5 w-5 bg-zinc-400 rounded-full transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}`}
          style={{ borderTop: menuOpen ? "1px solid rgba(255,255,255,0.06)" : "none" }}
          id="mobile-menu"
        >
          <div className="px-4 py-4 space-y-1" style={{ background: "#09090b" }}>

            <p className="px-4 pt-1 pb-2 text-xs font-semibold text-zinc-600 uppercase tracking-widest">
              Navigation
            </p>

            <Link href="/" className={mobileLinkCls("/")} id="mobile-home">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9,22 9,12 15,12 15,22" />
              </svg>
              Home
            </Link>

            <Link href="/about" className={mobileLinkCls("/about")} id="mobile-about">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              About
            </Link>

            {user && (
              <Link href="/products" className={mobileLinkCls("/products")} id="mobile-products">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                Products
              </Link>
            )}

            {/* Auth section */}
            <div className="pt-3 mt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              {user ? (
                <>
                  <p className="px-4 pb-2 text-xs font-semibold text-zinc-600 uppercase tracking-widest">Account</p>

                  {/* User card */}
                  <div
                    className="mx-1 mb-2 p-3 rounded-xl flex items-center gap-3"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #3f3f46, #71717a)" }}
                    >
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{user.name}</p>
                      <p className="text-zinc-500 text-xs truncate">{user.email}</p>
                    </div>
                  </div>

                  <Link href="/profile" className={mobileLinkCls("/profile")} id="mobile-profile">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                    </svg>
                    Profile
                  </Link>

                  <Link href="/cart" className={mobileLinkCls("/cart")} id="mobile-cart">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    Cart
                  </Link>

                  <button
                    id="mobile-logout"
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-150 mt-1"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16,17 21,12 16,7" /><line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <p className="px-4 pb-2 text-xs font-semibold text-zinc-600 uppercase tracking-widest">Account</p>
                  <Link href="/login" className={mobileLinkCls("/login")} id="mobile-login">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10,17 15,12 10,7" /><line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white mt-1 transition-all hover:opacity-90"
                    style={{ background: "#27272a", border: "1px solid rgba(255,255,255,0.1)" }}
                    id="mobile-register"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" />
                    </svg>
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Navbar;
