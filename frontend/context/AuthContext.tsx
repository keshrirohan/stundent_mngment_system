"use client";
import { createContext, useState, useContext } from "react";

interface AuthContextType {
  user: user | null;
  setUser: React.Dispatch<React.SetStateAction<user | null>>;
}

interface user {
  id: number;
  name: string;
  email: string;
  role: string;
}

//auth context to manage user authentication state across the app
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<user | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
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