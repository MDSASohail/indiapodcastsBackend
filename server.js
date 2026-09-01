import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

import connectDB from "./config/db.js";
import "./config/cloudinary.js";

import { generalLimiter } from "./middleware/rateLimiter.js";
import errorHandler from "./middleware/errorHandler.js";
import { PORT, CLIENT_URL, NODE_ENV } from "./config/env.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import episodeRoutes from "./routes/episodeRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import shortRoutes from "./routes/shortRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import guestRoutes from "./routes/guestRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import founderRoutes from "./routes/founderRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import subscriberRoutes from "./routes/subscriberRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import pitchRoutes from "./routes/pitchRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import reorderRoutes from './routes/reorderRoutes.js'

// Connect to MongoDB
connectDB();

const app = express();

// ── Security & Middleware ────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  cors({
    origin: [CLIENT_URL, "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

if (NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(generalLimiter);

// Disable caching for API responses in development
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// ── Health Check ─────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "IndiaPodcasts API is running",
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ───────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/episodes", episodeRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/shorts", shortRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/founder", founderRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/subscribers", subscriberRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/pitch", pitchRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/settings", settingsRoutes);
app.use('/api/reorder', reorderRoutes)

// ── 404 Handler ──────────────────────────────────────────────
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ── Global Error Handler ─────────────────────────────────────
app.use(errorHandler);

// ── Start Server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
  console.log(`📡 API URL: http://localhost:${PORT}/api`);
  console.log(`❤️  Health: http://localhost:${PORT}/api/health\n`);
});

export default app;