import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// ✅ Routes
import featureRoutes from "./routes/featureRoutes.js";
import industryRoutes from "./routes/industryRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import caseStudyRoutes from "./routes/caseStudyRoutes.js";

dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  });

// ✅ API Routes
app.use("/api/features", featureRoutes);
app.use("/api/industries", industryRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/casestudies", caseStudyRoutes);

// ✅ Home route
app.get("/", (req, res) => {
  res.send("Safesite Backend Running 🚀");
});

// ✅ 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "❌ API route not found",
    path: req.originalUrl,
  });
});

// ✅ Global Error Handler (500)
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);

  res.status(500).json({
    success: false,
    message: "🔥 Internal Server Error",
    error: err.message,
  });
});

// ✅ Port Config (Dynamic for Vercel + Local)
const PORT = process.env.PORT || 5000;

// ✅ Only start server locally, Vercel handles automatically
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () =>
    console.log(`✅ Server running at http://localhost:${PORT}`)
  );
}

export default app;
