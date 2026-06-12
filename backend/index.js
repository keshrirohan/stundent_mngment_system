import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser"; // Fix #2: was "cookies-parser" (wrong package) — req.cookies was always undefined
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: process.env.Frontend_Url || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.urlencoded({ extended: true }));
// Parses incoming JSON request bodies and makes them available on req.body
app.use(express.json());
app.use(cookieParser()); // Fix #2: must be called as middleware — populates req.cookies

connectDB();

app.get("/", (req, res) => {
  res.send("Backend Working");
});
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/liked", likedRoutes); // Fix #12: was missing route for liked products, now added to auth routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
