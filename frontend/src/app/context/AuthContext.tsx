"use client";

import React, { createContext, useState, useContext, useEffect } from "react";

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => Promise<void>;
  loading: boolean; // exposed so UI can show spinner during hydration
}

interface User {
  name: string;
  email: string;
  role: string;
}

// Auth context to manage user authentication state across the app
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Fix #6: true until session check completes

  // Fix #6: Hydrate session from cookie on every page load / refresh
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URI}/auth/me`,
          { credentials: "include" }, // sends the httpOnly cookie to the backend
        );
        if (res.ok) {
          const data = await res.json();

          setUser({
            name: data.name,
            email: data.email,
            role: data.role ?? "user",
          });
        }
      } catch {
        // Network error or not logged in — safe to ignore
      } finally {
        setLoading(false); // always unblock rendering
      }
    };
    restoreSession();
  }, []);

  const logout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
