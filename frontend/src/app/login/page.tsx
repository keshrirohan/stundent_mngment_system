"use client";
import React, { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { errorToast, successToast } from "@/app/utils/toast";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const { setUser } = useAuth();
  const [email, setEmail] = useState<string>("");
  const router = useRouter();
  const [password, setPassword] = useState<string>("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        console.log("Login successful:", data);
        setUser(data);
        successToast("Login successful!");
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        // Handle login error, e.g., show error message
        errorToast(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      errorToast("An error occurred during login. Please try again.");
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 px-4 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sign in to continue to your account
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Email Address
            </label>

            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>

              <a
                href="/forgot-password"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
          >
            Login
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">
              OR
            </span>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          {`Don't have an account?`}{" "}
          <Link
            href="/register"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
