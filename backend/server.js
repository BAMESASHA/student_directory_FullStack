const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const Database = require("better-sqlite3");

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

// Enable CORS only in development
if (NODE_ENV !== "production") {
  app.use(cors());
}

app.use(express.json());

// ===============================
// ✅ SQLite setup (better-sqlite3)
// ===============================
const dbPath = path.join(__dirname, "database.db");
const db = new Database(dbPath);

console.log("✅ Connected to SQLite database");

// Create table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    grade TEXT,
    major TEXT
  )
`).run();

// ===============================
// ✅ Health Check (Railway)
// ===============================
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    environment: NODE_ENV
  });
});

// ===============================
// ✅ API Routes
// ===============================

// Get all students
app.get("/api/students", (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM students").all();
    res.json(rows);
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

// Add a student
app.post("/api/students", (req, res) => {
  const { name, email, grade, major } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  try {
    const result = db
      .prepare(
        "INSERT INTO students (name, email, grade, major) VALUES (?, ?, ?, ?)"
      )
      .run(name, email, grade, major);

    res.status(201).json({
      id: result.lastInsertRowid,
      name,
      email,
      grade,
      major
    });
  } catch (err) {
    console.error("❌ Insert error:", err);
    res.status(500).json({ error: "Failed to insert student" });
  }
});

// ===============================
// ✅ Serve Frontend (Production)
// ===============================
if (NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");

  app.use(express.static(frontendPath));

  // SPA fallback (React Router support)
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// ===============================
// ✅ Global error safety
// ===============================
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection:", reason);
});

// ===============================
// ✅ Start Server (Railway‑correct)
// ===============================
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
});

// ===============================
// ✅ Graceful shutdown (Railway requires this)
// ===============================
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});
