import express from "express";
import cors from "cors";
import connectDb from "./config/db.js";
import dotenv from "dotenv";
import authRoutes from "./routers/authRoutes.js";
import adminRoutes from "./routers/adminRoutes.js";
import resourceRoutes from "./routers/resourceRoutes.js";
import path from "path";




dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
connectDb();
app.use(cors({
  origin: "https://skillnesteducation1.netlify.app"
}));
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/resources", resourceRoutes);
app.listen(process.env.PORT, () =>
  console.log(`Server running on ${process.env.PORT}`)
);

