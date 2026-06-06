import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Fix #23: replaced default "Create Next App" placeholder metadata
export const metadata: Metadata = {
  title: "Ecommerce Store | Best Products Online",
  description:
    "Shop the best products at unbeatable prices. Fast shipping, secure checkout, and exclusive deals every day.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Navbar />
          {children}
          {/* Single <Toaster> instance lives here — Fix #19: removed duplicate from page.tsx */}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
