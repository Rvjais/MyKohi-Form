import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import connectDB, { isDBConnected } from "./config/db.js";
import templateRoutes from "./routes/templates.js";
import submissionRoutes from "./routes/submissions.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://my-kohi-form-client.vercel.app",
    "https://my-kohi-form.vercel.app",
  ],
  credentials: true,
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// DB health check middleware
app.use("/api", (req, res, next) => {
  if (req.path === "/health") return next();
  if (!isDBConnected()) {
    return res.status(503).json({
      message: "Database not connected. Please set MONGODB_URI in your Vercel environment variables.",
    });
  }
  next();
});

// Routes
app.use("/api/templates", templateRoutes);
app.use("/api/submissions", submissionRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  } else if (err) {
    return res.status(res.statusCode === 200 ? 400 : res.statusCode).json({ message: err.message });
  }
  next();
});

// Connect DB (we do not await here specifically for serverless handlers since subsequent routes will run async against mongo connection pool)
connectDB();

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
