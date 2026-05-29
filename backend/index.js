import express from "express";

import dotenv from "dotenv";
import cors from "cors";
import {connectDB} from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
//it uses to extract the data from the body of the request and make it available in req.body as a json object
app.use(express.json());

connectDB();


app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

