import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDb from "./config/db.js";
import authRoutes from "./routers/authRoutes.js";
import adminRoutes from "./routers/adminRoutes.js";
import resourceRoutes from "./routers/resourceRoutes.js";
import applicationRoutes from "./routers/applicationRoutes.js";
import courseRoutes from "./routers/courseRoutes.js";
import tutorRoutes from "./routers/tutorRoutes.js";
import paymentRoutes from "./routers/paymentRoutes.js";
import categoryRoutes from "./routers/categoryRoutes.js";
import notificationRoutes from "./routers/notificationRoutes.js";
import path from "path";

dotenv.config();
const app = express();

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
connectDb();

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/tutors", tutorRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
