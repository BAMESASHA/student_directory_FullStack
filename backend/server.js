const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const Database = require("better-sqlite3");

// Routes
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");

// ===============================
// 🌍 Environment
// ===============================
dotenv.config();
const app = express();

const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 5000;

// ===============================
// ✅ Middleware
// ===============================
if (NODE_ENV !== "production") {
  app.use(cors());
}
app.use(express.json());

// ===============================
// ✅ SQLite setup
// ===============================
const dbPath = path.join(__dirname, "database.db");
const db = new Database(dbPath);
console.log("✅ Connected to SQLite database");

// Make DB available to routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

// ===============================
// ✅ Database schema
// ===============================
db.prepare(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    grade TEXT,
    major TEXT
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`).run();

// ===============================
// ✅ Public routes (NO AUTH)
// ===============================
app.get("/health", (req, res) => {
  res.json({ status: "ok", environment: NODE_ENV });
});

// ===============================
// ✅ API routes
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);

// ===============================
// ✅ FRONTEND (ALWAYS PUBLIC)
// ===============================
if (NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");

  // Serve static assets
  app.use(express.static(frontendPath));

  // React router fallback (Express 5 safe)
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// ===============================
// ✅ Safety nets
// ===============================
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled rejection:", err);
});

// ===============================
// ✅ Start Server
// ===============================
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
});

// ===============================
// ✅ Graceful shutdown
// ===============================
process.on("SIGTERM", () => {
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});
